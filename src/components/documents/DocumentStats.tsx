"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileCheck, AlertCircle, Clock } from "lucide-react"

interface DocumentStatsProps {
    total: number
    verified: number
    pending: number
    missing: number
}

export function DocumentStats({ total, verified, pending, missing }: DocumentStatsProps) {
    const verifiedPercent = Math.round((verified / total) * 100) || 0

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card className="md:col-span-1 bg-primary text-primary-foreground border-none overflow-hidden relative">
                <div className="absolute right-0 top-0 h-32 w-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                    <div>
                        <p className="text-primary-foreground/80 font-medium text-sm">Readiness</p>
                        <h3 className="text-4xl font-bold mt-2">{verifiedPercent}%</h3>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: `${verifiedPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-primary-foreground/70 mt-2">{verified} of {total} verified</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Verified</p>
                        <h3 className="text-2xl font-bold">{verified}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                        <h3 className="text-2xl font-bold">{pending}</h3>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Missing</p>
                        <h3 className="text-2xl font-bold">{missing}</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
