"use client"

import { useState, useEffect } from "react"
import { UniversityCard } from "@/components/university/UniversityCard"
import { UniversityFilters } from "@/components/university/UniversityFilters"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, Search } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"

export default function UniversitiesPage() {
    const [activeTab, setActiveTab] = useState("all")
    const [search, setSearch] = useState("")
    const [recommendations, setRecommendations] = useState<any[]>([])
    const [allUniversities, setAllUniversities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUniversities = async () => {
        try {
            setLoading(true)
            // Fetch recommendations (Dream/Target/Safe)
            const recResponse = await api.get("/universities/recommendations")
            setRecommendations(recResponse.data || [])

            // Fetch all for search
            const allResponse = await api.get("/universities/")
            setAllUniversities(allResponse.data)

        } catch (error) {
            console.error("Fetch universities error:", error)
            toast.error("Failed to load universities")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUniversities()
    }, [])

    const handleShortlist = async (id: number) => {
        try {
            await api.post("/universities/shortlist", { university_id: id })
            toast.success("University shortlisted!")
            // Optimistic update
            const updateList = (list: any[]) => list.map(u => u.id === id ? { ...u, is_shortlisted: true } : u)
            setRecommendations(updateList(recommendations))
            setAllUniversities(updateList(allUniversities))
        } catch (error: any) {
            toast.error(getErrorMessage(error) || "Failed to shortlist")
        }
    }

    // Flatten recommendations for "For You" tab
    const getCategorizedUniversities = (category: string) => {
        return recommendations.filter(u => u.category === category)
    }

    const filteredUniversities = allUniversities.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.country.toLowerCase().includes(search.toLowerCase())
    )

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex h-[400px] w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )
        }

        if (activeTab === "for_you") {
            const dreams = getCategorizedUniversities("dream")
            const targets = getCategorizedUniversities("target")
            const safes = getCategorizedUniversities("safe")

            if (recommendations.length === 0) {
                return (
                    <div className="text-center py-20 bg-muted/20 rounded-xl">
                        <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">No recommendations yet</h3>
                        <p className="text-muted-foreground">Complete your profile to get personalized AI suggestions.</p>
                    </div>
                )
            }

            return (
                <div className="space-y-10">
                    {dreams.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="flex h-6 w-1 bg-purple-500 rounded-full"></span>
                                Dream Universities
                                <span className="text-sm font-normal text-muted-foreground ml-2">(Ambitious choices)</span>
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {dreams.map(u => <UniversityCard key={u.id} university={u} onShortlist={handleShortlist} />)}
                            </div>
                        </section>
                    )}
                    {targets.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="flex h-6 w-1 bg-blue-500 rounded-full"></span>
                                Target Universities
                                <span className="text-sm font-normal text-muted-foreground ml-2">(Good fit)</span>
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {targets.map(u => <UniversityCard key={u.id} university={u} onShortlist={handleShortlist} />)}
                            </div>
                        </section>
                    )}
                    {safes.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="flex h-6 w-1 bg-green-500 rounded-full"></span>
                                Safe Universities
                                <span className="text-sm font-normal text-muted-foreground ml-2">(High chance)</span>
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {safes.map(u => <UniversityCard key={u.id} university={u} onShortlist={handleShortlist} />)}
                            </div>
                        </section>
                    )}
                </div>
            )
        }

        // Browse All Tab
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredUniversities.map(u => (
                    <UniversityCard key={u.id} university={u} onShortlist={handleShortlist} />
                ))}
                {filteredUniversities.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                        <p>No universities found matching "{search}"</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">University Discovery</h1>
                <p className="text-muted-foreground">
                    Find your perfect match with AI-driven recommendations.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="all">Browse All</TabsTrigger>
                        <TabsTrigger value="for_you" className="gap-2">
                            <Sparkles className="h-3 w-3" /> For You
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <UniversityFilters
                    search={search}
                    setSearch={setSearch}
                    onFilterClick={() => { }}
                    activeFiltersCount={0}
                />
            </div>

            {renderContent()}
        </div>
    )
}
