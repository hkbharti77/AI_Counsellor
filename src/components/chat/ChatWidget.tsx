"use client"

import { useState } from "react"
import { ChatInterface } from "./ChatInterface"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const { isAuthenticated } = useAuth()
    const pathname = usePathname()

    if (!isAuthenticated) return null
    if (pathname === "/counsellor") return null

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Box */}
            <div
                className={cn(
                    "transition-all duration-300 ease-out origin-bottom-right",
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-4 pointer-events-none"
                )}
            >
                <div className="w-[380px] h-[600px] max-h-[85vh] max-w-[95vw] shadow-2xl rounded-2xl border bg-background overflow-hidden relative">
                    <div className="absolute top-3 right-3 z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <ChatInterface className="h-full border-0 rounded-none" />
                </div>
            </div>

            {/* Toggle Button */}
            <Button
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-105",
                    isOpen ? "rotate-90 bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary/90"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="h-7 w-7" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                    </div>
                )}
            </Button>
        </div>
    )
}
