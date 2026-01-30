"use client"

import { useState } from "react"
import { OnboardingForm } from "@/components/onboarding/OnboardingForm"
import { VoiceOnboarding } from "@/components/onboarding/VoiceOnboarding"
import { GraduationCap } from "lucide-react"

export default function OnboardingPage() {
    const [mode, setMode] = useState<"form" | "voice">("form")

    return (
        <div className="min-h-screen bg-muted/20 py-10 px-4">
            <div className="container max-w-3xl mx-auto space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="flex items-center gap-2 font-bold text-2xl text-primary">
                        <GraduationCap className="h-8 w-8" />
                        <span>AI Counsellor</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Let's Build Your Profile</h1>
                    <p className="text-muted-foreground max-w-lg">
                        We need to understand your academic background and goals to provide personalized recommendations.
                    </p>
                </div>

                <div className="flex justify-center">
                    {mode === "form" ? (
                        <OnboardingForm onSwitchToVoice={() => setMode("voice")} />
                    ) : (
                        <VoiceOnboarding onSwitchToForm={() => setMode("form")} />
                    )}
                </div>
            </div>
        </div>
    )
}
