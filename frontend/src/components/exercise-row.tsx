import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Exercise, WorkoutType } from "@/types";

interface Props {
    exercise: Exercise;
    workoutTypes: WorkoutType[];
    onSave: (id: number, name: string, workoutTypeIds: number[]) => void;
    onDelete: (id: number) => void;
}

function ExerciseRow({ exercise, workoutTypes, onSave, onDelete }: Props) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const [nameDraft, setNameDraft] = useState(exercise.name);
    const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>(
        exercise.workout_types.map(wt => wt.id)
    );
    const [pendingDelete, setPendingDelete] = useState(false);
    const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function open() {
        setNameDraft(exercise.name);
        setSelectedTypeIds(exercise.workout_types.map(wt => wt.id));
        setExpanded(true);
    }

    function cancel() {
        setExpanded(false);
        setPendingDelete(false);
    }

    function save() {
        if (nameDraft.trim()) onSave(exercise.id, nameDraft.trim(), selectedTypeIds);
        setExpanded(false);
    }

    function toggleType(id: number) {
        setSelectedTypeIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    function handleDelete() {
        if (pendingDelete) {
            if (deleteTimer.current) clearTimeout(deleteTimer.current);
            onDelete(exercise.id);
        } else {
            setPendingDelete(true);
            deleteTimer.current = setTimeout(() => setPendingDelete(false), 2000);
        }
    }

    if (expanded) {
        return (
            <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/30">
                <Input
                    value={nameDraft}
                    onChange={e => setNameDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
                    autoFocus
                />
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground">{t("manage_page.workout_types_label")}</p>
                    <div className="flex flex-wrap gap-2">
                        {workoutTypes.map(wt => {
                            const selected = selectedTypeIds.includes(wt.id);
                            return (
                                <button
                                    key={wt.id}
                                    onClick={() => toggleType(wt.id)}
                                    className={cn(
                                        "text-xs px-2.5 py-1 rounded-full border transition-colors",
                                        selected
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "text-muted-foreground border-muted-foreground/30 hover:border-primary/50"
                                    )}
                                >
                                    {wt.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={cancel}>{t("manage_page.cancel")}</Button>
                    <Button size="sm" onClick={save}>{t("manage_page.save")}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 py-2 px-1">
            <button onClick={open} className="flex-1 min-w-0 text-left hover:text-primary transition-colors">
                <p className="text-sm truncate">{exercise.name}</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                    {exercise.workout_types.map(wt => (
                        <span key={wt.id} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {wt.name}
                        </span>
                    ))}
                </div>
            </button>
            <button
                onClick={handleDelete}
                className={cn(
                    "shrink-0 transition-colors",
                    pendingDelete ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                )}
            >
                <Trash2 size={15} />
            </button>
        </div>
    );
}

export default ExerciseRow;
