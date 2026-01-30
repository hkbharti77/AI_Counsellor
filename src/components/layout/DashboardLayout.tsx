"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { Loader2 } from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login")
        }
    }, [loading, isAuthenticated, router])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-muted/20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!isAuthenticated) return null

    return (
        <div className="flex min-h-screen bg-muted/20">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />

            <div className="flex flex-1 flex-col">
                <Topbar onMenuClick={() => setSidebarOpen(true)} user={user} />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
