import client from "./client";
import type {WorkoutSession} from "../types";

export const getWorkoutSessions = async (date?: string): Promise<WorkoutSession[]> => {
    const params = date ? { date } : {};
    const response = await client.get("/workout-sessions", { params });
    return response.data;
};

export const addWorkoutSession = async (date: string, workout_type_id: number): Promise<WorkoutSession> => {
    const response = await client.post("/workout-session", { date, workout_type_id });
    return response.data;
};

export const deleteWorkoutSession = async (id: number): Promise<void> => {
    await client.delete(`/workout-session/${id}`);
};