// 1. Визначення базових типів
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
type TimeSlot =
  | '8:30-10:00'
  | '10:15-11:45'
  | '12:15-13:45'
  | '14:00-15:30'
  | '15:45-17:15';
type CourseType = 'Lecture' | 'Seminar' | 'Lab' | 'Practice';

// 2. Основні структури
type Professor = {
  id: number;
  name: string;
  department: string;
};

type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

type Course = {
  id: number;
  name: string;
  type: CourseType;
};

type Lesson = {
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

// 3. Робота з масивами даних
const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];

// Додавання професора
function addProfessor(professor: Professor): void {
  professors.push(professor);
}

// Додавання заняття з перевіркою конфліктів
function addLesson(lesson: Lesson): boolean {
  if (validateLesson(lesson) === null) {
    schedule.push(lesson);
    return true;
  }
  return false;
}

// 4. Функції пошуку та фільтрації
function findAvailableClassrooms(
  timeSlot: TimeSlot,
  dayOfWeek: DayOfWeek,
): string[] {
  const occupiedClassrooms = schedule
    .filter(
      (lesson) =>
        lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek,
    )
    .map((lesson) => lesson.classroomNumber);
  return classrooms
    .map((classroom) => classroom.number)
    .filter((number) => !occupiedClassrooms.includes(number));
}

function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter((lesson) => lesson.professorId === professorId);
}

// 5. Обробка конфліктів та валідація
type ScheduleConflict = {
  type: 'ProfessorConflict' | 'ClassroomConflict';
  lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
  for (const existingLesson of schedule) {
    if (
      existingLesson.dayOfWeek === lesson.dayOfWeek &&
      existingLesson.timeSlot === lesson.timeSlot
    ) {
      if (existingLesson.professorId === lesson.professorId) {
        return { type: 'ProfessorConflict', lessonDetails: existingLesson };
      }
      if (existingLesson.classroomNumber === lesson.classroomNumber) {
        return { type: 'ClassroomConflict', lessonDetails: existingLesson };
      }
    }
  }
  return null;
}

// 6. Аналіз та звіти
function getClassroomUtilization(classroomNumber: string): number {
  const totalSlots = 5 * 5;
  const occupiedSlots = schedule.filter(
    (lesson) => lesson.classroomNumber === classroomNumber,
  ).length;
  return (occupiedSlots / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
  const typeCounts: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };
  schedule.forEach((lesson) => {
    const course = courses.find((c) => c.id === lesson.courseId);
    if (course) {
      typeCounts[course.type]++;
    }
  });
  return Object.entries(typeCounts).reduce<[CourseType, number]>(
    (mostPopular, current) => {
      const [courseType, count] = current as [CourseType, number];
      return count > mostPopular[1] ? [courseType, count] : mostPopular;
    },
    ['Lecture', 0],
  )[0];
}

// 7. Модифікація даних
function reassignClassroom(
  lessonId: number,
  newClassroomNumber: string,
): boolean {
  const lesson = schedule.find((lesson) => lesson.courseId === lessonId);
  if (!lesson) return false;

  const conflict = validateLesson({
    ...lesson,
    classroomNumber: newClassroomNumber,
  });
  if (conflict === null) {
    lesson.classroomNumber = newClassroomNumber;
    return true;
  }
  return false;
}

function cancelLesson(lessonId: number): void {
  const index = schedule.findIndex((lesson) => lesson.courseId === lessonId);
  if (index !== -1) {
    schedule.splice(index, 1);
  }
}

// Тестові дані
const professor1: Professor = {
  id: 1,
  name: 'John Doe',
  department: 'Computer Science',
};
const professor2: Professor = {
  id: 2,
  name: 'Jane Smith',
  department: 'Mathematics',
};

const classroom1: Classroom = {
  number: '101',
  capacity: 30,
  hasProjector: true,
};
const classroom2: Classroom = {
  number: '102',
  capacity: 20,
  hasProjector: false,
};

const course1: Course = {
  id: 1,
  name: 'Introduction to Programming',
  type: 'Lecture',
};
const course2: Course = { id: 2, name: 'Calculus I', type: 'Seminar' };

// Додавання професорів, класів та курсів
addProfessor(professor1);
addProfessor(professor2);
classrooms.push(classroom1, classroom2);
courses.push(course1, course2);

// Додавання занять
const lesson1: Lesson = {
  courseId: 1,
  professorId: 1,
  classroomNumber: '101',
  dayOfWeek: 'Monday',
  timeSlot: '10:15-11:45',
};
const lesson2: Lesson = {
  courseId: 2,
  professorId: 2,
  classroomNumber: '102',
  dayOfWeek: 'Monday',
  timeSlot: '12:15-13:45',
};

// Тест на додавання занять
console.log('Adding lesson 1:', addLesson(lesson1));
console.log('Adding lesson 2:', addLesson(lesson2));

// Перевірка розкладу професора
console.log('Schedule for Professor 1:', getProfessorSchedule(1));

// Пошук доступних класів
console.log(
  'Available classrooms on Monday, 10:15-11:45:',
  findAvailableClassrooms('10:15-11:45', 'Monday'),
);

// Аналіз використання класів
console.log('Classroom utilization for 101:', getClassroomUtilization('101'));

// Отримання найпопулярнішого типу курсу
console.log('Most popular course type:', getMostPopularCourseType());

// Переназначення класу
console.log(
  'Reassigning lesson 1 to classroom 102:',
  reassignClassroom(1, '102'),
);
console.log(
  'Reassigning lesson 1 to classroom 103:',
  reassignClassroom(1, '103'),
);

// Скасування заняття
cancelLesson(1);
console.log('Schedule after cancelling lesson 1:', schedule);
