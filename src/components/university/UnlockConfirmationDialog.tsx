import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface UnlockConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    universityName: string
}

export function UnlockConfirmationDialog({ isOpen, onClose, onConfirm, universityName }: UnlockConfirmationDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Unlock University Choice?"
        >
            <div className="space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex gap-3 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold mb-1">Warning: Progress Loss</p>
                        <p>Unlocking will remove all tasks and documents generated for this university.</p>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    Are you sure you want to unlock <strong>{universityName}</strong>? You will need to lock it again to access guidance.
                </p>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm} variant="destructive">
                        Yes, Unlock
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
