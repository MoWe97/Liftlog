import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections: { title: string; body: string }[] = [
    {
        title: "1. The Service",
        body: "LiftLog is a personal workout tracking tool that lets you log training sessions, exercises, and sets. It is provided for personal, non-commercial use.",
    },
    {
        title: "2. Not Medical or Fitness Advice",
        body: "LiftLog does not provide medical, health, or fitness advice. Any exercises, weights, or routines you log are entered at your own discretion. Consult a qualified professional before starting or changing a training program. You are solely responsible for how you train and for any injury or harm that may result from your training.",
    },
    {
        title: "3. Accounts",
        body: "You sign in using a third-party authentication provider (Google, via Clerk). You are responsible for keeping your account credentials secure and for all activity that occurs under your account.",
    },
    {
        title: "4. Your Data",
        body: "You retain ownership of the workout data you enter into LiftLog. You may delete your account and associated data at any time by contacting us at the address below.",
    },
    {
        title: "5. Acceptable Use",
        body: "You agree not to misuse the Service, attempt to access another user's data, disrupt or interfere with the Service, or use it for any unlawful purpose.",
    },
    {
        title: "6. Service Provided “As Is”",
        body: "LiftLog is provided on an “as is” and “as available” basis, without warranties of any kind, express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that data will never be lost. Please do not rely on LiftLog as your only record of important information.",
    },
    {
        title: "7. Limitation of Liability",
        body: "To the maximum extent permitted by law, LiftLog and its operator shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to personal injury, loss of data, or loss of profits.",
    },
    {
        title: "8. Termination",
        body: "You may stop using the Service and delete your account at any time. We may suspend or terminate accounts that violate these Terms.",
    },
    {
        title: "9. Changes to These Terms",
        body: "We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.",
    },
    {
        title: "10. Contact",
        body: "Questions about these Terms? Contact us at emdobbleu@gmail.com.",
    },
];

function TermsOfServicePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft size={16} />
                    Back to home
                </button>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-sm text-muted-foreground">Last updated: July 5, 2026</p>
                    <p className="text-sm text-muted-foreground pt-2">
                        Welcome to LiftLog. By creating an account or using LiftLog (&quot;the Service&quot;), you
                        agree to these Terms of Service. If you do not agree, please do not use the Service.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {sections.map(({ title, body }) => (
                        <section key={title} className="flex flex-col gap-1.5">
                            <h2 className="text-base font-semibold">{title}</h2>
                            <p className="text-sm text-muted-foreground">{body}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TermsOfServicePage;
