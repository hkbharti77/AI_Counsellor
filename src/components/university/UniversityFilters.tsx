"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface UniversityFiltersProps {
    search: string
    setSearch: (value: string) => void
    onFilterClick: () => void
    activeFiltersCount: number
}

export function UniversityFilters({ search, setSearch, onFilterClick, activeFiltersCount }: UniversityFiltersProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search universities..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <Button variant="outline" onClick={onFilterClick} className="relative">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                        {activeFiltersCount}
                    </span>
                )}
            </Button>
        </div>
    )
}
