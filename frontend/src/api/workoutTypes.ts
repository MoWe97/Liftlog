import type { WorkoutType} from "@/types";
import client from "@/api/client.ts";

export const getWorkoutTypes = async (): Promise<WorkoutType[]> => {
    const response = await client.get("/workout-types");
    return response.data;
};
