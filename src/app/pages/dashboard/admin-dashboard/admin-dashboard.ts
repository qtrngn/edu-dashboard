import { Component } from '@angular/core';
import { DashboardShell } from '@shared/layout/dashboard-shell/dashboard-shell';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DashboardShell],
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {}
