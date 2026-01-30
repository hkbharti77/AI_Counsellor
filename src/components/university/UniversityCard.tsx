"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Star, AlertTriangle, CheckCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface University {
    id: number
    name: string
    country: string
    city: string
    ranking: number
    tuition_min: number
    tuition_max: number
    acceptance_rate: number
    programs?: string
    match_score?: number
    category?: "dream" | "target" | "safe"
    fit_reason?: string
    risk_factors?: string
    is_shortlisted?: boolean
    is_locked?: boolean
}

interface UniversityCardProps {
    university: University
    onShortlist: (id: number) => void
    onLock?: (id: number) => void
}

export function UniversityCard({ university, onShortlist, onLock }: UniversityCardProps) {
    const getCategoryColor = (category?: string) => {
        switch (category) {
            case "dream": return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100"
            case "target": return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100"
            case "safe": return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
            default: return "bg-secondary text-secondary-foreground"
        }
    }

    const getAcceptanceLevel = (rate: number) => {
        if (rate < 20) return { label: "Low Chance", color: "text-red-500" }
        if (rate < 50) return { label: "Medium Chance", color: "text-yellow-500" }
        return { label: "High Chance", color: "text-green-500" }
    }

    const acceptance = getAcceptanceLevel(university.acceptance_rate)

    return (
        <Card className={cn(
            "flex flex-col h-full transition-all hover:shadow-md",
            university.is_locked ? "border-2 border-primary bg-primary/5" : ""
        )}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        {university.category && (
                            <Badge className={cn("mb-2 capitalize border", getCategoryColor(university.category))}>
                                {university.category}
                            </Badge>
                        )}
                        <h3 className="font-bold text-lg leading-tight">{university.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {university.city}, {university.country}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-xs font-medium bg-secondary px-2 py-1 rounded">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            #{university.ranking}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground mb-1">Tuition / Year</span>
                        <span className="font-semibold text-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {(university.tuition_min / 1000).toFixed(0)}k - {(university.tuition_max / 1000).toFixed(0)}k
                        </span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-muted-foreground mb-1">Acceptance</span>
                        <span className={cn("font-semibold", acceptance.color)}>
                            {university.acceptance_rate}%
                        </span>
                    </div>

                    {/* Programs Section */}
                    {university.programs && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {(() => {
                                try {
                                    const parsedPrograms = JSON.parse(university.programs)
                                    if (Array.isArray(parsedPrograms)) {
                                        return parsedPrograms.slice(0, 3).map((prog: string, i: number) => (
                                            <div key={i} className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded border">
                                                {prog}
                                            </div>
                                        ))
                                    }
                                    return null
                                } catch (e) {
                                    return null
                                }
                            })()}
                            {(() => {
                                try {
                                    const parsed = JSON.parse(university.programs)
                                    if (parsed.length > 3) {
                                        return <div className="text-[10px] px-1.5 py-0.5 text-muted-foreground">+{parsed.length - 3}</div>
                                    }
                                } catch (e) { }
                            })()}
                        </div>
                    )}
                </div>

                {/* AI Analysis Section */}
                {(university.fit_reason || university.risk_factors) && (
                    <div className="space-y-2 text-sm pt-2 border-t">
                        {university.fit_reason && (
                            <div className="flex gap-2 items-start">
                                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{university.fit_reason}</span>
                            </div>
                        )}
                        {university.risk_factors && (
                            <div className="flex gap-2 items-start">
                                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{university.risk_factors}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 gap-2">
                {university.is_locked ? (
                    <Button className="w-full" variant="secondary" disabled>
                        <Lock className="mr-2 h-4 w-4" /> Locked Choice
                    </Button>
                ) : (
                    <>
                        <Button
                            variant={university.is_shortlisted ? "outline" : "default"}
                            className={cn("flex-1", university.is_shortlisted ? "text-primary border-primary hover:bg-primary/5" : "")}
                            onClick={() => onShortlist(university.id)}
                            disabled={university.is_shortlisted}
                        >
                            {university.is_shortlisted ? "Shortlisted" : "Shortlist"}
                        </Button>
                        {university.is_shortlisted && onLock && (
                            <Button variant="default" className="flex-1 bg-gradient-to-r from-primary to-blue-600" onClick={() => onLock(university.id)}>
                                <Lock className="mr-2 h-4 w-4" /> Lock
                            </Button>
                        )}
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
