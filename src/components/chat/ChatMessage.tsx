import { cn } from "@/lib/utils"
import { Bot, User, Check, Lock, ListTodo } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Action {
    type: string
    title?: string
    university_id?: number
    university_name?: string
    status?: string // success, failed, pending
}

interface ChatMessageProps {
    role: "user" | "assistant"
    content: string
    actions?: Action[]
    timestamp?: string
    onActionClick?: (action: Action) => void
}

export function ChatMessage({ role, content, actions, onActionClick }: ChatMessageProps) {
    const isAi = role === "assistant"

    return (
        <div className={cn("flex w-full gap-3", isAi ? "justify-start" : "justify-end")}>
            {isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                </div>
            )}

            <div className="flex max-w-[80%] flex-col gap-2">
                <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm overflow-hidden",
                    isAi ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                    {isAi ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                    ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2 last:mb-0" {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2 last:mb-0" {...props} />,
                                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                                    h1: ({ ...props }) => <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
                                    h3: ({ ...props }) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0" {...props} />,
                                    strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
                                    table: ({ ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-border border rounded-md" {...props} /></div>,
                                    thead: ({ ...props }) => <thead className="bg-muted/50" {...props} />,
                                    th: ({ ...props }) => <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b" {...props} />,
                                    td: ({ ...props }) => <td className="px-3 py-2 text-sm border-b last:border-0" {...props} />,
                                    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2" {...props} />,
                                    a: ({ ...props }) => <a className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer" {...props} />,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap">{content}</div>
                    )}
                </div>

                {/* Render Actions if any */}
                {isAi && actions && actions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-1">
                        {actions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    {action.type === "shortlist" && <Check className="h-4 w-4 text-primary" />}
                                    {action.type === "lock" && <Lock className="h-4 w-4 text-orange-500" />}
                                    {action.type === "create_task" && <ListTodo className="h-4 w-4 text-blue-500" />}
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="font-medium">
                                        {action.type === "shortlist" && `Shortlisted ${action.university_name}`}
                                        {action.type === "lock" && `Locked ${action.university_name}`}
                                        {action.type === "create_task" && `Task Created: ${action.title}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">{action.status || "Completed"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!isAi && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                </div>
            )}
        </div>
    )
}
