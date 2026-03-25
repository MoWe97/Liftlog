export interface WorkoutType {
    id: number;
    name: string;
}

export interface Exercise {
    id: number;
    name: string;
    workout_type: WorkoutType;
}

export interface SessionExercise {
    id: number;
    workout_session_id: number;
    exercise_id: number;
    workout_session: WorkoutSession;
    exercise: Exercise
    // sets: ExerciseSet[]
}
export interface WorkoutSession {
    id: number;
    date: string;
    workout_type_id?: number;
    workout_type?: WorkoutType;
    session_exercises: SessionExercise[];
}
