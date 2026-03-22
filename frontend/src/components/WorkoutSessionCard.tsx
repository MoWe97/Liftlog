import type {WorkoutSession} from "../types";

interface Props {
    session: WorkoutSession;
}

function WorkoutSessionCard({ session }: Props) {
    return (
        <div>
            <p>{session.date}</p>
        </div>
    );
}

export default WorkoutSessionCard;