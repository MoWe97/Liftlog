import { Item, ItemContent } from "@/components/ui/item.tsx";
import type { ExerciseSet, SessionExercise } from "@/types";
import { Separator } from "@/components/ui/separator.tsx";
import { Pencil, PlusIcon, Trash2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { useSetStore } from "@/stores/set-store";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import ExerciseSetChip from "@/components/exercise-set-chip.tsx";

interface Props {
    sessionExercise: SessionExercise;
    onDelete: () => void;
}

function SessionExerciseCard({ sessionExercise, onDelete }: Props) {
    const [editMode, setEditMode] = useState(false);
    const [openFlyoutSetId, setOpenFlyoutSetId] = useState<number | null>(null);
    const { addSet: addSetToStore, deleteSet } = useSetStore();
    const sets = useSessionStore(s => s.sessions
                            .find(session => session.id === sessionExercise.workout_session_id)
                            ?.session_exercises
                            .find(se => se.id === sessionExercise.id)
                            ?.sets ?? []);

    function groupSets(sets: ExerciseSet[]) {
        return sets.reduce<ExerciseSet[][]>((groups, set) => {
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup[0].value === set.value) {
                lastGroup.push(set);
            } else {
                groups.push([set]);
            }
            return groups;
        }, []);
    }

    async function handleAddSet() {
        const { value, unit } = sets.length > 0
            ? { value: sets[sets.length - 1].value, unit: sets[sets.length - 1].unit }
            : { value: 0, unit: 'kg' as const };

        const tempId = -(sets.length + 1);
        const tempSet: ExerciseSet = {
            id: tempId,
            session_exercise_id: sessionExercise.id,
            unit,
            value,
            reps: undefined,
            duration_seconds: undefined,
        };
        await addSetToStore(sessionExercise.workout_session_id, sessionExercise.id, [tempSet]);
    }

    const groups = groupSets(sets);

    return (
        <Item variant="outline" size="xs">
            <ItemContent className="w-full">
                <div className="relative flex items-center justify-center w-full pb-2">
                    <button
                        className={cn('absolute left-0', editMode ? 'text-primary' : 'text-muted-foreground')}
                        onClick={() => setEditMode(prev => !prev)}
                    >
                        <Pencil size={16} />
                    </button>
                    <span className="truncate max-w-[60%] text-center text-sm font-medium">
                        {sessionExercise.exercise.name}
                    </span>
                    <button
                        className={cn(
                            'absolute right-0 transition-colors',
                            !editMode ? 'text-muted-foreground/30 pointer-events-none' : 'text-destructive',
                        )}
                        onClick={onDelete}
                        disabled={!editMode}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                <Separator />
                <div className="flex gap-2 overflow-x-auto">
                    {editMode ? (
                        sets.map((set) => {
                            const isPending = set.id < 0;
                            return (
                                <div
                                    key={set.id}
                                    className="flex flex-col items-center gap-1 border rounded-md p-1 m-1 border-primary/30 bg-primary/5"
                                >
                                    <span className="text-xs text-muted-foreground">
                                        {set.value ?? '—'}{set.unit}
                                    </span>
                                    <Button
                                        onClick={() => deleteSet(sessionExercise.workout_session_id, set.id)}
                                        variant="destructive"
                                        size="icon"
                                        disabled={isPending}
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            );
                        })
                    ) : (
                        groups.map((group, groupIndex) => (
                            <div
                                key={groupIndex}
                                className="flex flex-col items-center gap-1 border rounded-md p-1 m-1 border-primary/30 bg-primary/5"
                            >
                                <span className="text-xs text-muted-foreground">
                                    {group[0].value ?? '—'}{group[0].unit}
                                </span>
                                <div className="flex gap-1">
                                    {group.map((set) => (
                                        <ExerciseSetChip
                                            key={set.id}
                                            workout_session_id={sessionExercise.workout_session_id}
                                            exerciseSet={set}
                                            flyoutOpen={openFlyoutSetId === set.id}
                                            onFlyoutOpenChange={(open) => setOpenFlyoutSetId(open ? set.id : null)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                    <Button
                        variant="outline"
                        size="icon"
                        className="self-center shrink-0"
                        onClick={handleAddSet}
                    >
                        <PlusIcon size={16} />
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}

export default SessionExerciseCard;
