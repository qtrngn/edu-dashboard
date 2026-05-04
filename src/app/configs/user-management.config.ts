import { EManagedUserType } from '@enums/user-management.enum';
import type {
  UserManagementFieldName,
  UserManagementFieldDef,
  UserManagementFieldConfig,
  UserManagementDisplayConfig,
} from '@app/types/user-management.types';

export const USER_MANAGEMENT_FIELD_DEFS: Record<UserManagementFieldName, UserManagementFieldDef> = {
  name: {
    label: 'Name',
    type: 'text',
    placeholder: 'Enter name',
    required: true,
  },

  teacherId: {
    label: 'Teacher ID',
    type: 'text',
    placeholder: 'Enter teacher ID',
  },

  subject: {
    label: 'Subject',
    type: 'text',
    placeholder: 'Enter subject',
  },

  school: {
    label: 'School',
    type: 'text',
    placeholder: 'Enter school',
  },

  studentId: {
    label: 'Student ID',
    type: 'text',
    placeholder: 'Enter student ID',
  },

  grade: {
    label: 'Grade',
    type: 'text',
    placeholder: 'Enter grade',
  },
};

export const USER_MANAGEMENT_FIELD_SETS: Record<
  EManagedUserType,
  readonly UserManagementFieldName[]
> = {
  [EManagedUserType.Teacher]: ['name', 'teacherId', 'subject', 'school'],
  [EManagedUserType.Student]: ['name', 'studentId', 'grade', 'school'],
};

export function getUserManagementFields(
  managedUserType: EManagedUserType,
): UserManagementFieldConfig[] {
  return USER_MANAGEMENT_FIELD_SETS[managedUserType].map((fieldname) => ({
    fieldname,
    ...USER_MANAGEMENT_FIELD_DEFS[fieldname],
  }));
}

export const USER_MANAGEMENT_DISPLAY_CONFIG: Record<EManagedUserType, UserManagementDisplayConfig> =
  {
    [EManagedUserType.Teacher]: {
      label: 'Teacher',
      pluralLabel: 'Teachers',
      addTitle: 'Add Teacher',
      detailTitle: 'Teacher Details',
      deleteTitle: 'Delete Teacher',
      emptyMessage: 'No teachers found.',
    },

    [EManagedUserType.Student]: {
      label: 'Student',
      pluralLabel: 'Students',
      addTitle: 'Add Student',
      detailTitle: 'Student Details',
      deleteTitle: 'Delete Student',
      emptyMessage: 'No students found.',
    },
  };
