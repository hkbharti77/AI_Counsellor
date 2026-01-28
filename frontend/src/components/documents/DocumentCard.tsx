"use client"

import { FileText, Download, Trash2, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MoreVertical } from "lucide-react"

interface Document {
    id: string | number
    name: string
    type: string
    size: string
    updatedAt?: string // made optional as API returns created_at
    status: "verified" | "pending" | "missing" | "rejected" | string
    category: string
}

interface DocumentCardProps {
    doc: Document
    onDelete?: (id: number) => void
    onDownload?: (id: number) => void
}

export function DocumentCard({ doc, onDelete, onDownload }: DocumentCardProps) {
    const statusColor: Record<string, string> = {
        verified: "text-green-500 bg-green-500/10 border-green-500/20",
        pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        missing: "text-slate-400 bg-slate-100 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700",
        rejected: "text-red-500 bg-red-500/10 border-red-500/20",
    }

    const isMissing = doc.status === "missing"

    return (
        <div className={cn(
            "group relative flex flex-col justify-between p-5 rounded-2xl transition-all duration-300",
            isMissing
                ? "border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50"
                : "bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-1"
        )}>
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition-colors",
                    isMissing ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                )}>
                    <FileText className="h-6 w-6" />
                </div>
                {!isMissing && (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => onDownload?.(Number(doc.id))}
                            title="Download"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDelete?.(Number(doc.id))}
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div>
                <h4 className={cn("font-semibold text-base mb-1 truncate", isMissing && "text-muted-foreground")}>
                    {doc.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {!isMissing ? (
                        <>
                            <span className="uppercase font-medium">{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                        </>
                    ) : (
                        <span>Required Document</span>
                    )}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline" className={cn("capitalize border-0", statusColor[doc.status])}>
                    {doc.status === 'verified' && <CheckCircle className="mr-1 h-3 w-3" />}
                    {doc.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                    {doc.status === 'rejected' && <AlertCircle className="mr-1 h-3 w-3" />}
                    {doc.status}
                </Badge>

                {isMissing && (
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                        Upload
                    </Button>
                )}
            </div>
        </div>
    )
}
