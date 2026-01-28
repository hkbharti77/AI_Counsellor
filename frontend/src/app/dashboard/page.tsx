"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { StageIndicator } from "@/components/dashboard/StageIndicator"
import { ProfileSummary } from "@/components/dashboard/ProfileSummary"
import { ProfileStrength } from "@/components/dashboard/ProfileStrength"
import { TaskList } from "@/components/dashboard/TaskList"
import { Button, buttonVariants } from "@/components/ui/button"
import { Loader2, Plus, RefreshCw } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { CreateTaskDialog } from "@/components/dashboard/CreateTaskDialog"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isTaskModalOpen, setTaskModalOpen] = useState(false)

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response = await api.get("/profile/dashboard")
            setData(response.data)
        } catch (error) {
            console.error("Dashboard fetch error:", error)
            toast.error("Failed to load dashboard data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Hi, {user?.full_name?.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Here's where you stand in your study abroad journey.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                    <Button size="sm" onClick={() => setTaskModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Task
                    </Button>
                </div>
            </div>

            <CreateTaskDialog
                open={isTaskModalOpen}
                onOpenChange={setTaskModalOpen}
                onTaskCreated={fetchDashboardData}
            />

            <StageIndicator currentStage={data.user?.current_stage} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Left Column */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="grid gap-6 md:grid-cols-2">
                        <ProfileSummary profile={data.profile} />
                        <ProfileStrength strength={data.profile_strength} />
                    </div>

                    {/* Task List takes up full width of left column */}
                    <div className="h-[350px] md:h-[400px]">
                        <TaskList tasks={data.recent_tasks || []} onTaskUpdate={fetchDashboardData} />
                    </div>
                </div>

                {/* Right Column - Quick Actions / Recommendations Teaser */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2">AI Counsellor</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                I can help you shortlist universities or analyze your profile gaps.
                            </p>
                            <Button
                                className="w-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push("/counsellor")
                                }}
                            >
                                Chat with Counsellor
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2">University Discovery</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Explore Dream, Target, and Safe universities tailored for you.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push("/universities")
                                }}
                            >
                                Explore Universities
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2">Document Vault</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Securely upload and verify your transcripts and application docs.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push("/documents")
                                }}
                            >
                                Manage Documents
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
