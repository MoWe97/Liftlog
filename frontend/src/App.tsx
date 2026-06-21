import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ManagePage from "@/pages/ManagePage.tsx";
import { StrictMode } from "react";
import { ClerkProvider, useAuth } from "@clerk/react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isSignedIn, isLoaded } = useAuth();
    if (!isLoaded) return null;
    if (!isSignedIn) return <Navigate to="/" replace />;
    return <>{children}</>;
}

function App() {
    return (
        <StrictMode>
            <ClerkProvider>
                <ThemeProvider defaultTheme="dark" storageKey="liftlog-theme">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/app" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                            <Route path="/app/manage" element={<ProtectedRoute><ManagePage /></ProtectedRoute>} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster richColors />
                </ThemeProvider>
            </ClerkProvider>
        </StrictMode>
    );
}

export default App;
