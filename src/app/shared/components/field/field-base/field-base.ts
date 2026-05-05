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

  // todo:
  //  research from field in wellbytes crm: use extends field base to create field type (text/number/date...)
  //  in field base, handle common logic (ex: view/edit mode, display value...)
  //  other fields override functions or create new functions if need custom



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
