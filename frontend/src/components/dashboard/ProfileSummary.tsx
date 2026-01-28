"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, BookOpen } from "lucide-react"

interface ProfileSummaryProps {
    profile: any
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
    if (!profile) return null

    const items = [
        {
            label: "Target Degree",
            value: `${profile.intended_degree === 'masters' ? "Master's" : profile.intended_degree === 'bachelors' ? "Bachelor's" : profile.intended_degree} in ${profile.field_of_study}`,
            icon: BookOpen,
        },
        {
            label: "Target Intake",
            value: profile.target_intake?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            icon: Calendar,
        },
        {
            label: "Preferred Countries",
            value: (() => {
                try {
                    return JSON.parse(profile.preferred_countries).join(", ")
                } catch {
                    return "Not selected"
                }
            })(),
            icon: MapPin,
        },
        {
            label: "Budget Range",
            value: `$${profile.budget_min?.toLocaleString()} - $${profile.budget_max?.toLocaleString()}`,
            icon: DollarSign,
        },
    ]

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <item.icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none text-muted-foreground">{item.label}</p>
                            <p className="text-sm font-semibold">{item.value}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
