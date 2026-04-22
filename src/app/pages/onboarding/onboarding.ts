import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

export type Role = 'teacher' | 'student';
interface RoleCard {
  role: Role;
  title: string;
  subtitle: string;
  image: string;
  borderHover: string;
  textColor: string;
}

@Component({
  selector: 'app-onboarding',
  imports: [RouterLink, NgClass],
  templateUrl: './onboarding.html',
})
export class Onboarding {
  roleCards: RoleCard[] = [
    {
      role: 'teacher',
      title: 'Teacher',
      subtitle: 'Continue →',
      image: 'assets/images/onboarding/onboarding-teacher.gif',
      borderHover: 'hover:border-teal-300',
      textColor: 'text-teal-300',
    },
    {
      role: 'student',
      title: 'Student',
      subtitle: 'Continue →',
      image: 'assets/images/onboarding/onboarding-student.gif',
      borderHover: 'hover:border-pink-400',
      textColor: 'text-pink-400',
    },
  ];
}
