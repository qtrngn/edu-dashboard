import { Component, Input } from '@angular/core';
import type { Role } from '../../../pages/onboarding/onboarding';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
})
export class Auth {
  @Input({ required: true }) role!: Role;;

  @Input() panelLabel = '';
  @Input() panelTitle = '';
  @Input() panelDescription = '';
}
