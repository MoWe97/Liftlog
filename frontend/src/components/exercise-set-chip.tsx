import { Input } from "@/components/ui/input.tsx";
import { useSetStore } from "@/stores/set-store.ts";
import { useDebouncedCallback } from "use-debounce";
import type { ExerciseSet } from "@/types";
import { useRef, useState } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";

interface Props {
    workout_session_id: number;
    exerciseSet: ExerciseSet;
    flyoutOpen: boolean;
    onFlyoutOpenChange: (open: boolean) => void;
}

function ExerciseSetChip({ workout_session_id, exerciseSet, flyoutOpen, onFlyoutOpenChange }: Props) {
    const { patchSet, patchSetLocally, deleteSet } = useSetStore();
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const didLongPress = useRef(false);
    const [editingReps, setEditingReps] = useState(false);
    const [weightDraft, setWeightDraft] = useState('');
    const [repsDraft, setRepsDraft] = useState('');

    const saveReps = useDebouncedCallback((id: number, reps: number | null) => {
        patchSet(workout_session_id, id, { reps });
    }, 1000);

    function handleRepsChange(raw: string) {
        const cleaned = raw.replace(/[^0-9]/g, '');
        const reps = cleaned === '' ? null : parseInt(cleaned, 10);
        patchSetLocally(workout_session_id, exerciseSet.id, { reps });
        saveReps(exerciseSet.id, reps);
    }

    function handlePointerDown() {
        didLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            setWeightDraft(exerciseSet.value?.toString() ?? '');
            setRepsDraft(exerciseSet.reps?.toString() ?? '');
            onFlyoutOpenChange(true);
        }, 400);
    }

    function handlePointerUp() {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        if (!didLongPress.current && exerciseSet.id >= 0) {
            setEditingReps(true);
        }
    }

    function cancelLongPress() {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
    }

    function commitWeight() {
        const value = parseFloat(weightDraft);
        if (!isNaN(value)) {
            patchSetLocally(workout_session_id, exerciseSet.id, { value });
            patchSet(workout_session_id, exerciseSet.id, { value });
        }
    }

    function commitReps() {
        const reps = parseInt(repsDraft, 10);
        if (!isNaN(reps)) {
            patchSetLocally(workout_session_id, exerciseSet.id, { reps });
            patchSet(workout_session_id, exerciseSet.id, { reps });
        }
    }

    function handleDelete() {
        deleteSet(workout_session_id, exerciseSet.id);
        onFlyoutOpenChange(false);
    }

    return (
        <Popover open={flyoutOpen} onOpenChange={onFlyoutOpenChange}>
            <PopoverAnchor asChild>
                <div
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    onContextMenu={e => e.preventDefault()}
                    className="select-none p-2 -m-2"
                >
                    {editingReps ? (
                        <Input
                            autoFocus
                            maxLength={3}
                            type="text"
                            inputMode="numeric"
                            style={{ fontSize: '16px' }}
                            className="w-11 h-9 text-center bg-transparent border-primary"
                            value={exerciseSet.reps ?? ''}
                            onChange={e => handleRepsChange(e.target.value)}
                            onBlur={() => setEditingReps(false)}
                        />
                    ) : (
                        <div className={`w-11 h-9 flex items-center justify-center rounded-md border text-sm transition-colors ${flyoutOpen ? 'border-primary bg-primary/10' : 'border-primary/20'}`}>
                            {exerciseSet.reps ?? '—'}
                        </div>
                    )}
                </div>
            </PopoverAnchor>

            <PopoverContent
                className="w-auto p-3"
                side="top"
                sideOffset={6}
                onOpenAutoFocus={e => e.preventDefault()}
            >
                <div className="flex items-end gap-2" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Weight ({exerciseSet.unit})</label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            value={weightDraft}
                            onChange={e => setWeightDraft(e.target.value.replace(/[^0-9.]/g, ''))}
                            onBlur={commitWeight}
                            onKeyDown={e => { if (e.key === 'Enter') commitWeight(); }}
                            className="w-20 text-center h-9"
                            style={{ fontSize: '16px' }}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Reps</label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={repsDraft}
                            onChange={e => setRepsDraft(e.target.value.replace(/[^0-9]/g, ''))}
                            onBlur={commitReps}
                            onKeyDown={e => { if (e.key === 'Enter') commitReps(); }}
                            className="w-16 text-center h-9"
                            style={{ fontSize: '16px' }}
                        />
                    </div>
                    <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default ExerciseSetChip;
