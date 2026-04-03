import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon, X } from "lucide-react";
import type { WorkoutType } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
    workoutTypes: WorkoutType[];
    onSelect: (workoutType: WorkoutType) => void;
    onCreateAndSelect: (name: string) => Promise<void>;
}

function StartSessionDialog({ workoutTypes, onSelect, onCreateAndSelect }: Props) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = workoutTypes.filter(wt =>
        wt.name.toLowerCase().includes(search.toLowerCase())
    );
    const exactMatch = workoutTypes.some(wt =>
        wt.name.toLowerCase() === search.trim().toLowerCase()
    );
    const showCreate = search.trim().length > 0 && !exactMatch;

    function handleSelect(workoutType: WorkoutType) {
        onSelect(workoutType);
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
                <Button>New session</Button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <DialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background border rounded-lg shadow-lg w-80 p-4 flex flex-col gap-3 focus:outline-none">
                    <div className="flex items-center justify-between">
                        <DialogPrimitive.Title className="text-sm font-semibold">New Session</DialogPrimitive.Title>
                        <DialogPrimitive.Close asChild>
                            <button className="text-muted-foreground hover:text-foreground">
                                <X size={16} />
                            </button>
                        </DialogPrimitive.Close>
                    </div>
                    <Input
                        placeholder="Search or create..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                    />
                    <div className="flex flex-col max-h-60 overflow-y-auto -mx-1">
                        {filtered.map(wt => (
                            <button
                                key={wt.id}
                                className={cn(
                                    "text-left text-sm px-3 py-1.5 rounded mx-1 hover:bg-muted transition-colors"
                                )}
                                onClick={() => handleSelect(wt)}
                            >
                                {wt.name}
                            </button>
                        ))}
                        {filtered.length === 0 && !showCreate && (
                            <p className="text-sm text-muted-foreground text-center py-3">No workout types found</p>
                        )}
                        {showCreate && (
                            <button
                                className="text-left text-sm px-3 py-1.5 rounded mx-1 hover:bg-muted transition-colors text-primary flex items-center gap-1.5"
                                onClick={handleCreate}
                            >
                                <PlusIcon size={14} className="shrink-0" />
                                Create "{search.trim()}"
                            </button>
                        )}
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export default StartSessionDialog;
