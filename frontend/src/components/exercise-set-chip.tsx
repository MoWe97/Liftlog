import { Input } from "@/components/ui/input.tsx";
import { useSetStore } from "@/stores/set-store.ts";
import { useDebouncedCallback } from "use-debounce";
import type { ExerciseSet } from "@/types";
import { useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button.tsx";

interface Props {
    workout_session_id: number;
    exerciseSet: ExerciseSet;
}

function ExerciseSetChip({ workout_session_id, exerciseSet }: Props) {
    const { patchSet, patchSetLocally, deleteSet } = useSetStore();
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
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
        longPressTimer.current = setTimeout(() => {
            setWeightDraft(exerciseSet.value?.toString() ?? '');
            setRepsDraft(exerciseSet.reps?.toString() ?? '');
            setSheetOpen(true);
        }, 300);
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
        setSheetOpen(false);
    }

    return (
        <>
            <div
                onPointerDown={handlePointerDown}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
                onContextMenu={e => e.preventDefault()}
                className="select-none"
            >
                <Input
                    maxLength={3}
                    type="text"
                    inputMode="numeric"
                    style={{ fontSize: '16px' }}
                    className="w-11 h-9 text-center bg-transparent border-primary/20"
                    value={exerciseSet.reps || ''}
                    onChange={e => handleRepsChange(e.target.value)}
                    disabled={exerciseSet.id < 0}
                />
            </div>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen} >
                <SheetContent side="bottom" className="p-6">
                    <SheetHeader>
                        <SheetTitle>Edit Set</SheetTitle>
                    </SheetHeader>
                    <div className="flex gap-4 mt-4" style={{ fontSize: '16px', userSelect: 'none', WebkitUserSelect: 'none' }}>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-sm text-muted-foreground">Weight ({exerciseSet.unit})</label>
                            <Input
                                type="text"
                                inputMode="decimal"
                                value={weightDraft}
                                onChange={e => setWeightDraft(e.target.value.replace(/[^0-9.]/g, ''))}
                                onBlur={commitWeight}
                                onKeyDown={e => { if (e.key === 'Enter') commitWeight(); }}
                                className="text-center text-lg h-12"
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5">
                            <label className="text-sm text-muted-foreground">Reps</label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                value={repsDraft}
                                onChange={e => setRepsDraft(e.target.value.replace(/[^0-9]/g, ''))}
                                onBlur={commitReps}
                                onKeyDown={e => { if (e.key === 'Enter') commitReps(); }}
                                className="text-center text-lg h-12"
                            />
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full mt-6"
                        onClick={handleDelete}
                    >
                        Delete Set
                    </Button>
                </SheetContent>
            </Sheet>
        </>
    );
}

export default ExerciseSetChip;
