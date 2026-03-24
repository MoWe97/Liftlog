export interface WorkoutType {
    id: number;
    name: string;
}

export interface WorkoutSession {
    id: number;
    date: string;
    workout_type_id?: number;
    workout_type?: WorkoutType;
}
