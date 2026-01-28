"use client"

import { useState, useEffect } from "react"
import { UniversityCard } from "@/components/university/UniversityCard"
import { LockConfirmationDialog } from "@/components/university/LockConfirmationDialog"
import { UnlockConfirmationDialog } from "@/components/university/UnlockConfirmationDialog"
import { RemoveConfirmationDialog } from "@/components/university/RemoveConfirmationDialog"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Unlock } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"
import { getErrorMessage } from "@/lib/utils"

export default function ShortlistPage() {
    const router = useRouter()
    const [shortlist, setShortlist] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Lock Modal State
    const [lockModalOpen, setLockModalOpen] = useState(false)
    const [selectedUniForLock, setSelectedUniForLock] = useState<any>(null)

    // Unlock Modal State
    const [unlockModalOpen, setUnlockModalOpen] = useState(false)
    const [universityToUnlock, setUniversityToUnlock] = useState<any>(null)
    const [isUnlocking, setIsUnlocking] = useState(false)

    // Remove Modal State
    const [removeModalOpen, setRemoveModalOpen] = useState(false)
    const [universityToRemove, setUniversityToRemove] = useState<any>(null)
    const [isRemoving, setIsRemoving] = useState(false)

    const fetchShortlist = async () => {
        try {
            setLoading(true)
            const response = await api.get("/universities/shortlist")
            // Parse the backend response where university details are nested
            const parsed = response.data.map((item: any) => ({
                ...item.university,
                is_shortlisted: true,
                is_locked: item.is_locked,
                // keep the shortlist metadata if needed
                shortlist_id: item.id
            }))
            setShortlist(parsed)
        } catch (error) {
            console.error("Shortlist fetch error:", error)
            toast.error("Failed to load shortlist")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchShortlist()
    }, [])

    // --- LOCK LOGIC ---
    const handleLockClick = (universityId: number) => {
        if (shortlist.some(u => u.is_locked)) {
            toast.error("You already have a locked university. Please unlock it first.")
            return
        }
        const university = shortlist.find(u => u.id === universityId)
        if (university) {
            setSelectedUniForLock(university)
            setLockModalOpen(true)
        }
    }

    const confirmLock = async () => {
        if (!selectedUniForLock) return

        try {
            await api.post("/universities/lock", { university_id: selectedUniForLock.id })
            toast.success("University locked successfully!")
            setLockModalOpen(false)
            fetchShortlist() // Refresh to show locked state
            router.push("/dashboard") // Redirect to dashboard or guidance
        } catch (error: any) {
            toast.error(getErrorMessage(error) || "Failed to lock university")
        }
    }

    // --- UNLOCK LOGIC ---
    const handleUnlockClick = (university: any) => {
        setUniversityToUnlock(university)
        setUnlockModalOpen(true)
    }

    const confirmUnlock = async () => {
        if (!universityToUnlock) return

        try {
            setIsUnlocking(true)
            await api.post("/universities/unlock", {
                university_id: universityToUnlock.id,
                confirm: true
            })
            toast.success("University unlocked")
            setUnlockModalOpen(false)
            fetchShortlist()
        } catch (error: any) {
            toast.error(getErrorMessage(error) || "Failed to unlock")
        } finally {
            setIsUnlocking(false)
        }
    }

    // --- REMOVE LOGIC ---
    const handleRemoveClick = (university: any) => {
        setUniversityToRemove(university)
        setRemoveModalOpen(true)
    }

    const confirmRemove = async () => {
        if (!universityToRemove) return
        try {
            setIsRemoving(true)
            await api.delete(`/universities/shortlist/${universityToRemove.id}`)
            toast.success("Removed from shortlist")
            setRemoveModalOpen(false)
            fetchShortlist()
        } catch (error) {
            toast.error("Failed to remove")
        } finally {
            setIsRemoving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const lockedUni = shortlist.find(u => u.is_locked)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/universities">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Shortlist</h1>
                    <p className="text-muted-foreground">
                        Manage your selected universities and lock your final choice.
                    </p>
                </div>
            </div>

            {shortlist.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
                    <p className="mb-4">You haven't shortlisted any universities yet.</p>
                    <Link href="/universities">
                        <Button>Explore Universities</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {shortlist.map(uni => (
                        <div key={uni.shortlist_id} className="relative group">
                            <UniversityCard
                                university={uni}
                                onShortlist={() => { }} // Disabled in card anyway
                                onLock={!lockedUni ? handleLockClick : undefined}
                            />

                            {/* Overlay for Unlocking if this is the locked one */}
                            {uni.is_locked && (
                                <div className="absolute top-2 right-2 z-10">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 text-xs gap-1 opacity-90 hover:opacity-100"
                                        onClick={() => handleUnlockClick(uni)}
                                        disabled={isUnlocking}
                                    >
                                        <Unlock className="h-3 w-3" /> Unlock
                                    </Button>
                                </div>
                            )}

                            {/* Remove button if not locked */}
                            {!uni.is_locked && (
                                <Button
                                    variant="link"
                                    className="text-red-500 text-xs absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm h-8 px-2"
                                    onClick={() => handleRemoveClick(uni)}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <LockConfirmationDialog
                isOpen={lockModalOpen}
                onClose={() => setLockModalOpen(false)}
                onConfirm={confirmLock}
                universityName={selectedUniForLock?.name || ""}
            />

            <UnlockConfirmationDialog
                isOpen={unlockModalOpen}
                onClose={() => setUnlockModalOpen(false)}
                onConfirm={confirmUnlock}
                universityName={universityToUnlock?.name || ""}
            />

            <RemoveConfirmationDialog
                isOpen={removeModalOpen}
                onClose={() => setRemoveModalOpen(false)}
                onConfirm={confirmRemove}
                universityName={universityToRemove?.name || ""}
            />
        </div>
    )
}
