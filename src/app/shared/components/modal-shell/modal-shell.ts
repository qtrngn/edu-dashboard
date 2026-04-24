import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  imports: [],
  templateUrl: './modal-shell.html',
})
export class ModalShell {
  @Input() title = '';
  @Output() closeClicked = new EventEmitter<void>();

  onCloseClick(): void {
    this.closeClicked.emit();
  }
}
