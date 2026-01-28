"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Loader2, StopCircle, RefreshCcw } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

// Web Speech API Types
type SpeechRecognition = any
type SpeechRecognitionEvent = any

interface VoiceOnboardingProps {
    onSwitchToForm: () => void
}

export function VoiceOnboarding({ onSwitchToForm }: VoiceOnboardingProps) {
    const [isListening, setIsListening] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [aiMessage, setAiMessage] = useState("Hi! I'm your AI counsellor. Let's set up your profile together. What's your current education level?")
    const [currentStep, setCurrentStep] = useState("start")
    const [isProcessing, setIsProcessing] = useState(false)

    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const { refreshUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Initialize speech recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onstart = () => setIsListening(true)
                recognition.onend = () => setIsListening(false)
                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = Array.from(event.results)
                        .map((result: any) => result[0])
                        .map((result: any) => result.transcript)
                        .join('')
                    setTranscript(transcript)
                }

                recognitionRef.current = recognition
            } else {
                toast.error("Speech recognition not supported in this browser.")
            }
        }

        // Initial AI greeting
        speak(aiMessage)

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            window.speechSynthesis.cancel()
        }
    }, [])

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.onstart = () => setIsPlaying(true)
            utterance.onend = () => setIsPlaying(false)
            window.speechSynthesis.speak(utterance)
        }
    }

    const startListening = () => {
        if (recognitionRef.current && !isListening && !isPlaying) {
            setTranscript("")
            recognitionRef.current.start()
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
            handleResponse(transcript)
        }
    }

    const handleResponse = async (userTranscript: string) => {
        if (!userTranscript.trim()) return

        setIsProcessing(true)
        try {
            const response = await api.post("/counsellor/voice-onboarding", {
                transcript: userTranscript,
                current_step: currentStep
            })

            const { response_text, next_step, is_complete } = response.data

            setAiMessage(response_text)
            setCurrentStep(next_step)
            speak(response_text)

            if (is_complete) {
                await refreshUser()
                toast.success("Profile completed successfully!")
                setTimeout(() => router.push("/dashboard"), 3000)
            }
        } catch (error) {
            console.error("Voice processing error:", error)
            toast.error("Sorry, I didn't verify that. Could you try again or switch to the form?")
        } finally {
            setIsProcessing(false)
            setTranscript("")
        }
    }

    return (
        <Card className="w-full max-w-lg border-primary/20 shadow-lg">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {isPlaying ? (
                        <div className="flex gap-1 h-6">
                            <span className="w-1 bg-primary animate-bounce [animation-delay:-0.3s] h-full"></span>
                            <span className="w-1 bg-primary animate-bounce [animation-delay:-0.15s] h-full"></span>
                            <span className="w-1 bg-primary animate-bounce h-full"></span>
                        </div>
                    ) : (
                        <Mic className={`h-8 w-8 ${isListening ? "text-destructive animate-pulse" : "text-primary"}`} />
                    )}
                </div>
                <CardTitle>AI Counsellor</CardTitle>
                <CardDescription>
                    Have a natural conversation to set up your profile
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="min-h-[100px] rounded-lg bg-muted p-4 text-center">
                    <p className="text-lg font-medium text-foreground">
                        {aiMessage}
                    </p>
                </div>

                {transcript && (
                    <div className="text-center text-sm text-muted-foreground animate-in fade-in">
                        "{transcript}"
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={() => speak(aiMessage)}
                        disabled={isListening || isProcessing}
                    >
                        <RefreshCcw className="h-5 w-5" />
                    </Button>

                    <Button
                        size="xl"
                        className={`h-16 w-16 rounded-full shadow-lg transition-all ${isListening ? "bg-destructive hover:bg-destructive/90 scale-110" : "bg-primary hover:bg-primary/90"
                            }`}
                        onClick={isListening ? stopListening : startListening}
                        disabled={isPlaying || isProcessing}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : isListening ? (
                            <StopCircle className="h-8 w-8" />
                        ) : (
                            <Mic className="h-8 w-8" />
                        )}
                    </Button>
                </div>

                <Button variant="ghost" onClick={onSwitchToForm} className="text-sm">
                    Switch to Manual Form
                </Button>
            </CardFooter>
        </Card>
    )
}
