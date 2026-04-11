import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { WorkoutType } from "@/types";
import { useTranslation } from "react-i18next";
import { useWorkoutTypesStore } from "@/stores/workout-types-store";

interface Props {
    workoutTypes: WorkoutType[];
    onStart: (name?: string, templateId?: number) => void;
}

function StartSessionDialog({ workoutTypes, onStart }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const createWorkoutType = useWorkoutTypesStore(s => s.createWorkoutType);

    function handleTemplate(wt: WorkoutType) {
        onStart(wt.name, wt.id);
        close();
    }

    async function handleBlank() {
        const trimmed = name.trim();
        if (!trimmed) {
            onStart();
            close();
            return;
        }
        const existing = workoutTypes.find(wt => wt.name.toLowerCase() === trimmed.toLowerCase());
        if (existing) {
            onStart(existing.name, existing.id);
        } else {
            const created = await createWorkoutType(trimmed);
            onStart(created.name, created.id);
        }
        close();
    }

    function close() {
        setOpen(false);
        setName("");
    }

    return (
        <DialogPrimitive.Root open={open} onOpenChange={(o) => { setOpen(o); if (!o) setName(""); }}>
            <DialogPrimitive.Trigger asChild>
                <Button>{t("start_session_dialog.trigger")}</Button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background border rounded-lg shadow-lg w-80 p-4 flex flex-col gap-3 focus:outline-none">
                    <div className="flex items-center justify-between">
                        <DialogPrimitive.Title className="text-sm font-semibold">
                            {t("start_session_dialog.title")}
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                                <X size={16} />
                            </button>
                        </DialogPrimitive.Close>
                    </div>

                    {/* Optional custom name */}
                    <Input
                        placeholder={t("start_session_dialog.name_placeholder")}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleBlank(); }}
                        autoFocus
                    />

                    {/* Templates */}
                    {workoutTypes.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground">{t("start_session_dialog.from_template")}</p>
                            <div className="flex flex-col max-h-48 overflow-y-auto -mx-1">
                                {workoutTypes.map(wt => (
                                    <button
                                        key={wt.id}
                                        className="text-left text-sm px-3 py-1.5 rounded mx-1 hover:bg-muted transition-colors"
                                        onClick={() => handleTemplate(wt)}
                                    >
                                        {wt.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button variant="outline" onClick={handleBlank}>
                        {t("start_session_dialog.blank")}
                    </Button>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export default StartSessionDialog;
