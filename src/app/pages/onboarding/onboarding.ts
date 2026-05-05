import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AUTH_ROLE_CONFIG } from '@configs/auth-role.config';
import type { AuthRoleConfig } from '@app/types/auth.types';

@Component({
  selector: 'app-onboarding',
  imports: [RouterLink, NgClass],
  templateUrl: './onboarding.html',
})
export class Onboarding {
  readonly roleCards: AuthRoleConfig[] = Object.values(AUTH_ROLE_CONFIG);
}