import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "lucide-react";
import type { Exercise } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
    exercises: Exercise[];
    onSelect: (exerciseId: number) => void;
    onCreateAndSelect: (name: string) => Promise<void>;
    trigger?: React.ReactNode;
}

function AddExerciseDialog({ exercises, onSelect, onCreateAndSelect, trigger }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );
    const exactMatch = exercises.some(e =>
        e.name.toLowerCase() === search.trim().toLowerCase()
    );
    const showCreate = search.trim().length > 0 && !exactMatch;

    function handleSelect(id: number) {
        onSelect(id);
        setOpen(false);
        setSearch("");
    }

    async function handleCreate() {
        await onCreateAndSelect(search.trim());
        setOpen(false);
        setSearch("");
    }

    return (
        <DialogPrimitive.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch(""); }}>
            <DialogPrimitive.Trigger asChild>
                {trigger ?? (
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <PlusIcon size={14} />
                        {t("add_exercise_dialog.trigger")}
                    </Button>
                )}
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background border rounded-lg shadow-lg w-80 p-4 flex flex-col gap-3 focus:outline-none">
                    <div className="flex items-center justify-between">
                        <DialogPrimitive.Title className="text-sm font-semibold">
                            {t("add_exercise_dialog.title")}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                                <X size={16} />
                            </button>
                        </DialogPrimitive.Close>
                    </div>
                    <Input
                        placeholder={t("add_exercise_dialog.search_placeholder")}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                    />
                    <div className="flex flex-col max-h-60 overflow-y-auto -mx-1">
                        {filtered.map(exercise => (
                            <button
                                key={exercise.id}
                                className={cn(
                                    "text-left text-sm px-3 py-1.5 rounded mx-1 hover:bg-muted transition-colors"
                                )}
                                onClick={() => handleSelect(exercise.id)}
                            >
                                {exercise.name}
                            </button>
                        ))}
                        {filtered.length === 0 && !showCreate && (
                            <p className="text-sm text-muted-foreground text-center py-3">
                                {t("add_exercise_dialog.no_exercises")}
                            </p>
                        )}
                        {showCreate && (
                            <button
                                className="text-left text-sm px-3 py-1.5 rounded mx-1 hover:bg-muted transition-colors text-primary flex items-center gap-1.5"
                                onClick={handleCreate}
                            >
                                <PlusIcon size={14} className="shrink-0" />
                                {t("add_exercise_dialog.create", { name: search.trim() })}
                            </button>
                        )}
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export default AddExerciseDialog;
