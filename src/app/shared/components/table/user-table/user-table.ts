import { Component, Input, EventEmitter, Output } from '@angular/core';
import { getUserManagementFields } from '@configs/user-management.config';
import { EManagedUserType } from '@enums/user-management.enum';
import type {
  UserManagementFieldConfig,
  UserManagementFieldName,
  UserRow,
} from '@app/types/user-management.types';

@Component({
  selector: 'app-user-table',
  imports: [],
  templateUrl: './user-table.html',
})
export class UserTable {
  @Input({ required: true }) managedUserType!: EManagedUserType;
  @Input({ required: true }) users: UserRow[] = [];
  @Input() emptyMessage = 'No records found.';

  @Output() rowClicked = new EventEmitter<UserRow>();

  onRowClick(user: UserRow): void {
    this.rowClicked.emit(user);
  }

  get columns(): UserManagementFieldConfig[] {
    return getUserManagementFields(this.managedUserType);
  }

  getCellValue(user: UserRow, fieldname: UserManagementFieldName): string {
    const value = user[fieldname as keyof UserRow];

    return typeof value === 'string' ? value : '';
  }
}
