"use client"

import { ChatInterface } from "@/components/chat/ChatInterface"

export default function CounsellorPage() {
    return (
        <div className="max-w-4xl mx-auto h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">AI Counsellor</h1>
                <p className="text-muted-foreground">
                    Get personalized guidance,university recommendations, and help with your application process.
                </p>
            </div>

            <ChatInterface />
        </div>
    )
}
