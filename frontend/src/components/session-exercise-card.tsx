import { Item, ItemContent } from "@/components/ui/item.tsx";
import type { ExerciseSet, SessionExercise } from "@/types";
import { Separator } from "@/components/ui/separator.tsx";
import { PlusIcon, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useSetStore } from "@/stores/set-store";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import ExerciseSetChip from "@/components/exercise-set-chip.tsx";

interface Props {
    sessionExercise: SessionExercise;
    onDelete: () => void;
}

function SessionExerciseCard({ sessionExercise, onDelete }: Props) {
    const [openFlyoutSetId, setOpenFlyoutSetId] = useState<number | null>(null);
    const [pendingDelete, setPendingDelete] = useState(false);
    const pendingDeleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { addSet: addSetToStore } = useSetStore();

    function handleDeleteClick() {
        if (pendingDelete) {
            if (pendingDeleteTimer.current) clearTimeout(pendingDeleteTimer.current);
            onDelete();
        } else {
            setPendingDelete(true);
            pendingDeleteTimer.current = setTimeout(() => setPendingDelete(false), 2000);
        }
    }
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
                    <span className="truncate max-w-[60%] text-center text-sm font-medium">
                        {sessionExercise.exercise.name}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute right-0 hover:text-destructive hover:bg-destructive/10 ${pendingDelete ? 'text-destructive' : 'text-muted-foreground'}`}
                        onClick={handleDeleteClick}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
                <Separator />
                <div className="flex gap-2 overflow-x-auto">
                    {groups.map((group, groupIndex) => (
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
                    ))}
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
