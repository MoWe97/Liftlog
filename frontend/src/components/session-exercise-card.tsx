import { Item, ItemContent } from "@/components/ui/item.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { ExerciseSet, SessionExercise } from "@/types";
import { Separator } from "@/components/ui/separator.tsx";
import { Pencil, PlusIcon, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { useSetStore } from "@/stores/set-store";
import { useDebouncedCallback } from "use-debounce";

interface Props {
    sessionExercise: SessionExercise;
    onDelete: () => void;
}

function SessionExerciseCard({ sessionExercise, onDelete }: Props) {
    const [sets, setSets] = useState<ExerciseSet[]>(sessionExercise.sets);
    const [editMode, setEditMode] = useState(false);
    const [editingWeightSetIds, setEditingWeightSetIds] = useState<number[] | null>(null);
    const [weightDraft, setWeightDraft] = useState('');
    const weightInputRef = useRef<HTMLInputElement>(null);
    const { addSet: addSetToStore, deleteSet, patchSet } = useSetStore();

    const saveReps = useDebouncedCallback((id: number, reps: number) => {
        patchSet(sessionExercise.workout_session_id, id, { reps });
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

    function handleDeleteSet(id: number): void {
        setSets(prev => prev.filter(s => s.id !== id));
        deleteSet(sessionExercise.workout_session_id, id);
    }

    async function handleAddSet(): Promise<void> {
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
        setSets(prev => [...prev, tempSet]);

        const [created] = await addSetToStore(sessionExercise.workout_session_id, sessionExercise.id, [tempSet]);
        setSets(prev => prev.map(s => s.id === tempId ? created : s));
    }

    function openWeightEdit(ids: number[], currentValue: number | undefined) {
        setEditingWeightSetIds(ids);
        setWeightDraft(currentValue?.toString() ?? '');
        setTimeout(() => weightInputRef.current?.focus(), 0);
    }

    function commitWeightEdit() {
        const newValue = parseFloat(weightDraft);
        if (!isNaN(newValue) && editingWeightSetIds) {
            setSets(prev => prev.map(s =>
                editingWeightSetIds.includes(s.id) ? { ...s, value: newValue } : s
            ));
            for (const id of editingWeightSetIds) {
                patchSet(sessionExercise.workout_session_id, id, { value: newValue });
            }
        }
        setEditingWeightSetIds(null);
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
                        // Edit mode: each set individually with weight above and delete button below
                        sets.map((set) => {
                            const isPending = set.id < 0;
                            const isBodyweight = set.unit === 'bodyweight';
                            const weightLabel = isBodyweight ? 'BW' : `${set.value ?? '—'}kg`;
                            const isEditingWeight = editingWeightSetIds?.length === 1 && editingWeightSetIds[0] === set.id;

                            return (
                                <div
                                    key={set.id}
                                    className="flex flex-col items-center gap-1 border rounded-md p-1 m-1 border-primary/30 bg-primary/5"
                                >
                                    {isEditingWeight ? (
                                        <div className="flex items-center gap-0.5">
                                            <input
                                                ref={weightInputRef}
                                                type="text"
                                                inputMode="decimal"
                                                className="w-12 text-center text-xs bg-transparent border-b border-primary/50 outline-none"
                                                value={weightDraft}
                                                onChange={e => setWeightDraft(e.target.value.replace(/[^0-9.]/g, ''))}
                                                onBlur={commitWeightEdit}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') commitWeightEdit();
                                                    if (e.key === 'Escape') setEditingWeightSetIds(null);
                                                }}
                                            />
                                            {!isBodyweight && <span className="text-xs text-muted-foreground">kg</span>}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openWeightEdit([set.id], set.value)}
                                            disabled={isPending || isBodyweight}
                                            className="text-xs text-muted-foreground disabled:cursor-default"
                                        >
                                            {weightLabel}
                                        </button>
                                    )}
                                    <Button
                                        onClick={() => handleDeleteSet(set.id)}
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
                        // Normal mode: sets grouped by weight
                        groups.map((group, groupIndex) => {
                            const isPending = group.some(s => s.id < 0);
                            const isBodyweight = group[0].unit === 'bodyweight';
                            const weightLabel = isBodyweight ? 'BW' : `${group[0].value ?? '—'}kg`;
                            const isEditingGroup = editingWeightSetIds !== null &&
                                group.every(s => editingWeightSetIds.includes(s.id));

                            return (
                                <div
                                    key={groupIndex}
                                    className="flex flex-col items-center gap-1 border rounded-md p-1 m-1 border-primary/30 bg-primary/5"
                                >
                                    {isEditingGroup ? (
                                        <div className="flex items-center gap-0.5">
                                            <input
                                                ref={weightInputRef}
                                                type="text"
                                                inputMode="decimal"
                                                className="w-12 text-center text-xs bg-transparent border-b border-primary/50 outline-none"
                                                value={weightDraft}
                                                onChange={e => setWeightDraft(e.target.value.replace(/[^0-9.]/g, ''))}
                                                onBlur={commitWeightEdit}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') commitWeightEdit();
                                                    if (e.key === 'Escape') setEditingWeightSetIds(null);
                                                }}
                                            />
                                            {!isBodyweight && <span className="text-xs text-muted-foreground">kg</span>}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openWeightEdit(group.map(s => s.id), group[0].value)}
                                            disabled={isPending || isBodyweight}
                                            className="text-xs text-muted-foreground disabled:cursor-default"
                                        >
                                            {weightLabel}
                                        </button>
                                    )}
                                    <div className="flex gap-1">
                                        {group.map((set) => (
                                            <Input
                                                key={set.id}
                                                maxLength={2}
                                                type="text"
                                                inputMode="numeric"
                                                className="w-9 h-9 text-center text-xs bg-transparent border-primary/20"
                                                value={set.reps || ''}
                                                onChange={e => handleRepsChange(set.id, e.target.value)}
                                                disabled={set.id < 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
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
