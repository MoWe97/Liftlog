import { useState } from "react";
import { Link } from "react-router-dom";
import { useClerk, useUser } from "@clerk/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import PublicNavbar from "@/components/public-navbar";

function TermsGate() {
    const { t } = useTranslation();
    const { user } = useUser();
    const { signOut } = useClerk();
    const [agreed, setAgreed] = useState(false);
    const [saving, setSaving] = useState(false);

    async function handleContinue() {
        if (!user) return;
        setSaving(true);
        await user.update({
            unsafeMetadata: { ...user.unsafeMetadata, termsAcceptedAt: new Date().toISOString() },
        });
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <PublicNavbar />
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center gap-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {t("terms_gate.heading")}
                </h1>
                <p className="text-muted-foreground max-w-md">
                    {t("terms_gate.description")}
                </p>
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <Checkbox checked={agreed} onCheckedChange={checked => setAgreed(checked === true)} />
                    <span>
                        {t("landing_page.agree_to")}{" "}
                        <Link to="/terms" onClick={e => e.stopPropagation()} className="underline hover:text-foreground">
                            {t("landing_page.terms")}
                        </Link>{" "}
                        {t("landing_page.and")}{" "}
                        <Link to="/privacy" onClick={e => e.stopPropagation()} className="underline hover:text-foreground">
                            {t("landing_page.privacy")}
                        </Link>{" "}
                        {t("landing_page.agree_suffix")}
                    </span>
                </label>
                <div className="flex items-center gap-4">
                    <Button onClick={handleContinue} disabled={!agreed || saving}>
                        {t("terms_gate.continue")}
                    </Button>
                    <button
                        onClick={() => signOut()}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t("terms_gate.sign_out")}
                    </button>
                </div>
            </main>
        </div>
    );
}

export default TermsGate;
