import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="inline-flex items-center justify-center p-2 rounded-full text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 dark:text-zinc-400" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-zinc-400 dark:text-emerald-400" />
        </button>
    )
}
