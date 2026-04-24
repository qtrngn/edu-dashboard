import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ModalShell } from '@shared/components/modal-shell/modal-shell';
import { UserFormFields } from '@shared/components/dashboard/user-form-fields/user-form-fields';
import type {
  UserFormValue,
  CreateUserInput,
  DashboardMode,
} from '@pages/dashboard/types/user-management.types';

@Component({
  selector: 'app-create-user-modal',
  imports: [ModalShell, UserFormFields],
  templateUrl: './create-user-modal.html',
})
export class CreateUserModal implements OnInit {
  @Input({ required: true }) mode!: DashboardMode;

  @Output() closeClicked = new EventEmitter<void>();
  @Output() saveClicked = new EventEmitter<CreateUserInput>();

  readonly form = signal<UserFormValue>({});

  // Run once when the components is created, set it to empty mode
  ngOnInit(): void {
    this.form.set(this.getEmptyForm());
  }

  // Tell parents to close modal
  onCloseClick(): void {
    this.closeClicked.emit();
  }

  // Update modal's local form state
  onFormChange(updatedForm: UserFormValue): void {
    this.form.set(updatedForm);
  }

  // Build the correct object and send back to parents
  onSaveClick(): void {
    const form = this.form();

    if (this.mode === 'teacher') {
      this.saveClicked.emit({
        type: 'teacher',
        name: this.trimValue(form, 'name'),
        teacherId: this.trimValue(form, 'teacherId'),
        subject: this.trimValue(form, 'subject'),
        school: this.trimValue(form, 'school'),
      });

      return;
    }

    this.saveClicked.emit({
      type: 'student',
      name: this.trimValue(form, 'name'),
      studentId: this.trimValue(form, 'studentId'),
      grade: this.trimValue(form, 'grade'),
      school: this.trimValue(form, 'school'),
    });
  }

  // Starting empty form object
  private getEmptyForm(): UserFormValue {
    if (this.mode === 'teacher') {
      return {
        name: '',
        teacherId: '',
        subject: '',
        school: '',
      };
    }

    return {
      name: '',
      studentId: '',
      grade: '',
      school: '',
    };
  }

  private trimValue(form: UserFormValue, field: string): string {
    return (form[field] ?? '').trim();
  }
}
