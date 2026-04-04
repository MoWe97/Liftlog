import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Pencil, PlusIcon, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useExerciseStore } from "@/stores/exercises-store";
import { useWorkoutTypesStore } from "@/stores/workout-types-store";
import type { Exercise, WorkoutType } from "@/types";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface EditingState {
    id: number;
    draft: string;
}

function ManageSheet({ open, onOpenChange }: Props) {
    const { t } = useTranslation();
    const { exercises, renameExercise, deleteExercise, createExercise } = useExerciseStore();
    const { workoutTypes, renameWorkoutType, deleteWorkoutType, createWorkoutType } = useWorkoutTypesStore();

    const [editingExercise, setEditingExercise] = useState<EditingState | null>(null);
    const [editingWorkoutType, setEditingWorkoutType] = useState<EditingState | null>(null);
    const [newExerciseName, setNewExerciseName] = useState("");
    const [newWorkoutTypeName, setNewWorkoutTypeName] = useState("");
    const [pendingDeleteExerciseId, setPendingDeleteExerciseId] = useState<number | null>(null);
    const [pendingDeleteWorkoutTypeId, setPendingDeleteWorkoutTypeId] = useState<number | null>(null);
    const exerciseDeleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const workoutTypeDeleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function startEditExercise(exercise: Exercise) {
        setEditingExercise({ id: exercise.id, draft: exercise.name });
    }

    function commitEditExercise() {
        if (editingExercise && editingExercise.draft.trim()) {
            renameExercise(editingExercise.id, editingExercise.draft.trim());
        }
        setEditingExercise(null);
    }

    function startEditWorkoutType(wt: WorkoutType) {
        setEditingWorkoutType({ id: wt.id, draft: wt.name });
    }

    function commitEditWorkoutType() {
        if (editingWorkoutType && editingWorkoutType.draft.trim()) {
            renameWorkoutType(editingWorkoutType.id, editingWorkoutType.draft.trim());
        }
        setEditingWorkoutType(null);
    }

    function handleDeleteExercise(id: number) {
        if (pendingDeleteExerciseId === id) {
            if (exerciseDeleteTimer.current) clearTimeout(exerciseDeleteTimer.current);
            setPendingDeleteExerciseId(null);
            deleteExercise(id);
        } else {
            if (exerciseDeleteTimer.current) clearTimeout(exerciseDeleteTimer.current);
            setPendingDeleteExerciseId(id);
            exerciseDeleteTimer.current = setTimeout(() => setPendingDeleteExerciseId(null), 2000);
        }
    }

    function handleDeleteWorkoutType(id: number) {
        if (pendingDeleteWorkoutTypeId === id) {
            if (workoutTypeDeleteTimer.current) clearTimeout(workoutTypeDeleteTimer.current);
            setPendingDeleteWorkoutTypeId(null);
            deleteWorkoutType(id);
        } else {
            if (workoutTypeDeleteTimer.current) clearTimeout(workoutTypeDeleteTimer.current);
            setPendingDeleteWorkoutTypeId(id);
            workoutTypeDeleteTimer.current = setTimeout(() => setPendingDeleteWorkoutTypeId(null), 2000);
        }
    }

    async function handleAddExercise() {
        const name = newExerciseName.trim();
        if (!name) return;
        await createExercise(name, workoutTypes.map(wt => wt.id));
        setNewExerciseName("");
    }

    async function handleAddWorkoutType() {
        const name = newWorkoutTypeName.trim();
        if (!name) return;
        await createWorkoutType(name);
        setNewWorkoutTypeName("");
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{t("manage_sheet.title")}</SheetTitle>
                </SheetHeader>

                {/* Exercises */}
                <div className="flex flex-col gap-2 mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                        {t("manage_sheet.exercises")}
                    </p>
                    {exercises.length === 0 && (
                        <p className="text-sm text-muted-foreground px-1">{t("manage_sheet.no_exercises")}</p>
                    )}
                    {exercises.map(exercise => (
                        <div key={exercise.id} className="flex items-center gap-2 px-1">
                            {editingExercise?.id === exercise.id ? (
                                <Input
                                    className="h-8 text-sm"
                                    value={editingExercise.draft}
                                    onChange={e => setEditingExercise({ ...editingExercise, draft: e.target.value })}
                                    onBlur={commitEditExercise}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") commitEditExercise();
                                        if (e.key === "Escape") setEditingExercise(null);
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <span className="flex-1 text-sm truncate">{exercise.name}</span>
                            )}
                            <button
                                onClick={() => editingExercise?.id === exercise.id ? commitEditExercise() : startEditExercise(exercise)}
                                className="text-muted-foreground hover:text-foreground shrink-0"
                            >
                                {editingExercise?.id === exercise.id ? <Check size={15} /> : <Pencil size={15} />}
                            </button>
                            <button
                                onClick={() => handleDeleteExercise(exercise.id)}
                                className={cn(
                                    "shrink-0 transition-colors",
                                    pendingDeleteExerciseId === exercise.id ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                                )}
                            >
                                {pendingDeleteExerciseId === exercise.id ? <Check size={15} /> : <Trash2 size={15} />}
                            </button>
                        </div>
                    ))}
                    <div className="flex gap-2 px-1 mt-1">
                        <Input
                            className="h-8 text-sm"
                            placeholder={t("manage_sheet.add_exercise_placeholder")}
                            value={newExerciseName}
                            onChange={e => setNewExerciseName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddExercise(); }}
                        />
                        <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={handleAddExercise}>
                            <PlusIcon size={14} />
                        </Button>
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Workout Types */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                        {t("manage_sheet.workout_types")}
                    </p>
                    {workoutTypes.length === 0 && (
                        <p className="text-sm text-muted-foreground px-1">{t("manage_sheet.no_workout_types")}</p>
                    )}
                    {workoutTypes.map(wt => (
                        <div key={wt.id} className="flex items-center gap-2 px-1">
                            {editingWorkoutType?.id === wt.id ? (
                                <Input
                                    className="h-8 text-sm"
                                    value={editingWorkoutType.draft}
                                    onChange={e => setEditingWorkoutType({ ...editingWorkoutType, draft: e.target.value })}
                                    onBlur={commitEditWorkoutType}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") commitEditWorkoutType();
                                        if (e.key === "Escape") setEditingWorkoutType(null);
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <span className="flex-1 text-sm truncate">{wt.name}</span>
                            )}
                            <button
                                onClick={() => editingWorkoutType?.id === wt.id ? commitEditWorkoutType() : startEditWorkoutType(wt)}
                                className="text-muted-foreground hover:text-foreground shrink-0"
                            >
                                {editingWorkoutType?.id === wt.id ? <Check size={15} /> : <Pencil size={15} />}
                            </button>
                            <button
                                onClick={() => handleDeleteWorkoutType(wt.id)}
                                className={cn(
                                    "shrink-0 transition-colors",
                                    pendingDeleteWorkoutTypeId === wt.id ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                                )}
                            >
                                {pendingDeleteWorkoutTypeId === wt.id ? <Check size={15} /> : <Trash2 size={15} />}
                            </button>
                        </div>
                    ))}
                    <div className="flex gap-2 px-1 mt-1">
                        <Input
                            className="h-8 text-sm"
                            placeholder={t("manage_sheet.add_workout_type_placeholder")}
                            value={newWorkoutTypeName}
                            onChange={e => setNewWorkoutTypeName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddWorkoutType(); }}
                        />
                        <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={handleAddWorkoutType}>
                            <PlusIcon size={14} />
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default ManageSheet;
