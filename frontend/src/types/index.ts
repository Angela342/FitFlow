export interface User {
  id: string;
  email: string;
  name: string;
  role: "Client" | "Admin";
  createdAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  scheduledAt?: string;
  completedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg?: number;
  durationSeconds?: number;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
