
export enum Page {
  DASHBOARD = 'DASHBOARD',
  FORM_TRACKER = 'FORM_TRACKER',
  PROGRESS_TRACKER = 'PROGRESS_TRACKER',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum FitnessGoal {
  LOSE_WEIGHT = 'Lose Weight',
  BUILD_MUSCLE = 'Build Muscle',
  MAINTAIN_WEIGHT = 'Maintain Weight',
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary (little or no exercise)',
  LIGHTLY_ACTIVE = 'Lightly Active (light exercise/sports 1-3 days/week)',
  MODERATELY_ACTIVE = 'Moderately Active (moderate exercise/sports 3-5 days/week)',
  VERY_ACTIVE = 'Very Active (hard exercise/sports 6-7 days a week)',
  EXTRA_ACTIVE = 'Extra Active (very hard exercise/sports & physical job)',
}

export interface UserData {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  goal: FitnessGoal;
  activityLevel: ActivityLevel;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: Exercise[];
  isRestDay: boolean;
}

export interface WorkoutPlan {
  dailyWorkouts: DailyWorkout[];
}

export interface Meal {
  name: string;
  calories: number;
  recipe: string;
}

export interface DailyDiet {
  day: string;
  meals: Meal[];
  totalCalories: number;
}

export interface DietPlan {
  dailyIntake: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  dailyDiets: DailyDiet[];
}

export interface ProgressEntry {
  date: string;
  weight: number;
}
