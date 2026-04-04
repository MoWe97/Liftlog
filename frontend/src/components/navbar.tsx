import { Switch } from "@/components/ui/switch.tsx";
import { useTheme } from "@/components/theme-provider.tsx";
import { LanguagesIcon, Moon, Settings2, Sun } from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { t, i18n } = useTranslation();
    const { theme, toggle } = useTheme();
    const navigate = useNavigate();

    return (
        <>
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

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => navigate("/manage")}
                    >
                        <Settings2 size={18} />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="text-muted-foreground" variant="ghost" size="icon">
                                <LanguagesIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>{t("navbar.lang_select")}</DropdownMenuLabel>
                                <DropdownMenuRadioGroup
                                    value={i18n.language}
                                    onValueChange={i18n.changeLanguage}
                                >
                                    <DropdownMenuRadioItem value="de">Deutsch</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="ja">日本語</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-2">
                        <Sun size={14} className="text-muted-foreground" />
                        <Switch checked={theme === "dark"} onCheckedChange={toggle} />
                        <Moon size={14} className="text-muted-foreground" />
                    </div>
                </div>
            </nav>

        </>
    );
}

export default Navbar;
