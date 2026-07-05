import { Link } from "react-router-dom";
import { LanguagesIcon, Moon, Sun } from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function PublicNavbar() {
    const { t, i18n } = useTranslation();
    const { theme, toggle } = useTheme();

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <Link
                to="/"
                className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-orange-300 bg-clip-text text-transparent"
            >
                LiftLog
            </Link>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Sun size={14} className="text-muted-foreground" />
                    <Switch checked={theme === "dark"} onCheckedChange={toggle} />
                    <Moon size={14} className="text-muted-foreground" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="text-muted-foreground" variant="ghost" size="icon">
                            <LanguagesIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>{t("navbar.lang_select")}</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={i18n.language} onValueChange={i18n.changeLanguage}>
                                <DropdownMenuRadioItem value="de">Deutsch</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="ja">日本語</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <a
                    href="https://github.com/MoWe97/liftlog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <GithubLogoIcon size={20} />
                </a>
            </div>
        </nav>
    );
}

export default PublicNavbar;
