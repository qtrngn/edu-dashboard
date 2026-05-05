import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form-shell',
  imports: [],
  templateUrl: './auth-form-shell.html',
})
export class AuthFormShell {
  @Input() badgeLabel = '';
  @Input({ required: true }) title = '';
  @Input() description = '';
}