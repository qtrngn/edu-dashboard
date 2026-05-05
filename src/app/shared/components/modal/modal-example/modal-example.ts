import { Component } from '@angular/core';
import { ModalBase } from '@shared/components/modal/modal-base/modal-base';
import { ModalActionVariant } from '@app/types/modal.types';

@Component({
  selector: 'app-modal-example',
  imports: [],
  templateUrl: './modal-example.html',
})
export class ModalExample extends ModalBase {
  // todo
  //   ex: if you want hanlde before close (default click close will be close modal)
  override onCloseClick(): void {
    // do something before close
    alert('before close');

    super.onCloseClick(); //default
  }
}
