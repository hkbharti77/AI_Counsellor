"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import {
    GraduationCap,
    Globe2,
    Heart,
    Sparkles,
    Compass,
    LayoutDashboard,
    X,
    LogOut,
    FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    user: any
}

export function Sidebar({ isOpen, setIsOpen, user }: SidebarProps) {
    const pathname = usePathname()
    const { logout } = useAuth()

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Discovery", href: "/universities", icon: Globe2 },
        { name: "Shortlist", href: "/shortlist", icon: Heart },
        { name: "Documents", href: "/documents", icon: FileText },
        { name: "AI Counsellor", href: "/counsellor", icon: Sparkles },
        { name: "Guidance", href: "/guidance", icon: Compass },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
                    isOpen ? "block" : "hidden"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 border-r bg-[#0b1120] text-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-20 items-center justify-between px-6 pt-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">AI Counsellor</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-muted-foreground hover:text-white hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                <div className="flex-1 flex flex-col gap-2 p-4 mt-4 overflow-y-auto no-scrollbar">
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Main Menu
                    </div>
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href || pathname.startsWith(link.href) && link.href !== "/dashboard"
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                {link.name}
                            </Link>
                        )
                    })}
                </div>

                <div className="flex flex-col gap-2 p-4 pb-6 bg-[#0b1120]">
                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        System
                    </div>

                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut className="h-5 w-5" />
                        Log Out
                    </button>

                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-xl p-3 bg-slate-900/50 hover:bg-slate-900 transition-colors border border-slate-800 group"
                        >
                            <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {user?.full_name?.substring(0, 2).toUpperCase() || "JS"}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                                    {user?.full_name || "John Student"}
                                </span>
                                <span className="truncate text-xs text-slate-400">Premium Plan</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
