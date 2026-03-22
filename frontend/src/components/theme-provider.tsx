import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    toggle: () => void
}

const initialState: ThemeProviderState = {
    theme: "dark",
    toggle: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
                                  children,
                                  defaultTheme = "dark",
                                  storageKey = "liftlog-theme",
                                  ...props
                              }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
    }, [theme])

    const toggle = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
    }

    return (
        <ThemeProviderContext.Provider {...props} value={{ theme, toggle }}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")
    return context
}
