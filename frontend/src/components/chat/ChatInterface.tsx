"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, Loader2, Trash2 } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ui/confirm-modal"

interface Message {
    id: number
    role: "user" | "assistant"
    message: string
    actions?: any[]
}

interface ChatInterfaceProps {
    className?: string
    onClose?: () => void
}

export function ChatInterface({ className, onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [clearModalOpen, setClearModalOpen] = useState(false)
    const [isClearing, setIsClearing] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([
        "Recommend universities for me",
        "How strong is my profile?",
        "What are my profile gaps?",
        "Shortlist Harvard University"
    ])
    const scrollRef = useRef<HTMLDivElement>(null)

    // Load history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get("/counsellor/history?limit=20")
                setMessages(res.data)
            } catch (error) {
                console.error("Failed to load chat history", error)
            }
        }
        fetchHistory()
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleClearHistoryClick = () => {
        setClearModalOpen(true)
    }

    const confirmClearHistory = async () => {
        try {
            setIsClearing(true)
            await api.delete("/counsellor/history")
            setMessages([])
            toast.success("History cleared")
            setClearModalOpen(false)
        } catch (error) {
            toast.error("Failed to clear history")
        } finally {
            setIsClearing(false)
        }
    }

    const handleSend = async (text: string) => {
        if (!text.trim()) return

        const userMsg: Message = { id: Date.now(), role: "user", message: text }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setLoading(true)

        try {
            const res = await api.post("/counsellor/chat", { message: text })

            const aiMsg: Message = {
                id: Date.now() + 1,
                role: "assistant",
                message: res.data.message,
                actions: res.data.actions
            }

            setMessages(prev => [...prev, aiMsg])

            if (res.data.suggestions && res.data.suggestions.length > 0) {
                setSuggestions(res.data.suggestions)
            }
        } catch (error) {
            toast.error("Failed to get response from AI Counsellor")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (!loading) {
                handleSend(input)
            }
        }
    }

    return (
        <div className={cn("flex flex-col border rounded-xl bg-background shadow-sm overflow-hidden", className || "h-[calc(100dvh-140px)]")}>
            {/* Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                        <h2 className="font-semibold text-sm">AI Counsellor</h2>
                        <p className="text-xs text-muted-foreground">Always here to guide you</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" title="Clear History" onClick={handleClearHistoryClick} className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 md:hidden">
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </Button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium text-lg text-foreground mb-2">Hello! I'm your AI Counsellor.</h3>
                        <p className="max-w-xs text-sm">
                            I can analyze your profile, recommend universities, and guide you through the application process.
                        </p>
                    </div>
                )}

                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        role={msg.role}
                        content={msg.message}
                        actions={msg.actions}
                    />
                ))}

                {loading && (
                    <div className="flex w-full gap-3 justify-start">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-primary/10">
                            <BotIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-2xl px-4 py-3 rounded-tl-sm flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background space-y-4">
                {/* Suggestions */}
                {suggestions.length > 0 && !loading && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {suggestions.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(suggestion)}
                                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors border border-transparent hover:border-primary/20 text-secondary-foreground"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about your study abroad journey..."
                        className="flex-1"
                    />
                    <Button
                        onClick={() => handleSend(input)}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className="shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ConfirmModal
                isOpen={clearModalOpen}
                onClose={() => setClearModalOpen(false)}
                onConfirm={confirmClearHistory}
                title="Clear Chat History"
                description="Are you sure you want to clear your conversation history? This action cannot be undone."
                variant="destructive"
                confirmText="Clear History"
                isLoading={isClearing}
            />
        </div>
    )
}

function BotIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    )
}
