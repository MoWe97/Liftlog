import type { WorkoutSession } from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {useSessionStore} from "@/stores/workout-session-store.ts";

interface Props {
    session: WorkoutSession;
}

function WorkoutSessionCard({ session }: Props) {
    const { deleteSession } = useSessionStore();
    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex flex-1 p-6 flex-col gap-4">
                <Card className="px-5">
                    <CardHeader>
                        <CardTitle>{session.date}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Workout Type: {session.workout_type_id}</p>
                        <Button variant="ghost" onClick={() => deleteSession(session.id)}>
                            Delete
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden flex-1 p-2 flex-col gap-4">
                <Card className="px-5">
                    <CardHeader>
                        <CardTitle>{session.workout_type?.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Workout Type: {session.workout_type_id}</p>
                        <Button variant="ghost" onClick={() => deleteSession(session.id)}>
                            Delete
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default WorkoutSessionCard;
