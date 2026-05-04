import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalBase } from '@shared/components/modal/modal-base/modal-base';
import type { BaseModalConfig } from '@app/types/modal.types';

@Component({
  selector: 'app-delete-modal',
  imports: [ModalBase],
  templateUrl: './delete-modal.html',
})
export class DeleteModal {
  @Input() title = 'Delete User';
  @Input() message = 'Are you sure? This action cannot be undone.';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmLabel = 'Delete';

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() confirmClicked = new EventEmitter<void>();

  get modalConfig(): BaseModalConfig {
    return {
      size: 'sm',
      header: {
        title: this.title,
        description: this.message,
        showCloseButton: true,
      },
      footerActions: [
        {
          label: this.cancelLabel,
          action: 'cancel',
          variant: 'secondary',
        },
        {
          label: this.confirmLabel,
          action: 'confirm',
          variant: 'destructive',
        },
      ],
    };
  }

  onCancelClick(): void {
    this.cancelClicked.emit();
  }

  onConfirmClick(): void {
    this.confirmClicked.emit();
  }

  onModalAction(action: string): void {
    if (action === 'cancel') {
      this.onCancelClick();
      return;
    }

    if (action === 'confirm') {
      this.onConfirmClick();
    }
  }
}
