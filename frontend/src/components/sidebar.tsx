import { Calendar } from "@/components/ui/calendar";

interface Props {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

function Sidebar({ selectedDate, onDateChange }: Props) {
    return (
        <div className="px-10">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
            />
        </div>
    );
}

export default Sidebar;