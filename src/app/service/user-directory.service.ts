import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type {
  CreateStudentInput,
  CreateTeacherInput,
  StudentRow,
  TeacherRow,
} from '@app/types/user-management.types';
import { EManagedUserType } from '@enums/user-management.enum';

interface MockUsersData {
  teachers: TeacherRow[];
  students: StudentRow[];
}

@Injectable({
  providedIn: 'root',
})
export class UserDirectoryService {
  // localStorage key
  private readonly storageKey = 'education-dashboard-users';

  // Initialize localStorage the first time.
  private readonly seedPath = 'assets/mock-users.json';

  constructor(private readonly http: HttpClient) {
    console.log('UserDirectoryService created');
    console.log('HttpClient:', this.http);
  }

  // Makes sure the mock user store exists before reading or updating data.
  // If localStorage already has data, it keeps that data.
  // If localStorage is empty, it loads the starter data from mock-users.json.
  async initializeStore(): Promise<void> {
    const existingStore = this.readStore();

    if (existingStore) {
      return;
    }

    const seedData = await this.loadSeedData();
    this.writeStore(seedData);
  }

  // Returns all teachers from the mock data.
  async getTeachers(): Promise<TeacherRow[]> {
    await this.initializeStore();
    return this.readStoreOrThrow().teachers;
  }

  // Returns all students from the mock data.
  async getStudents(): Promise<StudentRow[]> {
    await this.initializeStore();
    return this.readStoreOrThrow().students;
  }

  // Creates a new teacher row, saves it into the mock data, then returns the newly created teacher.
  async createTeacher(input: CreateTeacherInput): Promise<TeacherRow> {
    const newTeacher = this.buildTeacherRow(input);

    await this.updateStore((store) => ({
      ...store,
      teachers: [...store.teachers, newTeacher],
    }));

    return newTeacher;
  }

  // Creates a new student row, saves it into the mock store, then returns the newly created student.
  async createStudent(input: CreateStudentInput): Promise<StudentRow> {
    const newStudent = this.buildStudentRow(input);

    await this.updateStore((store) => ({
      ...store,
      students: [...store.students, newStudent],
    }));

    return newStudent;
  }

  // Replaces the matching teacher in the mock store with the updated teacher.
  async updateTeacher(updatedTeacher: TeacherRow): Promise<TeacherRow> {
    await this.updateStore((store) => ({
      ...store,
      teachers: store.teachers.map((teacher) =>
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher,
      ),
    }));

    return updatedTeacher;
  }

  // Replaces the matching student in the mock store with the updated student.
  async updateStudent(updatedStudent: StudentRow): Promise<StudentRow> {
    await this.updateStore((store) => ({
      ...store,
      students: store.students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student,
      ),
    }));

    return updatedStudent;
  }

  // Deletes a teacher by the internal row id.
  async deleteTeacher(userId: string): Promise<void> {
    await this.updateStore((store) => ({
      ...store,
      teachers: store.teachers.filter((teacher) => teacher.id !== userId),
    }));
  }

  // Deletes a student by the internal row id.
  // This is the generated `id`, not the student's `studentId`.
  async deleteStudent(userId: string): Promise<void> {
    await this.updateStore((store) => ({
      ...store,
      students: store.students.filter((student) => student.id !== userId),
    }));
  }

  // Resets localStorage back to the original mock data.
  async resetToSeed(): Promise<void> {
    const seedData = await this.loadSeedData();
    this.writeStore(seedData);
  }

  /* 1. Make sure the store exists
  2. Read the current store
  3. Apply a change
  4. Save the updated store back to localStorage */
  private async updateStore(updater: (store: MockUsersData) => MockUsersData): Promise<void> {
    await this.initializeStore();

    const currentStore = this.readStoreOrThrow();
    const updatedStore = updater(currentStore);

    this.writeStore(updatedStore);
  }

  // Converts the create-teacher form input into a full TeacherRow. The form does not provide `id`, so create id here.
  private buildTeacherRow(input: CreateTeacherInput): TeacherRow {
    return {
      type: EManagedUserType.Teacher,
      id: crypto.randomUUID(),
      name: input.name.trim(),
      teacherId: input.teacherId.trim(),
      subject: input.subject.trim(),
      school: input.school.trim(),
    };
  }

  // Converts the create-student form input into a full StudentRow.
  private buildStudentRow(input: CreateStudentInput): StudentRow {
    return {
      type: EManagedUserType.Student,
      id: crypto.randomUUID(),
      name: input.name.trim(),
      studentId: input.studentId.trim(),
      grade: input.grade.trim(),
      school: input.school.trim(),
    };
  }

  // Loads the starter mock data
  private async loadSeedData(): Promise<MockUsersData> {
    console.log('Loading seed data from mock-users.json');
    const seedData = await firstValueFrom(this.http.get<MockUsersData>(this.seedPath));

    if (!seedData) {
      throw new Error('Failed to load mock users seed data.');
    }

    return seedData;
  }

  /* Reads the saved mock users from localStorage.
  Returns null if no store exists yet or if the saved JSON is broken. */
  private readStore(): MockUsersData | null {
    const rawStore = localStorage.getItem(this.storageKey);

    if (!rawStore) {
      return null;
    }

    try {
      return JSON.parse(rawStore) as MockUsersData;
    } catch {
      return null;
    }
  }

  // expects the store to exist
  private readStoreOrThrow(): MockUsersData {
    const store = this.readStore();

    if (!store) {
      throw new Error(
        'Mock users store is missing. Initialize the store before accessing user data.',
      );
    }

    return store;
  }

  // Saves the full mock user store back into localStorage.
  private writeStore(store: MockUsersData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(store));
  }
}
