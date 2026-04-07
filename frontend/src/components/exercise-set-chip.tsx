import {Input} from "@/components/ui/input.tsx";
import {useSetStore} from "@/stores/set-store.ts";
import {useDebouncedCallback} from "use-debounce";
import type {ExerciseSet} from "@/types";

interface Props {
    workout_session_id: number;
    exerciseSet: ExerciseSet;
}

function ExerciseSetChip({workout_session_id, exerciseSet}: Props) {
    const { patchSet, patchSetLocally } = useSetStore();

    function handleRepsChange(id: number, raw: string) {
        const cleaned = raw.replace(/[^0-9]/g, '');
        const reps = cleaned === '' ? undefined : parseInt(cleaned, 10);
        if (reps === undefined) return;

        patchSetLocally(workout_session_id, id, {reps});
        saveReps(id, reps);
    }

    const saveReps = useDebouncedCallback((id: number, reps: number) => {
        patchSet(workout_session_id, id, { reps });
    }, 1000);

    return (
        <div>
            <Input
                maxLength={2}
                type="text"
                inputMode="numeric"
                className="w-9 h-9 text-center text-xs bg-transparent border-primary/20"
                value={exerciseSet.reps || ''}
                onChange={e => handleRepsChange(exerciseSet.id, e.target.value)}
                disabled={exerciseSet.id < 0}
            />
        </div>
    );
}

export default ExerciseSetChip;