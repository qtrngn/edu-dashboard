import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type {
  CreateStudentInput,
  CreateTeacherInput,
  StudentRow,
  TeacherRow,
} from '@pages/dashboard/types/user-management.types';

interface MockUsersData {
  teachers: TeacherRow[];
  students: StudentRow[];
}

@Injectable({
  providedIn: 'root',
})
export class UserDirectoryService {
  // Step 1: define the localStorage key for the fake database
  private readonly storageKey = 'education-dashboard-users';

  // Step 2: define where JSON file lives
  private readonly seedPath = 'assets/mock-users.json';

  constructor(private readonly http: HttpClient) {}

  // Step 3: initialize localStorage from the JSON seed only once
  async initializeStore(): Promise<void> {
    const existingStore = this.readStore();

    if (existingStore) {
      return;
    }

    const seedData = await this.loadSeedData();
    this.writeStore(seedData);
  }

  // Step 4: read all teachers from the fake database
  async getTeachers(): Promise<TeacherRow[]> {
    await this.initializeStore();
    return this.readStoreOrThrow().teachers;
  }

  // Step 5: read all students from the fake database
  async getStudents(): Promise<StudentRow[]> {
    await this.initializeStore();
    return this.readStoreOrThrow().students;
  }

  // Step 6: create a teacher row, save it into localStorage, then return it
  async createTeacher(input: CreateTeacherInput): Promise<TeacherRow> {
    const newTeacher = this.buildTeacherRow(input);

    await this.updateStore((store) => ({
      ...store,
      teachers: [...store.teachers, newTeacher],
    }));

    return newTeacher;
  }

  // Step 7: create a student row, save it into localStorage, then return it
  async createStudent(input: CreateStudentInput): Promise<StudentRow> {
    const newStudent = this.buildStudentRow(input);

    await this.updateStore((store) => ({
      ...store,
      students: [...store.students, newStudent],
    }));

    return newStudent;
  }

  // Step 8: update one teacher row by matching the id
  async updateTeacher(updatedTeacher: TeacherRow): Promise<TeacherRow> {
    await this.updateStore((store) => ({
      ...store,
      teachers: store.teachers.map((teacher) =>
        teacher.id === updatedTeacher.id ? updatedTeacher : teacher,
      ),
    }));

    return updatedTeacher;
  }

  // Step 9: update one student row by matching the id
  async updateStudent(updatedStudent: StudentRow): Promise<StudentRow> {
    await this.updateStore((store) => ({
      ...store,
      students: store.students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student,
      ),
    }));

    return updatedStudent;
  }

  // Step 10: delete one teacher row by filtering out the matching id
  async deleteTeacher(teacherId: string): Promise<void> {
    await this.updateStore((store) => ({
      ...store,
      teachers: store.teachers.filter((teacher) => teacher.id !== teacherId),
    }));
  }

  // Step 11: delete one student row by filtering out the matching id
  async deleteStudent(studentId: string): Promise<void> {
    await this.updateStore((store) => ({
      ...store,
      students: store.students.filter((student) => student.id !== studentId),
    }));
  }

  // Step 12: reset localStorage back to the original JSON seed data
  async resetToSeed(): Promise<void> {
    const seedData = await this.loadSeedData();
    this.writeStore(seedData);
  }

  // Step 13: centralize the repeated "read -> change -> write" pattern
  private async updateStore(
    updater: (store: MockUsersData) => MockUsersData,
  ): Promise<void> {
    await this.initializeStore();

    const currentStore = this.readStoreOrThrow();
    const updatedStore = updater(currentStore);
    this.writeStore(updatedStore);
  }

  // Step 14: build a clean teacher row object from create form input
  private buildTeacherRow(input: CreateTeacherInput): TeacherRow {
    return {
      type: 'teacher',
      id: crypto.randomUUID(),
      name: input.name.trim(),
      teacherId: input.teacherId.trim(),
      subject: input.subject.trim(),
      school: input.school.trim(),
    };
  }

  // Step 15: build a clean student row object from create form input
  private buildStudentRow(input: CreateStudentInput): StudentRow {
    return {
      type: 'student',
      id: crypto.randomUUID(),
      name: input.name.trim(),
      studentId: input.studentId.trim(),
      grade: input.grade.trim(),
      school: input.school.trim(),
    };
  }

  // Step 16: load the starter dataset 
  private async loadSeedData(): Promise<MockUsersData> {
    const seedData = await firstValueFrom(
      this.http.get<MockUsersData>(this.seedPath),
    );

    if (!seedData) {
      throw new Error('Failed to load mock user seed data.');
    }

    return seedData;
  }

  // Step 17: read the current  database from localStorage
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

  // Step 18: same as readStore, but throw if store is missing
  private readStoreOrThrow(): MockUsersData {
    const store = this.readStore();

    if (!store) {
      throw new Error('User directory store is not initialized.');
    }

    return store;
  }

  // Step 19: write the latest fake database back into localStorage
  private writeStore(store: MockUsersData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(store));
  }
}