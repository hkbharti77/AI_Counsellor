
"use client"

import { useState, useEffect } from "react"
import { Timeline } from "@/components/guidance/Timeline"
import { TaskBoard } from "@/components/guidance/TaskBoard"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck, Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/dashboard/CreateTaskDialog"
import api from "@/lib/api"
import { toast } from "sonner"

export default function GuidancePage() {
    const [university, setUniversity] = useState<any>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isTaskModalOpen, setTaskModalOpen] = useState(false)

    const fetchData = async () => {
        try {
            setLoading(true)
            // 1. Get locked university
            const shortRes = await api.get("/universities/shortlist")
            const locked = shortRes.data.find((u: any) => u.is_locked)

            if (locked) {
                setUniversity({ ...locked.university, locked_at: locked.locked_at })
            }

            // 2. Get ALL tasks (General + University)
            // API likely returns all tasks for user if no filters, or we can filter relevant ones
            // Actually users want to see all their tasks here.
            const tasksRes = await api.get("/tasks/")
            setTasks(tasksRes.data)

        } catch (error) {
            console.error("Guidance fetch error:", error)
            toast.error("Failed to load guidance data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleTaskToggle = async (taskId: number, completed: boolean) => {
        try {
            // Optimistic update
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, is_completed: completed } : t))

            const action = completed ? "complete" : "uncomplete"
            await api.post(`/tasks/${taskId}/${action}`)

            if (completed) {
                toast.success("Task completed!")
            }
        } catch (error) {
            toast.error("Failed to update task")
            fetchData() // Revert on error
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const steps = university ? [
        { label: "Profile", status: "completed" as const },
        { label: "Shortlist", status: "completed" as const },
        { label: "Locked", status: "completed" as const, date: new Date(university.locked_at).toLocaleDateString() },
        { label: "Documents", status: "current" as const },
        { label: "Application", status: "pending" as const },
        { label: "Admission", status: "pending" as const },
    ] : []

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Guidance & Tasks</h1>
                <Button onClick={() => setTaskModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </div>

            {/* Header Section - Only if University Locked */}
            {university ? (
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-medium mb-1">
                            <ShieldCheck className="h-5 w-5" />
                            <span>Committed Choice</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">{university.name}</h1>
                        <p className="text-muted-foreground">
                            {university.city}, {university.country}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-sm font-medium">Application Deadline</div>
                        <div className="text-2xl font-bold text-orange-600">
                            {new Date(university.application_deadline).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-muted/30 p-6 rounded-2xl border text-center">
                    <h3 className="text-lg font-semibold mb-2">No University Locked Yet</h3>
                    <p className="text-muted-foreground text-sm">
                        Lock a university in your Shortlist to get a personalized application timeline.
                    </p>
                </div>
            )}

            {/* Timeline - Only if University Locked */}
            {university && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Application Timeline</h3>
                    <Timeline steps={steps} />
                </div>
            )}

            {/* Task Board - Always Visible */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Action Items</h3>
                    <div className="text-sm text-muted-foreground">
                        {tasks.filter(t => t.is_completed).length}/{tasks.length} Completed
                    </div>
                </div>
                {tasks.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">No tasks found. Create one to get started!</p>
                        <Button variant="outline" onClick={() => setTaskModalOpen(true)}>Create Task</Button>
                    </div>
                ) : (
                    <TaskBoard tasks={tasks} onToggleTask={handleTaskToggle} />
                )}
            </div>

            <CreateTaskDialog
                open={isTaskModalOpen}
                onOpenChange={setTaskModalOpen}
                onTaskCreated={fetchData}
            />
        </div>
    )
}
