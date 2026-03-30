import type { Exercise } from "@/types";
import client from "@/api/client.ts";

export const getExercises = async (): Promise<Exercise[]> => {
    const response = await client.get("/exercises");
    return response.data;
};

export const addExercise = async (workout_type_id: number): Promise<Exercise> => {
    const response = await client.post("/exercises", { workout_type_id });
    return response.data;
};

export const deleteExercise = async (id: number): Promise<void> => {
    await client.delete(`/exercises/${id}`);
};
