import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { ModalShell } from '@shared/components/modal-shell/modal-shell';
import type { TeacherRow, StudentRow, UserRow } from '@pages/dashboard/types/user-management.types';

@Component({
  selector: 'app-user-detail-modal',
  imports: [ModalShell],
  templateUrl: './user-detail-modal.html',
})
export class UserDetailModal {
  // Step 1: receive the selected user from the parent dashboard
  @Input({ required: true }) user!: UserRow;

  // Step 2: receive whether this modal is currently in edit mode
  @Input() isEditing = false;

  // Step 3: output events back to the parent
  @Output() closeClicked = new EventEmitter<void>();
  @Output() editClicked = new EventEmitter<void>();
  @Output() cancelEditClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<UserRow>();
  @Output() deleteClicked = new EventEmitter<void>();

  // Step 4: keep local teacher form state for edit mode
  readonly teacherForm = signal({
    name: '',
    teacherId: '',
    subject: '',
    school: '',
  });

  // Step 5: keep local student form state for edit mode
  readonly studentForm = signal({
    name: '',
    studentId: '',
    grade: '',
    school: '',
  });

  // Step 6: whenever the selected user changes, sync the local form state
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.syncFormFromUser();
    }
  }

  // Step 7: close the modal
  onCloseClick(): void {
    this.closeClicked.emit();
  }

  // Step 8: tell the parent to switch into edit mode
  onEditClick(): void {
    this.editClicked.emit();
  }

  // Step 9: reset the form back to the original user values, then exit edit mode
  onCancelEditClick(): void {
    this.syncFormFromUser();
    this.cancelEditClicked.emit();
  }

  // Step 10: tell the parent that delete was requested
  onDeleteClick(): void {
    this.deleteClicked.emit();
  }

  // Step 11: update one teacher field while editing
  onTeacherFieldChange(field: 'name' | 'teacherId' | 'subject' | 'school', value: string): void {
    this.teacherForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Step 12: update one student field while editing
  onStudentFieldChange(field: 'name' | 'studentId' | 'grade' | 'school', value: string): void {
    this.studentForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Step 13: build the updated row and emit it back to the parent
  onSaveClick(): void {
    if (this.user.type === 'teacher') {
      const form = this.teacherForm();

      const updatedTeacher: TeacherRow = {
        ...this.user,
        type: 'teacher',
        name: form.name.trim(),
        teacherId: form.teacherId.trim(),
        subject: form.subject.trim(),
        school: form.school.trim(),
      };

      this.saveClicked.emit(updatedTeacher);
      return;
    }

    const form = this.studentForm();

    const updatedStudent: StudentRow = {
      ...this.user,
      type: 'student',
      name: form.name.trim(),
      studentId: form.studentId.trim(),
      grade: form.grade.trim(),
      school: form.school.trim(),
    };

    this.saveClicked.emit(updatedStudent);
  }

  // Step 14: copy the selected user into the correct local form state
  private syncFormFromUser(): void {
    if (this.user.type === 'teacher') {
      this.teacherForm.set({
        name: this.user.name,
        teacherId: this.user.teacherId,
        subject: this.user.subject,
        school: this.user.school,
      });
      return;
    }

    this.studentForm.set({
      name: this.user.name,
      studentId: this.user.studentId,
      grade: this.user.grade,
      school: this.user.school,
    });
  }
}