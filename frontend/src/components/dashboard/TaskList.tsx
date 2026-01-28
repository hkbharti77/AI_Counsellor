"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ui/confirm-modal"

interface Task {
    id: number
    title: string
    description: string
    category: string
    priority: string
    is_completed: boolean
    due_date?: string
}

interface TaskListProps {
    tasks: Task[]
    onTaskUpdate: () => void
}

export function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleToggle = async (task: Task) => {
        setLoadingId(task.id)
        try {
            if (task.is_completed) {
                await api.post(`/tasks/${task.id}/uncomplete`)
            } else {
                await api.post(`/tasks/${task.id}/complete`)
                toast.success("Task completed!")
            }
            onTaskUpdate()
        } catch (error) {
            console.error("Task update error:", error)
            toast.error("Failed to update task")
        } finally {
            setLoadingId(null)
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "bg-destructive/10 text-destructive border-destructive/20"
            case "medium": return "bg-warning/10 text-warning border-warning/20"
            default: return "bg-secondary text-secondary-foreground"
        }
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        // Sort logic: incomplete first, then high priority first
        if (a.is_completed === b.is_completed) {
            if (a.priority === "high" && b.priority !== "high") return -1
            if (a.priority !== "high" && b.priority === "high") return 1
            return 0
        }
        return a.is_completed ? 1 : -1
    })

    const handleDeleteClick = (taskId: number) => {
        setTaskToDelete(taskId)
    }

    const confirmDelete = async () => {
        if (!taskToDelete) return
        try {
            setIsDeleting(true)
            await api.delete(`/tasks/${taskToDelete}`)
            toast.success("Task deleted")
            setTaskToDelete(null)
            onTaskUpdate()
        } catch (error) {
            toast.error("Failed to delete task")
        } finally {
            setIsDeleting(false)
        }
    }

    // ... (keep getPriorityColor and sortedTasks)

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>AI-generated tasks based on your profile</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
                {sortedTasks.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No pending tasks. You're all caught up!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 group ${task.is_completed ? "opacity-60 bg-muted/30" : ""
                                    }`}
                            >
                                <div className="pt-1">
                                    <Checkbox
                                        checked={task.is_completed}
                                        onCheckedChange={() => handleToggle(task)}
                                        disabled={loadingId === task.id}
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-medium text-sm ${task.is_completed ? "line-through text-muted-foreground" : ""}`}>
                                            {task.title}
                                        </p>
                                        {task.priority !== "low" && !task.is_completed && (
                                            <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </Badge>
                                        )}
                                    </div>
                                    {task.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {task.description}
                                        </p>
                                    )}
                                    {task.due_date && (
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteClick(task.id)}
                                >
                                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <ConfirmModal
                isOpen={taskToDelete !== null}
                onClose={() => setTaskToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                variant="destructive"
                confirmText="Delete"
                isLoading={isDeleting}
            />
        </Card>
    )
}
