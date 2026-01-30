import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface LockConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    universityName: string
}

export function LockConfirmationDialog({ isOpen, onClose, onConfirm, universityName }: LockConfirmationDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Lock University Choice?"
        >
            <div className="space-y-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold mb-1">This is a major commitment!</p>
                        <p>Locking a university will unlock application guidance and auto-generate your to-do list for this specific university.</p>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    Are you sure you want to lock <strong>{universityName}</strong> as your final choice? You can unlock it later, but your task progress might be reset.
                </p>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        Yes, Lock it
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
