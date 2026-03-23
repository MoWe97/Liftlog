import { create } from "zustand";
import type { WorkoutType } from "@/types";
import {getWorkoutTypes} from "@/api/workoutTypes.ts";

interface WorkoutTypesStore {
    workout_types: WorkoutType[];
    fetchWorkoutTypes: () => Promise<void>;
}

export const useWorkoutTypesStore = create<WorkoutTypesStore>((set) => ({
    workout_types: [],

    fetchWorkoutTypes: async () => {
        const data = await getWorkoutTypes();
        set({ workout_types: data });
    },
}));
