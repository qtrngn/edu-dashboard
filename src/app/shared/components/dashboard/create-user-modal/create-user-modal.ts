import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ModalShell } from '@shared/components/modal-shell/modal-shell';

@Component({
  selector: 'app-create-user-modal',
  imports: [ModalShell],
  templateUrl: './create-user-modal.html',
})
export class CreateUserModal {
  @Input({ required: true }) mode!: 'teacher' | 'student';
  @Output() closeClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<any>();

  // States
  readonly teacherForm = signal({
    name: '',
    teacherId: '',
    subject: '',
    school: '',
  });

  readonly studentForm = signal({
    name: '',
    studentId: '',
    grade: '',
    school: '',
  });

  onCloseClick(): void {
    this.closeClicked.emit();
  }

  // Field update 
  onTeacherFieldChange(field: 'name' | 'teacherId' | 'subject' | 'school', value: string): void {
    this.teacherForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  onStudentFieldChange(field: 'name' | 'studentId' | 'grade' | 'school', value: string): void {
    this.studentForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Save information
  onSaveClick(): void {
    if (this.mode === 'teacher') {
      const form = this.teacherForm();

      this.saveClicked.emit({
        type: 'teacher',
        name: form.name.trim(),
        teacherId: form.teacherId.trim(),
        subject: form.subject.trim(),
        school: form.school.trim(),
      });

      return;
    }

    const form = this.studentForm();

    this.saveClicked.emit({
      type: 'student',
      name: form.name.trim(),
      studentId: form.studentId.trim(),
      grade: form.grade.trim(),
      school: form.school.trim(),
    });
  }
}
