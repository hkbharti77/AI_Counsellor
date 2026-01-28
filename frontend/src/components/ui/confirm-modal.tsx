"use client"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: React.ReactNode
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive" | "warning"
    isLoading?: boolean
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    isLoading = false
}: ConfirmModalProps) {

    const getIcon = () => {
        switch (variant) {
            case "destructive": return <Trash2 className="h-5 w-5 text-destructive" />
            case "warning": return <AlertTriangle className="h-5 w-5 text-warning" />
            default: return null
        }
    }

    const getVariantClasses = () => {
        switch (variant) {
            case "destructive": return "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            case "warning": return "bg-warning hover:bg-warning/90 text-warning-foreground"
            default: return "bg-primary hover:bg-primary/90 text-primary-foreground"
        }
    }

    const getBgClasses = () => {
        switch (variant) {
            case "destructive": return "bg-destructive/10 border-destructive/20"
            case "warning": return "bg-warning/10 border-warning/20"
            default: return "bg-muted/50 border-border"
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className="space-y-4">
                <div className={cn("p-4 border rounded-lg flex gap-3", getBgClasses())}>
                    {getIcon()}
                    <div className="text-sm">
                        {typeof description === "string" ? <p>{description}</p> : description}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>{cancelText}</Button>
                    <Button
                        onClick={onConfirm}
                        className={getVariantClasses()}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
