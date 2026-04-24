import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalShell } from '@shared/components/modal-shell/modal-shell';

@Component({
  selector: 'app-delete-modal',
  imports: [ModalShell],
  templateUrl: './delete-modal.html',
})
export class DeleteModal {
  @Input() title = 'Delete User';

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() confirmClicked = new EventEmitter<void>();

  onCancelClick(): void {
    this.cancelClicked.emit();
  }

  onConfirmClick(): void {
    this.confirmClicked.emit();
  }
}
