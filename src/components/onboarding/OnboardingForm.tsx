"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Note: We need to implement Select component or use native select for now to save time
// Let's use native select for speed if complex components aren't ready
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface OnboardingData {
    // Academic
    education_level: string
    degree: string
    major: string
    graduation_year: string
    gpa: string

    // Goals
    intended_degree: string
    field_of_study: string
    target_intake: string
    preferred_countries: string[]

    // Budget
    budget_min: string
    budget_max: string
    funding_type: string

    // Exams
    ielts_status: string
    ielts_score: string
    gre_status: string
    gre_score: string
    sop_status: string
}

const INITIAL_DATA: OnboardingData = {
    education_level: "",
    degree: "",
    major: "",
    graduation_year: "",
    gpa: "",
    intended_degree: "",
    field_of_study: "",
    target_intake: "",
    preferred_countries: [],
    budget_min: "",
    budget_max: "",
    funding_type: "self_funded",
    ielts_status: "not_started",
    ielts_score: "",
    gre_status: "not_started",
    gre_score: "",
    sop_status: "not_started",
}

interface OnboardingFormProps {
    onSwitchToVoice: () => void
}

export function OnboardingForm({ onSwitchToVoice }: OnboardingFormProps) {
    const [step, setStep] = useState(1)
    const [data, setData] = useState<OnboardingData>(INITIAL_DATA)
    const [isLoading, setIsLoading] = useState(false)
    const { refreshUser } = useAuth()
    const router = useRouter()

    const updateData = (updates: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...updates }))
    }

    const handleNext = () => setStep(prev => prev + 1)
    const handleBack = () => setStep(prev => prev - 1)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            // Format data for API
            const profileData = {
                ...data,
                graduation_year: parseInt(data.graduation_year) || null,
                gpa: parseFloat(data.gpa) || null,
                budget_min: parseInt(data.budget_min) || null,
                budget_max: parseInt(data.budget_max) || null,
                ielts_score: parseFloat(data.ielts_score) || null,
                gre_score: parseInt(data.gre_score) || null,
                preferred_countries: JSON.stringify(data.preferred_countries)
            }

            await api.post("/profile/onboarding/complete", { profile: profileData })
            await refreshUser()
            toast.success("Profile created successfully!")
            router.push("/dashboard")
        } catch (error) {
            console.error("Onboarding error:", error)
            toast.error("Failed to save profile. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const toggleCountry = (country: string) => {
        const current = data.preferred_countries
        if (current.includes(country)) {
            updateData({ preferred_countries: current.filter(c => c !== country) })
        } else {
            updateData({ preferred_countries: [...current, country] })
        }
    }

    const renderStep1 = () => (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label>Current Education Level</Label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={data.education_level}
                    onChange={(e) => updateData({ education_level: e.target.value })}
                >
                    <option value="">Select Level</option>
                    <option value="high_school">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                </select>
            </div>
            <div className="grid gap-2">
                <Label>Degree Name</Label>
                <Input
                    placeholder="e.g. B.Tech Computer Science"
                    value={data.degree}
                    onChange={(e) => updateData({ degree: e.target.value })}
                />
            </div>
            <div className="grid gap-2">
                <Label>Major / Specialization</Label>
                <Input
                    placeholder="e.g. Computer Science"
                    value={data.major}
                    onChange={(e) => updateData({ major: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Graduation Year</Label>
                    <Input
                        type="number"
                        placeholder="2025"
                        value={data.graduation_year}
                        onChange={(e) => updateData({ graduation_year: e.target.value })}
                    />
                </div>
                <div className="grid gap-2">
                    <Label>CGPA / Percentage</Label>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="8.5"
                        value={data.gpa}
                        onChange={(e) => updateData({ gpa: e.target.value })}
                    />
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label>Intended Degree Abroad</Label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={data.intended_degree}
                    onChange={(e) => updateData({ intended_degree: e.target.value })}
                >
                    <option value="">Select Degree</option>
                    <option value="bachelors">Bachelor's</option>
                    <option value="masters">Master's (MS/MA)</option>
                    <option value="mba">MBA</option>
                    <option value="phd">PhD</option>
                </select>
            </div>
            <div className="grid gap-2">
                <Label>Field of Study</Label>
                <Input
                    placeholder="e.g. Data Science"
                    value={data.field_of_study}
                    onChange={(e) => updateData({ field_of_study: e.target.value })}
                />
            </div>
            <div className="grid gap-2">
                <Label>Preferred Countries</Label>
                <div className="grid grid-cols-2 gap-2">
                    {["USA", "UK", "Canada", "Germany", "Australia", "Ireland"].map((country) => (
                        <div
                            key={country}
                            className={`flex cursor-pointer items-center justify-between rounded-md border p-3 text-sm transition-colors ${data.preferred_countries.includes(country)
                                ? "border-primary bg-primary/10 text-primary"
                                : "hover:bg-accent"
                                }`}
                            onClick={() => toggleCountry(country)}
                        >
                            {country}
                            {data.preferred_countries.includes(country) && <CheckCircle2 className="h-4 w-4" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label>Budget Range (Per Year in USD)</Label>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="number"
                        placeholder="Min (e.g. 20000)"
                        value={data.budget_min}
                        onChange={(e) => updateData({ budget_min: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Max (e.g. 50000)"
                        value={data.budget_max}
                        onChange={(e) => updateData({ budget_max: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <Label>Exam Readiness</Label>

                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">IELTS / TOEFL</span>
                        <select
                            className="h-8 rounded-md border text-sm"
                            value={data.ielts_status}
                            onChange={(e) => updateData({ ielts_status: e.target.value })}
                        >
                            <option value="not_started">Not Started</option>
                            <option value="preparing">Preparing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    {data.ielts_status === "completed" && (
                        <Input
                            placeholder="Score (e.g. 7.5)"
                            value={data.ielts_score}
                            onChange={(e) => updateData({ ielts_score: e.target.value })}
                        />
                    )}
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">GRE / GMAT</span>
                        <select
                            className="h-8 rounded-md border text-sm"
                            value={data.gre_status}
                            onChange={(e) => updateData({ gre_status: e.target.value })}
                        >
                            <option value="not_started">Not Started</option>
                            <option value="preparing">Preparing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    {data.gre_status === "completed" && (
                        <Input
                            placeholder="Score (e.g. 320)"
                            value={data.gre_score}
                            onChange={(e) => updateData({ gre_score: e.target.value })}
                        />
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        {step === 1 && "Academic Background"}
                        {step === 2 && "Study Goals"}
                        {step === 3 && "Budget & Readiness"}
                    </CardTitle>
                    <div className="flex text-sm font-medium text-muted-foreground">
                        Step {step} of 3
                    </div>
                </div>
                <CardDescription>
                    Tell us about yourself so we can personalize your roadmap.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </CardContent>

            <CardFooter className="flex justify-between">
                {step > 1 ? (
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                ) : (
                    <Button variant="ghost" onClick={onSwitchToVoice} className="text-primary hover:text-primary/80">
                        <Mic className="mr-2 h-4 w-4" /> Switch to Voice Mode
                    </Button>
                )}

                {step < 3 ? (
                    <Button onClick={handleNext}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Complete Profile
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
