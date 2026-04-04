import { create } from "zustand";
import type { WorkoutType } from "@/types";
import { getWorkoutTypes, createWorkoutType, renameWorkoutType, deleteWorkoutType } from "@/api/workoutTypes.ts";

interface WorkoutTypesStore {
    workoutTypes: WorkoutType[];
    fetchWorkoutTypes: () => Promise<void>;
    createWorkoutType: (name: string) => Promise<WorkoutType>;
    renameWorkoutType: (id: number, name: string) => Promise<void>;
    deleteWorkoutType: (id: number) => Promise<void>;
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

    renameWorkoutType: async (id: number, name: string) => {
        const updated = await renameWorkoutType(id, name);
        set(state => ({
            workoutTypes: state.workoutTypes.map(wt => wt.id === id ? updated : wt),
        }));
    },

    deleteWorkoutType: async (id: number) => {
        await deleteWorkoutType(id);
        set(state => ({ workoutTypes: state.workoutTypes.filter(wt => wt.id !== id) }));
    },
}));
