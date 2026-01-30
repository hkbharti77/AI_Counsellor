import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface RemoveConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    universityName: string
}

export function RemoveConfirmationDialog({ isOpen, onClose, onConfirm, universityName }: RemoveConfirmationDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Remove from Shortlist?"
        >
            <div className="space-y-4">
                <div className="p-4 bg-muted/50 border rounded-lg flex gap-3 text-muted-foreground">
                    <Trash2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p>This will remove the university from your shortlist.</p>
                    </div>
                </div>

                <p className="text-sm text-foreground">
                    Are you sure you want to remove <strong>{universityName}</strong>?
                </p>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onConfirm} variant="destructive">
                        Remove
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
