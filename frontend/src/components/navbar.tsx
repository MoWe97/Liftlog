import {Switch} from "@/components/ui/switch.tsx";
import {useTheme} from "@/components/theme-provider.tsx";
import {Moon, Sun} from "lucide-react";
import {GithubLogoIcon} from "@phosphor-icons/react/ssr";

function Navbar() {
    const {theme, toggle} = useTheme()
    return (
        <nav className="flex items-center justify-between px-6 py-3 border-b border-white/10 backdrop-blur-md bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-orange-300 bg-clip-text text-transparent">
          LiftLog
        </span>
            </div>

            <div className="flex items-center gap-4">
                <a
                href="https://github.com/MoWe97/liftlog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                >
                <GithubLogoIcon size={18} />
            </a>

            <div className="flex items-center gap-2">
                <Sun size={14} className="text-muted-foreground" />
                <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggle}
                />
                <Moon size={14} className="text-muted-foreground" />
            </div>
        </div>
</nav>
);
}

export default Navbar
