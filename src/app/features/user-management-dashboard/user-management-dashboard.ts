import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { UserTable } from '@shared/components/table/user-table/user-table';
import { CreateUserModal } from '@shared/components/modal/create-user-modal/create-user-modal';
import { UserDetailModal } from '@shared/components/modal/user-detail-modal/user-detail-modal';
import { DeleteModal } from '@shared/components/modal/delete-modal/delete-modal';
import { UserManagementOperationsService } from '@service/user-management-operations.service';
import { UserManagementModalService } from '@service/user-management-modal.service';
import { EManagedUserType } from '@enums/user-management.enum';
import { USER_MANAGEMENT_DISPLAY_CONFIG } from '@configs/user-management.config';
import type {
  CreateUserInput,
  UserManagementDisplayConfig,
  UserRow,
} from '@app/types/user-management.types';

@Component({
  selector: 'app-user-management-dashboard',
  imports: [UserTable, CreateUserModal, UserDetailModal, DeleteModal],
  providers: [UserManagementModalService],
  templateUrl: './user-management-dashboard.html',
})
export class UserManagementDashboard implements OnInit {
  private readonly userManagementOperationsService = inject(UserManagementOperationsService);
  private readonly userManagementModalService = inject(UserManagementModalService);

  @Input({ required: true }) managedUserType!: EManagedUserType;

  // States
  readonly users = signal<UserRow[]>([]);
  readonly isLoading = signal(false);
  readonly selectedUser = this.userManagementModalService.selectedUser;
  readonly isCreateModalOpen = this.userManagementModalService.isCreateModalOpen;
  readonly isDetailModalOpen = this.userManagementModalService.isDetailModalOpen;
  readonly isDeleteConfirmOpen = this.userManagementModalService.isDeleteConfirmOpen;
  readonly isEditingSelectedUser = this.userManagementModalService.isEditingSelectedUser;


  get displayConfig(): UserManagementDisplayConfig {
    return USER_MANAGEMENT_DISPLAY_CONFIG[this.managedUserType];
  }

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    try {
      const users = await this.userManagementOperationsService.getUsersList(this.managedUserType);
      this.users.set(users);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Create modal
  openCreateModal(): void {
    this.userManagementModalService.openCreateModal();
  }

  closeCreateModal(): void {
    this.userManagementModalService.closeCreateModal();
  }

  async handleCreateSave(input: CreateUserInput): Promise<void> {
    this.isLoading.set(true);

    try {
      const createdUser = await this.userManagementOperationsService.createUser(input);

      this.users.update((current) => [...current, createdUser]);
      this.closeCreateModal();
    } finally {
      this.isLoading.set(false);
    }
  }

  // Detail modal
  openDetailModal(user: UserRow): void {
    this.userManagementModalService.openDetailModal(user);
  }

  closeDetailModal(): void {
    this.userManagementModalService.closeDetailModal();
  }

  // Editing users
  startEditingSelectedUser(): void {
    this.userManagementModalService.startEditingSelectedUser();
  }

  stopEditingSelectedUser(): void {
    this.userManagementModalService.stopEditingSelectedUser();
  }

  async handleDetailSave(updatedUser: UserRow): Promise<void> {
    this.isLoading.set(true);

    try {
      const savedUser = await this.userManagementOperationsService.updateUser(updatedUser);

      this.users.update((current) =>
        current.map((user) => (user.id === savedUser.id ? savedUser : user)),
      );

      this.userManagementModalService.selectedUser.set(savedUser);
      this.stopEditingSelectedUser();
    } finally {
      this.isLoading.set(false);
    }
  }

  // Delete confirm modal
  openDeleteConfirm(): void {
    this.userManagementModalService.openDeleteConfirm();
  }

  closeDeleteConfirm(): void {
    this.userManagementModalService.closeDeleteConfirm();
  }

  async handleDeleteConfirm(): Promise<void> {
    const user = this.selectedUser();

    if (!user) return;

    this.isLoading.set(true);

    try {
      await this.userManagementOperationsService.deleteUser(user.type, user.id);

      this.users.update((current) => current.filter((row) => row.id !== user.id));

      this.closeDeleteConfirm();
      this.closeDetailModal();
    } finally {
      this.isLoading.set(false);
    }
  }
}
