import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { WorkoutType } from "@/types";

interface Props {
    workoutType: WorkoutType;
    onSave: (id: number, name: string) => void;
    onDelete: (id: number) => void;
}

function WorkoutTypeRow({ workoutType, onSave, onDelete }: Props) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const [nameDraft, setNameDraft] = useState(workoutType.name);
    const [pendingDelete, setPendingDelete] = useState(false);
    const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function open() {
        setNameDraft(workoutType.name);
        setExpanded(true);
    }

    function cancel() {
        setExpanded(false);
        setPendingDelete(false);
    }

    function save() {
        if (nameDraft.trim()) onSave(workoutType.id, nameDraft.trim());
        setExpanded(false);
    }

    function handleDelete() {
        if (pendingDelete) {
            if (deleteTimer.current) clearTimeout(deleteTimer.current);
            onDelete(workoutType.id);
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
                <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={cancel}>{t("manage_page.cancel")}</Button>
                    <Button size="sm" onClick={save}>{t("manage_page.save")}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 py-2 px-1">
            <button onClick={open} className="flex-1 text-left text-sm truncate hover:text-primary transition-colors">
                {workoutType.name}
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

export default WorkoutTypeRow;
