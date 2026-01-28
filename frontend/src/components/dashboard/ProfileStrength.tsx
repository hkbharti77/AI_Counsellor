"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, AlertCircle } from "lucide-react"

interface ProfileStrengthProps {
    strength: {
        academics: "strong" | "average" | "weak"
        exams: "not_started" | "in_progress" | "completed"
        sop: "not_started" | "draft" | "ready"
        overall_score: number
    }
}

export function ProfileStrength({ strength }: ProfileStrengthProps) {
    if (!strength) return null

    const getStatusColor = (status: string) => {
        switch (status) {
            case "strong":
            case "completed":
            case "ready":
                return "text-success"
            case "average":
            case "in_progress":
            case "draft":
                return "text-warning"
            default:
                return "text-destructive"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "strong":
            case "completed":
            case "ready":
                return <CheckCircle2 className="h-4 w-4 text-success" />
            case "average":
            case "in_progress":
            case "draft":
                return <AlertCircle className="h-4 w-4 text-warning" />
            default:
                return <Circle className="h-4 w-4 text-muted-foreground" />
        }
    }

    const formatStatus = (status: string) => {
        return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Overall Score</span>
                        <span>{strength.overall_score}%</span>
                    </div>
                    <Progress value={strength.overall_score} className="h-2" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Academics</span>
                        <div className="flex items-center gap-2">
                            <span className={`font-medium ${getStatusColor(strength.academics)}`}>
                                {formatStatus(strength.academics)}
                            </span>
                            {getStatusIcon(strength.academics)}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Exams Reliability</span>
                        <div className="flex items-center gap-2">
                            <span className={`font-medium ${getStatusColor(strength.exams)}`}>
                                {formatStatus(strength.exams)}
                            </span>
                            {getStatusIcon(strength.exams)}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">SOP Status</span>
                        <div className="flex items-center gap-2">
                            <span className={`font-medium ${getStatusColor(strength.sop)}`}>
                                {formatStatus(strength.sop)}
                            </span>
                            {getStatusIcon(strength.sop)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
