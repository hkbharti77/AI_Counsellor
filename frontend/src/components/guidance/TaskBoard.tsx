"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FileText, GraduationCap, PenTool } from "lucide-react"

interface Task {
    id: number
    title: string
    description: string
    category: string
    priority: string
    is_completed: boolean
}

interface TaskBoardProps {
    tasks: Task[]
    onToggleTask: (taskId: number, completed: boolean) => void
}

export function TaskBoard({ tasks, onToggleTask }: TaskBoardProps) {
    const categories = [
        { id: "document", label: "Documents", icon: FileText },
        { id: "application", label: "Application Form", icon: PenTool },
        { id: "exam", label: "Exams", icon: GraduationCap },
        { id: "general", label: "General", icon: CircleIcon },
    ]

    const groupedTasks = categories.map(cat => ({
        ...cat,
        items: tasks.filter(t => t.category === cat.id || (cat.id === "general" && !["document", "application", "exam"].includes(t.category)))
    })).filter(g => g.items.length > 0)

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {groupedTasks.map(group => (
                <Card key={group.id} className="h-full">
                    <CardHeader className="pb-3 flex flex-row items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <group.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{group.label}</CardTitle>
                        <Badge variant="secondary" className="ml-auto">{group.items.length}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {group.items.map(task => (
                            <div key={task.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                                <Checkbox
                                    checked={task.is_completed}
                                    onCheckedChange={(checked) => onToggleTask(task.id, checked as boolean)}
                                    className="mt-1"
                                />
                                <div className="space-y-1">
                                    <label
                                        className={cn(
                                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                            task.is_completed && "line-through text-muted-foreground"
                                        )}
                                        onClick={() => onToggleTask(task.id, !task.is_completed)}
                                    >
                                        {task.title}
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        {task.description}
                                    </p>
                                    {task.priority === "high" && !task.is_completed && (
                                        <Badge variant="destructive" className="text-[10px] h-5 px-1.5 py-0">High Priority</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function CircleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
        </svg>
    )
}
