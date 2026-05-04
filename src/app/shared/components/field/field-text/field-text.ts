import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldBase } from '@shared/components/field/field-base/field-base';
import type {
  UserManagementFieldConfig,
  UserManagementFieldMode,
} from '@app/types/user-management.types';

@Component({
  selector: 'app-field-text',
  imports: [FieldBase],
  templateUrl: './field-text.html',
})
export class FieldText {
  @Input({ required: true }) field!: UserManagementFieldConfig;
  @Input() value = '';
  @Input() mode: UserManagementFieldMode = 'edit';

  @Output() valueChange = new EventEmitter<string>();

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
