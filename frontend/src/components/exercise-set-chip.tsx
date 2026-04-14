import { Input } from "@/components/ui/input.tsx";
import { useSetStore } from "@/stores/set-store.ts";
import { useDebouncedCallback } from "use-debounce";
import type { ExerciseSet } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";

interface Props {
    workout_session_id: number;
    exerciseSet: ExerciseSet;
    flyoutOpen: boolean;
    onFlyoutOpenChange: (open: boolean) => void;
    editingReps: boolean;
    onEditingRepsChange: (editing: boolean) => void;
}

function ExerciseSetChip({ workout_session_id, exerciseSet, flyoutOpen, onFlyoutOpenChange, editingReps, onEditingRepsChange }: Props) {
    const { patchSet, patchSetLocally, deleteSet } = useSetStore();
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const didLongPress = useRef(false);
    const [chargePhase, setChargePhase] = useState<'idle' | 'charging' | 'rewinding'>('idle');
    const prevFlyoutOpen = useRef(false);
    const [weightDraft, setWeightDraft] = useState('');
    const [repsDraft, setRepsDraft] = useState('');
    const weightDraftRef = useRef('');
    const repsDraftRef = useRef('');

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
        setChargePhase('charging');
        try { navigator.vibrate?.(12); } catch { /* unsupported */ }
        longPressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            setChargePhase('idle');
            try { navigator.vibrate?.(60); } catch { /* unsupported */ }
            const w = exerciseSet.value?.toString() ?? '';
            const r = exerciseSet.reps?.toString() ?? '';
            setWeightDraft(w); weightDraftRef.current = w;
            setRepsDraft(r); repsDraftRef.current = r;
            onFlyoutOpenChange(true);
        }, 400);
    }

    function handlePointerUp() {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        if (!didLongPress.current) {
            setChargePhase('rewinding');
            if (exerciseSet.id >= 0) onEditingRepsChange(true);
        }
    }

    function cancelLongPress() {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        if (!didLongPress.current) setChargePhase('rewinding');
    }

    useEffect(() => {
        if (prevFlyoutOpen.current && !flyoutOpen) {
            const value = parseFloat(weightDraftRef.current);
            const reps = parseInt(repsDraftRef.current, 10);
            const patch: Record<string, number> = {};
            if (!isNaN(value) && value !== exerciseSet.value) patch.value = value;
            if (!isNaN(reps) && reps !== exerciseSet.reps) patch.reps = reps;
            if (Object.keys(patch).length > 0) {
                patchSetLocally(workout_session_id, exerciseSet.id, patch);
                patchSet(workout_session_id, exerciseSet.id, patch);
            }
        }
        prevFlyoutOpen.current = flyoutOpen;
    }, [flyoutOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleFlyoutOpenChange(open: boolean) {
        onFlyoutOpenChange(open);
    }

    function handleDelete() {
        deleteSet(workout_session_id, exerciseSet.id);
        onFlyoutOpenChange(false);
    }

    return (
        <Popover open={flyoutOpen} onOpenChange={handleFlyoutOpenChange}>
            <PopoverAnchor asChild>
                <div
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    onContextMenu={e => e.preventDefault()}
                    className="relative select-none p-2 -m-2"
                >
                    {!editingReps && (
                        <div
                            className="absolute inset-2 rounded-md border-2 border-primary pointer-events-none"
                            style={{
                                transform: chargePhase === 'charging' ? 'scale(2)' : 'scale(1)',
                                opacity: chargePhase === 'charging' ? 0.5 : 0,
                                transition: chargePhase === 'charging'
                                    ? 'transform 400ms ease-in, opacity 80ms'
                                    : chargePhase === 'rewinding'
                                    ? 'transform 150ms ease-out, opacity 150ms ease-out'
                                    : 'none',
                            }}
                        />
                    )}
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
                            onBlur={() => onEditingRepsChange(false)}
                        />
                    ) : (
                        <div className={`relative w-11 h-9 flex items-center justify-center rounded-md border text-sm overflow-hidden transition-colors ${flyoutOpen ? 'border-primary bg-primary/10' : 'border-primary/20'}`}>
                            <div
                                className="absolute inset-0 bg-primary/25 origin-left"
                                style={{
                                    transform: chargePhase === 'charging' ? 'scaleX(1)' : 'scaleX(0)',
                                    transition: chargePhase === 'charging'
                                        ? 'transform 400ms ease-in'
                                        : chargePhase === 'rewinding'
                                        ? 'transform 150ms ease-out'
                                        : 'none',
                                }}
                                onTransitionEnd={() => {
                                    if (chargePhase === 'rewinding') setChargePhase('idle');
                                }}
                            />
                            <span className="relative z-10">{exerciseSet.reps ?? '—'}</span>
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
                            onChange={e => { const v = e.target.value.replace(/[^0-9.]/g, ''); setWeightDraft(v); weightDraftRef.current = v; }}
                            onKeyDown={e => { if (e.key === 'Enter') handleFlyoutOpenChange(false); }}
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
                            onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); setRepsDraft(v); repsDraftRef.current = v; }}
                            onKeyDown={e => { if (e.key === 'Enter') handleFlyoutOpenChange(false); }}
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
