import {Item, ItemContent, ItemTitle} from "@/components/ui/item.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {ExerciseSet, SessionExercise} from "@/types";
import {Separator} from "@/components/ui/separator.tsx";
import {Pencil, PlusIcon, Trash2, X} from "lucide-react";
import {useState} from "react";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {useSessionStore} from "@/stores/workout-session-store.ts";

interface Props {
    session_exercise: SessionExercise;
}

function WorkoutSessionExerciseColumn({ session_exercise }: Props){
    const handleRepsChange = (id: number, value: string) => {
        console.log("reps change", id, value);
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
    const displaySets = session_exercise.sets;
    const groups = groupSets(displaySets);
    const [editMode, setEditMode] = useState(false);
    const { addSetToSessionExercise, deleteSet } = useSessionStore();

    function handleDeleteSet(id: number): void {
        deleteSet(session_exercise.workout_session_id, id);
    }

    function addSet(): void {
        const newSet: Partial<ExerciseSet> = {
            session_exercise_id: session_exercise.id,
            unit: "kg",
            reps: 0
        }
        addSetToSessionExercise(session_exercise.workout_session_id, session_exercise.id, [newSet]);
    }

    return (
        <Item variant="outline" size="xs">
            <ItemContent className={"w-full"}>
                <div className="relative flex items-center justify-center w-full pb-2">
                    <button
                        className={cn('absolute left-0', editMode ? 'text-primary' : 'text-muted-foreground')}
                        onClick={() => setEditMode(prev => !prev)}
                    >
                        <Pencil size={16} />
                    </button>
                    <span className="truncate max-w-[60%] text-center text-sm font-medium">
                        {session_exercise.exercise.name}
                    </span>
                </div>
            <Separator/>
                <div className="flex gap-2">
                    {groups.map((group, groupIndex) => (
                        <div
                            key={groupIndex}
                            className="flex flex-col gap-1 border rounded-md h-16 p-1 m-1 border-primary/30 bg-primary/5"
                        >
                            {/* Weight label — spans full width of group */}
                            <div className="flex justify-between items-center px-1">
                                <button className="text-xs font-extralight">
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
                                    editMode ?
                                        <Button
                                            onClick={() => handleDeleteSet(set.id)}
                                            variant="destructive"
                                            size="icon"
                                        >
                                            <X size={16} />
                                        </Button>
                                        :
                                    <Input
                                        key={set.id}
                                        type="text"
                                        inputMode="numeric"
                                        className="w-9 h-9 text-center text-sm bg-transparent border-primary/20"
                                        placeholder="0"
                                        value={set.reps ?? ''}
                                        onChange={e => handleRepsChange(set.id, e.target.value)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="icon"
                        className={"mt-7"}
                        onClick={() => addSet()}
                    >
                        <PlusIcon size={16} />
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}
export default WorkoutSessionExerciseColumn;
