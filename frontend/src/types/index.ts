type ResistanceUnit = "kg" | "lbs"

export interface WorkoutType {
    id: number;
    name: string;
}

export interface ExerciseSet {
    id: number;
    session_exercise_id: number;
    unit: ResistanceUnit;
    value: number | undefined;
    reps: number | null;
    duration_seconds: number | undefined;
}

export interface Exercise {
    id: number;
    name: string;
    workout_types: WorkoutType[];
}

export interface SessionExercise {
    id: number;
    workout_session_id: number;
    exercise: Exercise;
    sets: ExerciseSet[];
}

export interface WorkoutSession {
    id: number;
    date: string;
    name?: string;
    session_exercises: SessionExercise[];
}
