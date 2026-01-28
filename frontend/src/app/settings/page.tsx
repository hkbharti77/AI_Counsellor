"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Globe2, GraduationCap, Banknote, FileText, Pencil, Save, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
    const { user: authUser, refreshUser } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form states
    const [formData, setFormData] = useState<any>({})
    const [userData, setUserData] = useState<any>({ full_name: "" })

    useEffect(() => {
        const fetchProfile = async () => {
            // Reset loading state when authUser changes or initial load
            setLoading(true)
            try {
                const response = await api.get("/profile/")
                setProfile(response.data)
                setFormData(response.data)
                if (authUser) {
                    setUserData({ full_name: authUser.full_name })
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error)
                toast.error("Failed to load profile data")
            } finally {
                setLoading(false)
            }
        }

        if (authUser) {
            fetchProfile()
        } else {
            // Wait for authUser to be ready
            const timer = setTimeout(() => {
                if (!authUser) setLoading(false) // Stop loading if no user after timeout (though auth guard should handle this)
            }, 1000)
            return () => clearTimeout(timer)
        }

    }, [authUser])

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleUserChange = (value: string) => {
        setUserData((prev: any) => ({
            ...prev,
            full_name: value
        }))
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)

            // Update user details if changed
            if (authUser?.full_name !== userData.full_name) {
                await api.put(`/auth/me?full_name=${userData.full_name}`)
                await refreshUser()
            }

            // Update profile details
            const profilePayload = {
                profile: {
                    ...formData,
                    // Ensure numeric values are sent as numbers
                    graduation_year: Number(formData.graduation_year),
                    gpa: Number(formData.gpa),
                    budget_min: Number(formData.budget_min),
                    budget_max: Number(formData.budget_max),
                    ielts_score: Number(formData.ielts_score),
                    toefl_score: Number(formData.toefl_score),
                    gre_score: Number(formData.gre_score),
                    gmat_score: Number(formData.gmat_score),
                }
            }

            const response = await api.put("/profile/", profilePayload)
            setProfile(response.data)
            setFormData(response.data)
            setIsEditing(false)
            toast.success("Profile updated successfully")
        } catch (error) {
            console.error("Failed to update profile:", error)
            toast.error("Failed to update profile")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setFormData(profile)
        setUserData({ full_name: authUser?.full_name || "" })
        setIsEditing(false)
    }

    if (loading) {
        return (
            <div className="flex h-[50dvh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!profile) return null

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your personal information and study abroad preferences.
                    </p>
                </div>
                {!isEditing ? (
                    <Button
                        onClick={() => {
                            setIsEditing(true)
                            toast.info("Edit mode enabled")
                        }}
                        className="gap-2"
                    >
                        <Pencil className="h-4 w-4" /> Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                {/* User Info Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-4xl font-bold text-primary">
                                    {authUser?.full_name?.substring(0, 1).toUpperCase()}
                                </span>
                            </div>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="sr-only">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        value={userData.full_name}
                                        onChange={(e) => handleUserChange(e.target.value)}
                                        className="text-center"
                                        placeholder="Full Name"
                                    />
                                </div>
                            ) : (
                                <CardTitle>{authUser?.full_name}</CardTitle>
                            )}
                            <CardDescription>{authUser?.email}</CardDescription>
                            <div className="mt-4 flex justify-center">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                                    Stage {authUser?.current_stage}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Detailed Profile Info */}
                <div className="space-y-6">
                    <Tabs defaultValue="academic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="academic">Academic</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                            <TabsTrigger value="scores">Test Scores</TabsTrigger>
                        </TabsList>

                        <TabsContent value="academic" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Academic Background</CardTitle>
                                    </div>
                                    <CardDescription>Your current educational qualifications</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Current Level</Label>
                                            {isEditing ? (
                                                <Input value={formData.education_level} onChange={(e) => handleInputChange("education_level", e.target.value)} />
                                            ) : (
                                                <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.education_level}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Degree Name</Label>
                                            {isEditing ? (
                                                <Input value={formData.degree} onChange={(e) => handleInputChange("degree", e.target.value)} />
                                            ) : (
                                                <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.degree}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Major / Field</Label>
                                            {isEditing ? (
                                                <Input value={formData.major} onChange={(e) => handleInputChange("major", e.target.value)} />
                                            ) : (
                                                <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.major}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Graduation Year</Label>
                                            {isEditing ? (
                                                <Input type="number" value={formData.graduation_year} onChange={(e) => handleInputChange("graduation_year", e.target.value)} />
                                            ) : (
                                                <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.graduation_year}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GPA / Percentage</Label>
                                            {isEditing ? (
                                                <Input type="number" step="0.1" value={formData.gpa} onChange={(e) => handleInputChange("gpa", e.target.value)} />
                                            ) : (
                                                <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.gpa}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preferences" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Globe2 className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Study Preferences</CardTitle>
                                    </div>
                                    <CardDescription>Your future study plans</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Intended Degree</Label>
                                            {isEditing ? (
                                                <Input value={formData.intended_degree} onChange={(e) => handleInputChange("intended_degree", e.target.value)} />
                                            ) : (
                                                <p className="font-medium capitalize p-2 bg-muted/30 rounded-md">{profile.intended_degree}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Field of Study</Label>
                                            {isEditing ? (
                                                <Input value={formData.field_of_study} onChange={(e) => handleInputChange("field_of_study", e.target.value)} />
                                            ) : (
                                                <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.field_of_study}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Target Intake</Label>
                                            {isEditing ? (
                                                <Input value={formData.target_intake} onChange={(e) => handleInputChange("target_intake", e.target.value)} />
                                            ) : (
                                                <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.target_intake}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Preferred Countries</Label>
                                            {isEditing ? (
                                                <Input value={formData.preferred_countries} onChange={(e) => handleInputChange("preferred_countries", e.target.value)} placeholder="Comma separated values" />
                                            ) : (
                                                <div className="flex flex-wrap gap-2 pt-1 p-2 bg-muted/30 rounded-md min-h-[40px]">
                                                    {profile.preferred_countries.split(',').map((country: string) => (
                                                        <Badge key={country} variant="outline">{country.trim()}</Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Banknote className="h-4 w-4 text-muted-foreground" />
                                            <h4 className="font-semibold text-sm">Financials</h4>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Budget Range (Min - Max)</Label>
                                                {isEditing ? (
                                                    <div className="flex gap-2">
                                                        <Input type="number" placeholder="Min" value={formData.budget_min} onChange={(e) => handleInputChange("budget_min", e.target.value)} />
                                                        <Input type="number" placeholder="Max" value={formData.budget_max} onChange={(e) => handleInputChange("budget_max", e.target.value)} />
                                                    </div>
                                                ) : (
                                                    <p className="font-medium p-2 bg-muted/30 rounded-md">
                                                        ₹{profile.budget_min?.toLocaleString()} - ₹{profile.budget_max?.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Funding Type</Label>
                                                {isEditing ? (
                                                    <Input value={formData.funding_type} onChange={(e) => handleInputChange("funding_type", e.target.value)} />
                                                ) : (
                                                    <p className="font-medium p-2 bg-muted/30 rounded-md">{profile.funding_type}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="scores" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-lg">Test Scores & Documents</CardTitle>
                                    </div>
                                    <CardDescription>Standardized tests and application documents</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* IELTS */}
                                        <div className="rounded-lg border p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold">IELTS</h4>
                                                {!isEditing && (
                                                    <Badge className={
                                                        profile.ielts_status === 'Completed' ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" :
                                                            "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                    }>
                                                        {profile.ielts_status}
                                                    </Badge>
                                                )}
                                            </div>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <select
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={formData.ielts_status}
                                                        onChange={(e) => handleInputChange("ielts_status", e.target.value)}
                                                    >
                                                        <option value="Not Taken">Not Taken</option>
                                                        <option value="Planned">Planned</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                    <Input
                                                        type="number"
                                                        step="0.5"
                                                        placeholder="Score"
                                                        value={formData.ielts_score}
                                                        onChange={(e) => handleInputChange("ielts_score", e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-2xl font-bold">{profile.ielts_score > 0 ? profile.ielts_score : '-'}</p>
                                            )}
                                        </div>

                                        {/* TOEFL */}
                                        <div className="rounded-lg border p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold">TOEFL</h4>
                                                {!isEditing && (
                                                    <Badge className={
                                                        profile.toefl_status === 'Completed' ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" :
                                                            "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                    }>
                                                        {profile.toefl_status}
                                                    </Badge>
                                                )}
                                            </div>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <select
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={formData.toefl_status}
                                                        onChange={(e) => handleInputChange("toefl_status", e.target.value)}
                                                    >
                                                        <option value="Not Taken">Not Taken</option>
                                                        <option value="Planned">Planned</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                    <Input
                                                        type="number"
                                                        placeholder="Score"
                                                        value={formData.toefl_score}
                                                        onChange={(e) => handleInputChange("toefl_score", e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-2xl font-bold">{profile.toefl_score > 0 ? profile.toefl_score : '-'}</p>
                                            )}
                                        </div>

                                        {/* GRE */}
                                        <div className="rounded-lg border p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold">GRE</h4>
                                                {!isEditing && (
                                                    <Badge className={
                                                        profile.gre_status === 'Completed' ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" :
                                                            "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                    }>
                                                        {profile.gre_status}
                                                    </Badge>
                                                )}
                                            </div>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <select
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={formData.gre_status}
                                                        onChange={(e) => handleInputChange("gre_status", e.target.value)}
                                                    >
                                                        <option value="Not Required">Not Required</option>
                                                        <option value="Planned">Planned</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                    <Input
                                                        type="number"
                                                        placeholder="Score"
                                                        value={formData.gre_score}
                                                        onChange={(e) => handleInputChange("gre_score", e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-2xl font-bold">{profile.gre_score > 0 ? profile.gre_score : '-'}</p>
                                            )}
                                        </div>

                                        {/* GMAT */}
                                        <div className="rounded-lg border p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold">GMAT</h4>
                                                {!isEditing && (
                                                    <Badge className={
                                                        profile.gmat_status === 'Completed' ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300" :
                                                            "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                    }>
                                                        {profile.gmat_status}
                                                    </Badge>
                                                )}
                                            </div>
                                            {isEditing ? (
                                                <div className="space-y-2">
                                                    <select
                                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={formData.gmat_status}
                                                        onChange={(e) => handleInputChange("gmat_status", e.target.value)}
                                                    >
                                                        <option value="Not Required">Not Required</option>
                                                        <option value="Planned">Planned</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                    <Input
                                                        type="number"
                                                        placeholder="Score"
                                                        value={formData.gmat_score}
                                                        onChange={(e) => handleInputChange("gmat_score", e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-2xl font-bold">{profile.gmat_score > 0 ? profile.gmat_score : '-'}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-sm mb-1">Statement of Purpose (SOP)</h4>
                                                <p className="text-xs text-muted-foreground">Status of your essay writing</p>
                                            </div>
                                            {!isEditing && <Badge variant="outline">{profile.sop_status}</Badge>}
                                        </div>
                                        {isEditing && (
                                            <select
                                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={formData.sop_status}
                                                onChange={(e) => handleInputChange("sop_status", e.target.value)}
                                            >
                                                <option value="Not Started">Not Started</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
