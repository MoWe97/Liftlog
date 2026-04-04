import { Popover as PopoverPrimitive } from "radix-ui";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useTranslation } from "react-i18next";

interface Props {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

function DateNavigator({ selectedDate, onDateChange }: Props) {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);

    function shiftDay(delta: number) {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + delta);
        onDateChange(next);
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => shiftDay(-1)}
                className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
                <ChevronLeft size={20} />
            </button>

            <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
                <PopoverPrimitive.Trigger asChild>
                    <button className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
                        {selectedDate.toLocaleDateString(i18n.language, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                        })}
                    </button>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        sideOffset={8}
                        className="z-50 bg-background border rounded-lg shadow-lg p-2"
                    >
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) {
                                    onDateChange(date);
                                    setOpen(false);
                                }
                            }}
                        />
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>

            <button
                onClick={() => shiftDay(1)}
                className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}

export default DateNavigator;
