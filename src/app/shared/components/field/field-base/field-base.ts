import { Component, Input } from '@angular/core';
import type {
  UserManagementFieldConfig,
  UserManagementFieldMode,
} from '@app/types/user-management.types';

@Component({
  selector: 'app-field-base',
  imports: [],
  templateUrl: './field-base.html',
})
export class FieldBase {
  @Input({ required: true }) field!: UserManagementFieldConfig;
  @Input() mode: UserManagementFieldMode = 'edit';
  @Input() value = '';

  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  get displayValue(): string {
    return this.value?.trim() || '—';
  }
}
