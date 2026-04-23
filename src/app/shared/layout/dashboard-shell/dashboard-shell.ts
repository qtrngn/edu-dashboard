import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-shell',
  imports: [],
  templateUrl: './dashboard-shell.html',
})
export class DashboardShell {
  @Input() title = '';
  @Input() showCreateButton = false;

  @Output() logoutClicked = new EventEmitter<void>();
  @Output() createClicked = new EventEmitter<void>();

  onCreateClick(): void {
    this.createClicked.emit();
  }
  onLogoutClick(): void {
    this.logoutClicked.emit();
  }
}
