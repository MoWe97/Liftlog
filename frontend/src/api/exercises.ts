import type { Exercise } from "@/types";
import client from "@/api/client.ts";

export const getExercises = async (): Promise<Exercise[]> => {
    const response = await client.get("/exercises");
    return response.data;
};

export const createExercise = async (name: string, workout_types_ids: number[]): Promise<Exercise> => {
    const response = await client.post("/exercises", { name, workout_types_ids });
    return response.data;
};

export const deleteExercise = async (id: number): Promise<void> => {
    await client.delete(`/exercises/${id}`);
};
