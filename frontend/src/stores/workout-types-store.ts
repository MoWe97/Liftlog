import { create } from "zustand";
import type { WorkoutType } from "@/types";
import { getWorkoutTypes } from "@/api/workoutTypes.ts";

interface WorkoutTypesStore {
    workoutTypes: WorkoutType[];
    fetchWorkoutTypes: () => Promise<void>;
}

export const useWorkoutTypesStore = create<WorkoutTypesStore>((set) => ({
    workoutTypes: [],

    fetchWorkoutTypes: async () => {
        const data = await getWorkoutTypes();
        set({ workoutTypes: data });
    },
}));
