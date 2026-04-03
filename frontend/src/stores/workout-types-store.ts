import { create } from "zustand";
import type { WorkoutType } from "@/types";
import { getWorkoutTypes, createWorkoutType } from "@/api/workoutTypes.ts";

interface WorkoutTypesStore {
    workoutTypes: WorkoutType[];
    fetchWorkoutTypes: () => Promise<void>;
    createWorkoutType: (name: string) => Promise<WorkoutType>;
}

export const useWorkoutTypesStore = create<WorkoutTypesStore>((set) => ({
    workoutTypes: [],

    fetchWorkoutTypes: async () => {
        const data = await getWorkoutTypes();
        set({ workoutTypes: data });
    },

    createWorkoutType: async (name: string) => {
        const workoutType = await createWorkoutType(name);
        set(state => ({ workoutTypes: [...state.workoutTypes, workoutType] }));
        return workoutType;
    },
}));
