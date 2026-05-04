import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldText } from '@shared/components/field/field-text/field-text';
import type {
  UserManagementFieldConfig,
  UserManagementFieldMode,
} from '@app/types/user-management.types';

@Component({
  selector: 'app-field-wrapper',
  imports: [FieldText],
  templateUrl: './field-wrapper.html',
})
export class FieldWrapper {
  @Input({ required: true }) field!: UserManagementFieldConfig;
  @Input() value = '';
  @Input() mode: UserManagementFieldMode = 'edit';

  @Output() valueChange = new EventEmitter<string>();

  handleValueChange(value: string): void {
    this.valueChange.emit(value);
  }
}
