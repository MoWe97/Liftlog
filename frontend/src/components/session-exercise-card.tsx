import { Item, ItemContent } from "@/components/ui/item.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { ExerciseSet, SessionExercise } from "@/types";
import { Separator } from "@/components/ui/separator.tsx";
import { Pencil, PlusIcon, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import { useDebouncedCallback } from "use-debounce";

interface Props {
    sessionExercise: SessionExercise;
}

function SessionExerciseCard({ sessionExercise }: Props) {
    const [sets, setSets] = useState<ExerciseSet[]>(sessionExercise.sets);
    const [editMode, setEditMode] = useState(false);
    const { addSetToSessionExercise, deleteSet, changeReps } = useSessionStore();

    const saveReps = useDebouncedCallback((id: number, reps: number) => {
        changeReps(sessionExercise.workout_session_id, id, reps);
    }, 1000);

    const handleRepsChange = (id: number, raw: string) => {
        const cleaned = raw.replace(/[^0-9]/g, '');
        const reps = cleaned === '' ? undefined : parseInt(cleaned, 10);

        setSets(prev => prev.map(s => s.id === id ? { ...s, reps } : s));

        if (reps !== undefined) saveReps(id, reps);
    };

    const groupSets = (sets: ExerciseSet[]) => {
        return sets.reduce<ExerciseSet[][]>((groups, set) => {
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup[0].value === set.value) {
                lastGroup.push(set);
            } else {
                groups.push([set]);
            }
            return groups;
        }, []);
    };

    const groups = groupSets(sets);

    function handleDeleteSet(id: number): void {
        setSets(prev => prev.filter(s => s.id !== id));
        deleteSet(sessionExercise.workout_session_id, id);
    }

    function addSet(): void {
        const { value, unit } = sets.length > 0
            ? { value: sets[sets.length - 1].value, unit: sets[sets.length - 1].unit }
            : { value: 0, unit: 'kg' as const };

        const newSet: ExerciseSet = {
            id: -(sets.length + 1), // temp id
            session_exercise_id: sessionExercise.id,
            unit,
            value,
            reps: undefined,
            duration_seconds: undefined,
        };
        setSets(prev => [...prev, newSet]);
        addSetToSessionExercise(sessionExercise.workout_session_id, sessionExercise.id, [newSet]);
    }

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
                </div>
                <Separator />
                <div className="flex gap-2">
                    {groups.map((group, groupIndex) => (
                        <div
                            key={groupIndex}
                            className="flex flex-col gap-1 border rounded-md h-16 p-1 m-1 border-primary/30 bg-primary/5"
                        >
                            <div className="flex justify-between items-center px-1">
                                <button className="text-xs font-extralight">
                                    {group[0].unit === 'bodyweight' ? 'BW' : `${group[0].value ?? '—'}kg`}
                                </button>
                                {group.slice(1).map((set) => (
                                    <button key={set.id} className="text-xs text-muted-foreground">
                                        {set.unit === 'bodyweight' ? 'BW' : `${set.value ?? '—'}kg`}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                {group.map((set) => (
                                    editMode ? (
                                        <Button
                                            key={set.id}
                                            onClick={() => handleDeleteSet(set.id)}
                                            variant="destructive"
                                            size="icon"
                                        >
                                            <X size={16} />
                                        </Button>
                                    ) : (
                                        <Input
                                            key={set.id}
                                            maxLength={2}
                                            type="text"
                                            inputMode="numeric"
                                            className="w-9 h-9 text-center text-xs bg-transparent border-primary/20"
                                            value={set.reps || ''}
                                            onChange={e => handleRepsChange(set.id, e.target.value)}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="icon"
                        className="mt-7"
                        onClick={addSet}
                    >
                        <PlusIcon size={16} />
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}

export default SessionExerciseCard;
