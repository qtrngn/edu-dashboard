import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { DashboardMode, UserFormValue } from '@pages/dashboard/types/user-management.types';

type UserFormFieldKey = 'name' | 'teacherId' | 'subject' | 'school' | 'studentId' | 'grade';

interface UserFormField {
  key: UserFormFieldKey;
  label: string;
  placeholder: string;
}

@Component({
  selector: 'app-user-form-fields',
  imports: [],
  templateUrl: './user-form-fields.html',
})
export class UserFormFields {
  @Input({ required: true }) mode!: DashboardMode;
  @Input({ required: true }) value!: UserFormValue;

  @Output() valueChange = new EventEmitter<UserFormValue>();

  // Field configuration
  private readonly teacherFields: UserFormField[] = [
    { key: 'name', label: 'Name', placeholder: 'Enter teacher name' },
    { key: 'teacherId', label: 'Teacher ID', placeholder: 'Enter teacher ID' },
    { key: 'subject', label: 'Subject', placeholder: 'Enter subject' },
    { key: 'school', label: 'School', placeholder: 'Enter school' },
  ];

  private readonly studentFields: UserFormField[] = [
    { key: 'name', label: 'Name', placeholder: 'Enter student name' },
    { key: 'studentId', label: 'Student ID', placeholder: 'Enter student ID' },
    { key: 'grade', label: 'Grade', placeholder: 'Enter grade' },
    { key: 'school', label: 'School', placeholder: 'Enter school' },
  ];

  get fields(): UserFormField[] {
    return this.mode === 'teacher' ? this.teacherFields : this.studentFields;
  };

  getFieldValue(field: UserFormFieldKey): string {
    return this.value[field] ?? '';
  };

  onFieldChange(field: UserFormFieldKey, value: string): void {
    this.valueChange.emit({
      ...this.value,
      [field]: value,
    })
  }
}
