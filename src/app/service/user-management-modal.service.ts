import { Injectable, signal } from '@angular/core';
import type { UserRow } from '@app/types/user-management.types';

@Injectable()
export class UserManagementModalService {
  readonly selectedUser = signal<UserRow | null>(null);
  readonly isCreateModalOpen = signal(false);
  readonly isDetailModalOpen = signal(false);
  readonly isDeleteConfirmOpen = signal(false);
  readonly isEditingSelectedUser = signal(false);

//   CREATE USER MODAL
  openCreateModal(): void {
    this.closeAll();
    this.isCreateModalOpen.set(true);
  };

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  };

//   DETAIL USER MODAL
  openDetailModal(user: UserRow): void {
    this.closeAll();
    this.selectedUser.set(user);
    this.isDetailModalOpen.set(true);
  };

  closeDetailModal(): void {
    this.selectedUser.set(null);
    this.isEditingSelectedUser.set(false);
    this.isDetailModalOpen.set(false);
    this.isDeleteConfirmOpen.set(false);
  };

//   EDITING USER
  startEditingSelectedUser(): void {
    if (!this.selectedUser()) {
      return;
    };

    this.isEditingSelectedUser.set(true);
  };

  stopEditingSelectedUser(): void {
    this.isEditingSelectedUser.set(false);
  };

//   DELETE USER CONFIRM MODAL 
  openDeleteConfirm(): void {
    if (!this.selectedUser()) {
      return;
    };

    this.isDeleteConfirmOpen.set(true);
  };

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen.set(false);
  };

//   CLOSE MODALS
  closeAll(): void {
    this.selectedUser.set(null);
    this.isCreateModalOpen.set(false);
    this.isDetailModalOpen.set(false);
    this.isDeleteConfirmOpen.set(false);
    this.isEditingSelectedUser.set(false);
  };
};