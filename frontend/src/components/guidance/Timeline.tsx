import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
    label: string
    status: "completed" | "current" | "pending"
    date?: string
}

interface TimelineProps {
    steps: Step[]
}

export function Timeline({ steps }: TimelineProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative">
                {/* Connecting Line - Background */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-muted -z-10" />

                {steps.map((step, idx) => {
                    const isLast = idx === steps.length - 1

                    return (
                        <div key={idx} className="flex flex-col items-center bg-background px-2 relative z-10 min-w-[100px]">
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors mb-2",
                                step.status === "completed" ? "bg-primary border-primary text-primary-foreground" :
                                    step.status === "current" ? "bg-background border-primary text-primary" :
                                        "bg-muted border-muted-foreground/30 text-muted-foreground"
                            )}>
                                {step.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> :
                                    step.status === "current" ? <div className="h-3 w-3 rounded-full bg-primary animate-pulse" /> :
                                        <Circle className="h-5 w-5" />}
                            </div>

                            <span className={cn(
                                "text-sm font-medium text-center",
                                step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                            )}>
                                {step.label}
                            </span>

                            {step.date && (
                                <span className="text-xs text-muted-foreground mt-0.5">{step.date}</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
