import type { WorkoutType } from "@/types";
import client from "@/api/client.ts";

export const getWorkoutTypes = async (): Promise<WorkoutType[]> => {
    const response = await client.get("/workout-types");
    return response.data;
};

export const createWorkoutType = async (name: string): Promise<WorkoutType> => {
    const response = await client.post("/workout-types", { name });
    return response.data;
};
