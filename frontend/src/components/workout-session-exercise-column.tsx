import {Item, ItemContent, ItemTitle} from "@/components/ui/item.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {ExerciseSet, SessionExercise} from "@/types";
import {Separator} from "@/components/ui/separator.tsx";
import {Pencil, Trash2} from "lucide-react";

interface Props {
    session_exercise: SessionExercise;
}

function WorkoutSessionExerciseColumn({ session_exercise }: Props){
    const handleRepsChange = (id: number, value: string) => {
        console.log("reps change", id, value);
    };
    const getDefaultWeight = () => {
        if (sets.length === 0) return { value: undefined, unit: 'bodyweight' };
        const last = sets[sets.length - 1];
        return { value: last.value, unit: last.unit };
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
    const displaySets = session_exercise.sets.length > 0 ? session_exercise.sets : [{
        id: -1, // temporary, not yet persisted
        session_exercise_id: session_exercise.id,
        unit: 'bodyweight' as const,
        value: undefined,
        reps: undefined,
        duration_seconds: undefined,
    }];
    const groups = groupSets(displaySets);

    return (
        <Item variant="outline" size="xs">
            <ItemContent className={"w-full"}>
                <div className="relative flex items-center justify-center w-full pb-2">
                    <button className="absolute left-0">
                        <Pencil size={16} />
                    </button>
                    <span className="truncate max-w-[60%] text-center text-sm font-medium">
                        {session_exercise.exercise.name}
                    </span>
                    {/*<button className="absolute right-0">*/}
                    {/*    <Trash2 size={16} />*/}
                    {/*</button>*/}
                </div>
            <Separator/>
                <div className="flex gap-2">
                    {groups.map((group, groupIndex) => (
                        <div
                            key={groupIndex}
                            className="flex flex-col gap-1 border rounded-md p-1 border-primary/30 bg-primary/5"
                        >
                            {/* Weight label — spans full width of group */}
                            <div className="flex justify-between items-center px-1">
                                <button className="text-xs font-medium">
                                    {group[0].unit === 'bodyweight' ? 'BW' : `${group[0].value ?? '—'}kg`}
                                </button>
                                {/* Muted repeats for sets 2+ — invisible but keeps alignment */}
                                {group.slice(1).map((set) => (
                                    <button key={set.id} className="text-xs text-muted-foreground">
                                        {set.unit === 'bodyweight' ? 'BW' : `${set.value ?? '—'}kg`}
                                    </button>
                                ))}
                            </div>

                            {/* Reps inputs row */}
                            <div className="flex gap-1">
                                {group.map((set) => (
                                    <Input
                                        key={set.id}
                                        type="text"
                                        inputMode="numeric"
                                        className="w-12 h-8 text-center text-sm bg-transparent border-primary/20"
                                        placeholder="0"
                                        value={set.reps ?? ''}
                                        onChange={e => handleRepsChange(set.id, e.target.value)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ItemContent>
        </Item>
    );
}
export default WorkoutSessionExerciseColumn;
