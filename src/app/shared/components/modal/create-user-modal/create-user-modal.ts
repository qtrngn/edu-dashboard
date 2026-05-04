import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ModalBase } from '@shared/components/modal/modal-base/modal-base';
import { UserFormFields } from '@shared/components/field/user-form-fields/user-form-fields';
import { EManagedUserType } from '@enums/user-management.enum';
import {
  USER_MANAGEMENT_DISPLAY_CONFIG,
  getUserManagementFields,
} from '@configs/user-management.config';
import { getCreateUserModalConfig } from '@configs/user-management-modal.config';
import type {
  CreateUserInput,
  UserFormValue,
  UserManagementDisplayConfig,
  UserManagementFieldName,
  UserManagementFieldConfig,
} from '@app/types/user-management.types';
import type { BaseModalConfig } from '@app/types/modal.types';

@Component({
  selector: 'app-create-user-modal',
  imports: [ModalBase, UserFormFields],
  templateUrl: './create-user-modal.html',
})
export class CreateUserModal implements OnInit {
  @Input({ required: true }) managedUserType!: EManagedUserType;

  @Output() closeClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<CreateUserInput>();

  readonly form = signal<UserFormValue>({});

  get displayConfig(): UserManagementDisplayConfig {
    return USER_MANAGEMENT_DISPLAY_CONFIG[this.managedUserType];
  }

  get fields(): UserManagementFieldConfig[] {
    return getUserManagementFields(this.managedUserType);
  }

  get modalConfig(): BaseModalConfig {
    return getCreateUserModalConfig(this.displayConfig);
  }

  // Initialize an empty form based on the current managed user type
  ngOnInit(): void {
    this.form.set(this.getEmptyForm());
  }

  // Tell parents to close modal
  onCloseClick(): void {
    this.closeClicked.emit();
  }

  // Update modal's local form state
  onFormChange(updatedForm: UserFormValue): void {
    this.form.set(updatedForm);
  }

  // Build create input and send it to the parent
  onSaveClick(): void {
    const createInput = this.buildCreateInput(this.form());

    this.saveClicked.emit(createInput);
  }

  // Modal controls actions
  onModalAction(action: string): void {
    if (action === 'cancel') {
      this.onCloseClick();
      return;
    }
    if (action === 'submit') {
      this.onSaveClick();
    }
  }

  // Build empty form values from configured fields
  private getEmptyForm(): UserFormValue {
    return this.fields.reduce<UserFormValue>((formValue, field) => {
      formValue[field.fieldname] = '';
      return formValue;
    }, {});
  }

  private buildCreateInput(form: UserFormValue): CreateUserInput {
  const input = {
    type: this.managedUserType,
  } as CreateUserInput & Record<UserManagementFieldName, string>;

  this.fields.forEach((field) => {
    input[field.fieldname] = this.trimValue(form, field.fieldname);
  });

  return input;
}

  private trimValue(form: UserFormValue, fieldname: UserManagementFieldName): string {
    return (form[fieldname] ?? '').trim();
  }
}
