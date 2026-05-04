import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
// COMPONENTS
import { UserFormFields } from '@shared/components/field/user-form-fields/user-form-fields';
import { ModalBase } from '@shared/components/modal/modal-base/modal-base';
// CONFIGS
import {
  getUserManagementFields,
  USER_MANAGEMENT_DISPLAY_CONFIG,
} from '@configs/user-management.config';
import { getUserDetailModalConfig } from '@configs/user-management-modal.config';
// TYPES
import type {
  UserFormValue,
  UserManagementDisplayConfig,
  UserManagementFieldConfig,
  UserManagementFieldName,
  UserRow,
  UserManagementFieldMode 
} from '@app/types/user-management.types';
import type { BaseModalConfig } from '@app/types/modal.types';


@Component({
  selector: 'app-user-detail-modal',
  imports: [ModalBase, UserFormFields],
  templateUrl: './user-detail-modal.html',
})
export class UserDetailModal implements OnChanges {
  @Input({ required: true }) user!: UserRow;
  @Input() isEditing = false;

  @Output() closeClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<void>();
  @Output() cancelEditClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<UserRow>();
  @Output() deleteClicked = new EventEmitter<void>();

  readonly form = signal<UserFormValue>({});

  get displayConfig(): UserManagementDisplayConfig {
    return USER_MANAGEMENT_DISPLAY_CONFIG[this.user.type];
  };

  get modalConfig() : BaseModalConfig {
    return getUserDetailModalConfig(this.displayConfig, this.isEditing);
  };

  get fields(): UserManagementFieldConfig[] {
    return getUserManagementFields(this.user.type);
  };

  get fieldMode(): UserManagementFieldMode {
    return this.isEditing ? 'edit' : 'view';
  }

  // When selected user changes, reset the local edit form with that user's data
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.syncFormFromUser();
    }
  }

  // Close modal
  onCloseClick(): void {
    this.closeClicked.emit();
  }

  // Switch modal into edit mode
  onEditClick(): void {
    this.editClicked.emit();
  }

  // Reset local form and leave edit mode
  onCancelEditClick(): void {
    this.syncFormFromUser();
    this.cancelEditClicked.emit();
  }

  // Open delete confirmation modal
  onDeleteClick(): void {
    this.deleteClicked.emit();
  }

  // Update modal's local form state
  onFormChange(updatedForm: UserFormValue): void {
    this.form.set(updatedForm);
  }

  // Build updated user
  onSaveClick(): void {
    const updatedUser = this.buildUpdatedUser(this.form());

    this.saveClicked.emit(updatedUser);
  }

  // Modal controls actions
  onModalAction(action: string): void {
  if (action === 'edit') {
    this.onEditClick();
    return;
  }

  if (action === 'delete') {
    this.onDeleteClick();
    return;
  }

  if (action === 'cancel-edit') {
    this.onCancelEditClick();
    return;
  }

  if (action === 'save') {
    this.onSaveClick();
  }
}

  // Fill form values based on configured fields for the selected user type
  private syncFormFromUser(): void {
    const formValue = getUserManagementFields(this.user.type).reduce<UserFormValue>(
      (nextFormValue, field) => {
        nextFormValue[field.fieldname] = this.getUserValue(field.fieldname);
        return nextFormValue;
      },
      {},
    );

    this.form.set(formValue);
  }

  // Dynamically update all configured fields
  private buildUpdatedUser(form: UserFormValue): UserRow {
    const updatedUser = {
      ...this.user,
    } as UserRow & Record<UserManagementFieldName, string>;

    getUserManagementFields(this.user.type).forEach((field) => {
      updatedUser[field.fieldname] = this.trimValue(form, field.fieldname);
    });

    return updatedUser;
  }

  // Read a value from the selected user
  private getUserValue(fieldname: UserManagementFieldName): string {
    const value = this.user[fieldname as keyof UserRow];

    return typeof value === 'string' ? value : '';
  }

  private trimValue(form: UserFormValue, fieldname: UserManagementFieldName): string {
    return (form[fieldname] ?? '').trim();
  }
}
