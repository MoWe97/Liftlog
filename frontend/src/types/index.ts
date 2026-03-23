export interface WorkoutSession {
    id: number;
    date: string;
    workout_type_id: number;
}

export interface WorkoutType {
    id: number;
    name: string;
}
