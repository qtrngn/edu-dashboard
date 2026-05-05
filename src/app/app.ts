import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('edu-dashboard');


  // todo
  // openModal() {
  //   modalService.openModal(configs);
  // }

  // -------------------
  // create Modal Service: in Modal Service, create handle funtions
  // openModal(configs: IConfigs) {
    // handle load components (form/text/image...) to modal body
    // research from modalService in wellbytes crm
  // }

}
