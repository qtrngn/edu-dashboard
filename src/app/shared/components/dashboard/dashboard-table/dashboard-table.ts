import { Component, Input, EventEmitter, Output } from '@angular/core';
import type {
  TeacherRow,
  StudentRow,
  UserRow,
} from '@pages/dashboard/types/user-management.types';

@Component({
  selector: 'app-user-table',
  imports: [],
  templateUrl: './dashboard-table.html',
})
export class DashboardTable {
  @Input({ required: true }) users: UserRow[] = [];
  @Output() rowClicked = new EventEmitter<UserRow>();

  onRowClick(user: UserRow): void {
    this.rowClicked.emit(user);
  }

  isTeacherRow(user: UserRow): user is TeacherRow {
    return user.type === 'teacher';
  }

  isStudentRow(user: UserRow): user is StudentRow {
    return user.type === 'student';
  }
}
