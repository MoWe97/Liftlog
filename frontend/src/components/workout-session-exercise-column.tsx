import {Item, ItemContent, ItemTitle} from "@/components/ui/item.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {SessionExercise} from "@/types";
import {useEffect} from "react";

interface Props {
    session_exercise: SessionExercise;
}

function WorkoutSessionExerciseColumn({ session_exercise }: Props){
    return (
        <Item variant={"outline"} size={"xs"}>
            <ItemTitle>{session_exercise.exercise.name}</ItemTitle>
            <ItemContent>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        inputMode="numeric"
                        className="w-14 text-center"
                        placeholder="0"
                    />
                    <Input
                        type="number"
                        inputMode="numeric"
                        className="w-14 text-center"
                        placeholder="0"
                    />
                    <Input
                        type="number"
                        inputMode="numeric"
                        className="w-14 text-center"
                        placeholder="0"
                    />
                </div>
            </ItemContent>
        </Item>
    );
}
export default WorkoutSessionExerciseColumn;
