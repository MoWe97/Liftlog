import client from "./client";
import type {WorkoutSession} from "../types";

export const getWorkoutSessions = async (date?: string): Promise<WorkoutSession[]> => {
    const params = date ? { date } : {};
    const response = await client.get("/workout-sessions", { params });
    return response.data;
};
