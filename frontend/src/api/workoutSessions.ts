import client from "./client";
import type {WorkoutSession} from "../types";

export const getWorkoutSessions = async (): Promise<WorkoutSession[]> => {
    const response = await client.get("/workout-sessions");
    return response.data;
};