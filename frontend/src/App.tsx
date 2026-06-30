import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ManagePage from "@/pages/ManagePage.tsx";
import { StrictMode } from "react";
import { ClerkProvider, useAuth } from "@clerk/react";
import { dark } from "@clerk/themes";
import { deDE, jaJP, enUS } from "@clerk/localizations";
import { useTranslation } from "react-i18next";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();
    if (!isLoaded) return null;
    if (!isSignedIn) return <Navigate to="/" replace />;
    return <>{children}</>;
}

const localeMap: Record<string, typeof enUS> = { de: deDE, ja: jaJP };

const clerkDark = {
    baseTheme: dark,
    variables: {
        colorBackground: "#201c19",
        colorPrimary: "#8c4a22",
        colorText: "#f9f8f6",
        colorTextSecondary: "#a08878",
        colorNeutral: "#a08878",
        colorInputBackground: "#2d2520",
        colorInputText: "#f9f8f6",
    },
    elements: {
        headerTitle: { color: "#f9f8f6" },
        headerSubtitle: { color: "#a08878" },
        formFieldLabel: { color: "#f9f8f6" },
        formFieldHintText: { color: "#a08878" },
        formFieldInput: { backgroundColor: "#2d2520", color: "#f9f8f6", borderColor: "rgba(255,255,255,0.15)" },
        dividerText: { color: "#a08878" },
        footerActionText: { color: "#a08878" },
        footerActionLink: { color: "#c87941" },
        identityPreviewText: { color: "#f9f8f6" },
        alertText: { color: "#f9f8f6" },
        lastAuthenticationStrategyBadge: { color: "#f9f8f6", backgroundColor: "#2d2520" },
        userPreviewMainIdentifier: { color: "#f9f8f6" },
        userPreviewSecondaryIdentifier: { color: "#a08878" },
        userButtonPopoverCard: { backgroundColor: "#201c19" },
        userButtonPopoverActionButtonText: { color: "#f9f8f6" },
        userButtonPopoverActionButtonIcon: { color: "#a08878" },
    },
};

const clerkLight = {
    variables: { colorBackground: "#eceae4", colorPrimary: "#c06a2e" },
};

function ClerkWithConfig({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const { i18n } = useTranslation();
    return (
        <ClerkProvider
            publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            appearance={theme === "dark" ? clerkDark : clerkLight}
            localization={localeMap[i18n.language] ?? enUS}
        >
            {children}
        </ClerkProvider>
    );
}

function App() {
    return (
        <StrictMode>
            <ThemeProvider defaultTheme="dark" storageKey="liftlog-theme">
                <ClerkWithConfig>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/app" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                            <Route path="/app/manage" element={<ProtectedRoute><ManagePage /></ProtectedRoute>} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster richColors />
                </ClerkWithConfig>
            </ThemeProvider>
        </StrictMode>
    );
}

export default App;
