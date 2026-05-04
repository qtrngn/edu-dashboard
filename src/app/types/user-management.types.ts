import { EManagedUserType } from '@enums/user-management.enum';

export type UserManagementFieldName =
  | 'name'
  | 'teacherId'
  | 'subject'
  | 'school'
  | 'studentId'
  | 'grade';
  
export type UserManagementFieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox';

export type UserManagementFieldMode = 'view' | 'edit';
  
export interface UserManagementFieldDef {
  label: string;
  type: UserManagementFieldType;
  placeholder?: string;
  required?: boolean;
}

export interface UserManagementFieldConfig extends UserManagementFieldDef {
  fieldname: UserManagementFieldName;
}

// Data shown in table UI
interface UserBaseData {
  name: string;
  school: string;
}
export interface TeacherRow extends UserBaseData {
  type: EManagedUserType.Teacher;
  id: string;
  teacherId: string;
  subject: string;
}

export interface StudentRow extends UserBaseData {
  type: EManagedUserType.Student;
  id: string;
  studentId: string;
  grade: string;
}

export type UserRow = TeacherRow | StudentRow;

// Data submitted when creating a new user
export interface CreateTeacherInput extends UserBaseData {
  type: EManagedUserType.Teacher;
  teacherId: string;
  subject: string;
}

export interface CreateStudentInput extends UserBaseData {
  type: EManagedUserType.Student;
  studentId: string;
  grade: string;
}

export type CreateUserInput = CreateTeacherInput | CreateStudentInput;

export type UserFormValue = Partial<Record<UserManagementFieldName, string>>;

export interface UserManagementDisplayConfig {
  label: string;
  pluralLabel: string;
  addTitle: string;
  detailTitle: string;
  deleteTitle: string;
  emptyMessage: string;
}
