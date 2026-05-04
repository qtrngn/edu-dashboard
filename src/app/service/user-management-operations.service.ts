import { Injectable } from '@angular/core';
import { EManagedUserType } from '@enums/user-management.enum';
import { UserDirectoryService } from '@service/user-directory.service';
import type {
  CreateStudentInput,
  CreateTeacherInput,
  CreateUserInput,
  StudentRow,
  TeacherRow,
  UserRow,
} from '@app/types/user-management.types';

type ManagedUserOperations = {
  list: () => Promise<UserRow[]>;
  create: (input: CreateUserInput) => Promise<UserRow>;
  update: (user: UserRow) => Promise<UserRow>;
  delete: (id: string) => Promise<void>;
};

type ManagedUserOperationRegistry = Record<EManagedUserType, ManagedUserOperations>;

@Injectable({
  providedIn: 'root',
})
export class UserManagementOperationsService {
  constructor(private readonly userDirectoryService: UserDirectoryService) {}

  getUsersList(managedUserType: EManagedUserType): Promise<UserRow[]> {
    return this.operationRegistry[managedUserType].list();
  }

  createUser(input: CreateUserInput): Promise<UserRow> {
    return this.operationRegistry[input.type].create(input);
  }

  updateUser(user: UserRow): Promise<UserRow> {
    return this.operationRegistry[user.type].update(user);
  }

  deleteUser(managedUserType: EManagedUserType, id: string): Promise<void> {
    return this.operationRegistry[managedUserType].delete(id);
  }

  private get operationRegistry(): ManagedUserOperationRegistry {
    return {
      [EManagedUserType.Teacher]: {
        list: () => this.userDirectoryService.getTeachers(),
        create: (input) => this.userDirectoryService.createTeacher(input as CreateTeacherInput),
        update: (user) => this.userDirectoryService.updateTeacher(user as TeacherRow),
        delete: (id) => this.userDirectoryService.deleteTeacher(id),
      },

      [EManagedUserType.Student]: {
        list: () => this.userDirectoryService.getStudents(),
        create: (input) => this.userDirectoryService.createStudent(input as CreateStudentInput),
        update: (user) => this.userDirectoryService.updateStudent(user as StudentRow),
        delete: (id) => this.userDirectoryService.deleteStudent(id),
      },
    };
  }
}
