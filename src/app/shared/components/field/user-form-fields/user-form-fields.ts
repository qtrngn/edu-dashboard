import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldWrapper } from '@shared/components/field/field-wrapper/field-wrapper';
import type {
  UserFormValue,
  UserManagementFieldConfig,
  UserManagementFieldMode,
  UserManagementFieldName,
} from '@app/types/user-management.types';

@Component({
  selector: 'app-user-form-fields',
  imports: [FieldWrapper],
  templateUrl: './user-form-fields.html',
})
export class UserFormFields {
  @Input({ required: true }) fields: UserManagementFieldConfig[] = [];
  @Input() value: UserFormValue = {};
  @Input() mode: UserManagementFieldMode = 'edit';

  @Output() valueChange = new EventEmitter<UserFormValue>();

  getFieldValue(fieldname: UserManagementFieldName): string {
    return this.value[fieldname] ?? '';
  }

  handleFieldValueChange(fieldname: UserManagementFieldName, value: string): void {
    this.valueChange.emit({
      ...this.value,
      [fieldname]: value,
    });
  }
}
