export type DashboardMode = 'teacher' | 'student';

export interface TeacherRow {
  type: 'teacher';
  id: string;
  name: string;
  teacherId: string;
  subject: string;
  school: string;
}

export interface StudentRow {
  type: 'student';
  id: string;
  name: string;
  studentId: string;
  grade: string;
  school: string;
}

export type UserRow = TeacherRow | StudentRow;

export interface CreateTeacherInput {
  type: 'teacher';
  name: string;
  teacherId: string;
  subject: string;
  school: string;
}

export interface CreateStudentInput {
  type: 'student';
  name: string;
  studentId: string;
  grade: string;
  school: string;
}

export type CreateUserInput = CreateTeacherInput | CreateStudentInput;