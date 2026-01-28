"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StageIndicatorProps {
    currentStage: number
}

export function StageIndicator({ currentStage }: StageIndicatorProps) {
    const stages = [
        { id: 1, name: "Building Profile" },
        { id: 2, name: "Discovering Universities" },
        { id: 3, name: "Finalizing Universities" },
        { id: 4, name: "Preparing Applications" },
    ]

    const progress = Math.min(((currentStage - 1) / (stages.length - 1)) * 100, 100)

    return (
        <Card className="col-span-full border-0 shadow-sm">
            <CardHeader className="pb-8">
                <CardTitle className="text-xl font-bold">Your Journey</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto pb-6 -mx-4 px-4 scrollbar-none">
                    <div className="relative min-w-[600px] mx-4">
                        {/* Background Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-[3px] bg-slate-200" />

                        {/* Active Progress Line */}
                        <div
                            className="absolute top-5 left-0 h-[3px] bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />

                        <div className="flex justify-between relative">
                            {stages.map((stage) => {
                                const isCompleted = currentStage > stage.id
                                const isCurrent = currentStage === stage.id
                                const isFuture = currentStage < stage.id

                                return (
                                    <div key={stage.id} className="flex flex-col items-center gap-4">
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 z-10",
                                                isCompleted ? "bg-[#16a34a] text-white shadow-md shadow-green-900/10" :
                                                    isCurrent ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110" :
                                                        "bg-white border-2 border-slate-200 text-slate-400"
                                            )}
                                        >
                                            {isCompleted ? <Check className="h-5 w-5 stroke-[3]" /> : stage.id}
                                        </div>

                                        <div className="flex flex-col items-center text-center max-w-[120px]">
                                            <span className={cn(
                                                "text-sm font-semibold transition-colors duration-300",
                                                isCurrent ? "text-slate-900" : "text-slate-500"
                                            )}>
                                                {stage.name}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
