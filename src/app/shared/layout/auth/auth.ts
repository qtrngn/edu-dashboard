import { Component, Input } from '@angular/core';
import { EAuthRole } from '@enums/user-management.enum';
import { getAuthRoleConfig } from '@configs/auth-role.config';
import type { AuthRoleConfig } from '@app/types/auth.types';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
})
export class Auth {
  @Input({ required: true }) role!: EAuthRole;
  @Input() panelLabel = '';
  @Input() panelTitle = '';

  get roleConfig(): AuthRoleConfig {
    return getAuthRoleConfig(this.role);
  }
}