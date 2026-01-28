"use client"

import { Bell, Search, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"

interface TopbarProps {
    onMenuClick: () => void
    user?: any
}

export function Topbar({ onMenuClick, user }: TopbarProps) {
    const { setTheme, theme, resolvedTheme } = useTheme()
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                <div className="hidden md:flex md:w-80 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full pl-9 bg-muted/40 focus-visible:bg-background"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
                </Button>
            </div>
        </header>
    )
}
