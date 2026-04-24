import { Component, EventEmitter, Input, Output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { ModalShell } from '@shared/components/modal-shell/modal-shell';
import { UserFormFields } from '@shared/components/dashboard/user-form-fields/user-form-fields';
import type {
  TeacherRow,
  StudentRow,
  UserRow,
  UserFormValue,
} from '@pages/dashboard/types/user-management.types';

interface UserDetailField {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-detail-modal',
  imports: [ModalShell, UserFormFields],
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

  get detailFields(): UserDetailField[] {
    if (this.user.type === 'teacher') {
      return [
        { label: 'Name', value: this.user.name },
        { label: 'Teacher ID', value: this.user.teacherId },
        { label: 'Subject', value: this.user.subject },
        { label: 'School', value: this.user.school },
      ];
    }

    return [
      { label: 'Name', value: this.user.name },
      { label: 'Student ID', value: this.user.studentId },
      { label: 'Grade', value: this.user.grade },
      { label: 'School', value: this.user.school },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.syncFormFromUser();
    }
  }

  onCloseClick(): void {
    this.closeClicked.emit();
  }

  onEditClick(): void {
    this.editClicked.emit();
  }

  // Reset the form back to the original user data
  onCancelEditClick(): void {
    this.syncFormFromUser();
    this.cancelEditClicked.emit();
  }

  onDeleteClick(): void {
    this.deleteClicked.emit();
  }

  onFormChange(updatedForm: UserFormValue): void {
    this.form.set(updatedForm);
  }

  // Build the updated user object sent to the parent
  onSaveClick(): void {
    const form = this.form();

    if (this.user.type === 'teacher') {
      const updatedTeacher: TeacherRow = {
        ...this.user,
        type: 'teacher',
        name: this.trimValue(form, 'name'),
        teacherId: this.trimValue(form, 'teacherId'),
        subject: this.trimValue(form, 'subject'),
        school: this.trimValue(form, 'school'),
      };

      this.saveClicked.emit(updatedTeacher);
      return;
    }

    const updatedStudent: StudentRow = {
      ...this.user,
      type: 'student',
      name: this.trimValue(form, 'name'),
      studentId: this.trimValue(form, 'studentId'),
      grade: this.trimValue(form, 'grade'),
      school: this.trimValue(form, 'school'),
    };

    this.saveClicked.emit(updatedStudent);
  }

  // Fill the form with the selected user's current data
  private syncFormFromUser(): void {
    if (this.user.type === 'teacher') {
      this.form.set({
        name: this.user.name,
        teacherId: this.user.teacherId,
        subject: this.user.subject,
        school: this.user.school,
      });

      return;
    }

    this.form.set({
      name: this.user.name,
      studentId: this.user.studentId,
      grade: this.user.grade,
      school: this.user.school,
    });
  }

  private trimValue(form: UserFormValue, field: string): string {
    return (form[field] ?? '').trim();
  }
}
