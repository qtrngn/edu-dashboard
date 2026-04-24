import { Component, Input, OnInit, signal } from '@angular/core';
import { DashboardTable } from '@shared/components/dashboard/dashboard-table/dashboard-table';
import { CreateUserModal } from '@shared/components/dashboard/create-user-modal/create-user-modal';
import { UserDetailModal } from '@shared/components/dashboard/user-detail-modal/user-detail-modal';
import { DeleteModal } from '@shared/components/dashboard/delete-modal/delete-modal';
import { UserDirectoryService } from '@service/user-directory.service';
import type {
  DashboardMode,
  UserRow,
  CreateUserInput,
  TeacherRow,
  StudentRow,
} from '@pages/dashboard/types/user-management.types';

@Component({
  selector: 'app-user-management-dashboard',
  imports: [DashboardTable, CreateUserModal, UserDetailModal, DeleteModal],
  templateUrl: './user-management-dashboard.html',
})
export class UserManagementDashboard implements OnInit {
  @Input({ required: true }) mode!: DashboardMode;

  // States
  readonly users = signal<UserRow[]>([]);
  readonly selectedUser = signal<UserRow | null>(null);
  readonly isCreateModalOpen = signal(false);
  readonly isDetailModalOpen = signal(false);
  readonly isDeleteConfirmOpen = signal(false);
  readonly isEditingSelectedUser = signal(false);
  readonly isLoading = signal(false);

  constructor(private readonly userDirectoryService: UserDirectoryService) {}

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading.set(true);

    try {
      if (this.mode === 'teacher') {
        const teachers = await this.userDirectoryService.getTeachers();
        this.users.set(teachers);
        return;
      }

      const students = await this.userDirectoryService.getStudents();
      this.users.set(students);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Create modal
  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  async handleCreateSave(input: CreateUserInput): Promise<void> {
    this.isLoading.set(true);

    try {
      const createdUser =
        input.type === 'teacher'
          ? await this.userDirectoryService.createTeacher(input)
          : await this.userDirectoryService.createStudent(input);

      this.users.update((current) => [...current, createdUser]);
      this.closeCreateModal();
    } finally {
      this.isLoading.set(false);
    }
  }

  // Detail modal
  openDetailModal(user: UserRow): void {
    this.selectedUser.set(user);
    this.isEditingSelectedUser.set(false);
    this.isDetailModalOpen.set(true);
  }

  closeDetailModal(): void {
    this.selectedUser.set(null);
    this.isEditingSelectedUser.set(false);
    this.isDetailModalOpen.set(false);
  }

  // Editing users
  startEditingSelectedUser(): void {
    if (!this.selectedUser()) return;
    this.isEditingSelectedUser.set(true);
  }

  stopEditingSelectedUser(): void {
    this.isEditingSelectedUser.set(false);
  }

  async handleDetailSave(updatedUser: UserRow): Promise<void> {
    this.isLoading.set(true);

    try {
      const savedUser =
        updatedUser.type === 'teacher'
          ? await this.userDirectoryService.updateTeacher(updatedUser as TeacherRow)
          : await this.userDirectoryService.updateStudent(updatedUser as StudentRow);

      this.users.update((current) =>
        current.map((user) => (user.id === savedUser.id ? savedUser : user)),
      );

      this.selectedUser.set(savedUser);
      this.stopEditingSelectedUser();
    } finally {
      this.isLoading.set(false);
    }
  }

  // Delete confirm modal
  openDeleteConfirm(): void {
    if (!this.selectedUser()) return;
    this.isDeleteConfirmOpen.set(true);
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen.set(false);
  }

  async handleDeleteConfirm(): Promise<void> {
    const user = this.selectedUser();

    if (!user) return;

    this.isLoading.set(true);

    try {
      if (user.type === 'teacher') {
        await this.userDirectoryService.deleteTeacher(user.id);
      } else {
        await this.userDirectoryService.deleteStudent(user.id);
      }

      this.users.update((current) => current.filter((row) => row.id !== user.id));

      this.closeDeleteConfirm();
      this.closeDetailModal();
    } finally {
      this.isLoading.set(false);
    }
  }
}
