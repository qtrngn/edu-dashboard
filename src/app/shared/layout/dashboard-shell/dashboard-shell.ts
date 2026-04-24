import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-shell',
  imports: [],
  templateUrl: './dashboard-shell.html',
})
export class DashboardShell {
  @Input() title = '';

  @Output() logoutClicked = new EventEmitter<void>();

  onLogoutClick(): void {
    this.logoutClicked.emit();
  }
}
