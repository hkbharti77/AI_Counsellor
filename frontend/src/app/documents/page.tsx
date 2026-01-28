"use client"

import { useState, useEffect, useRef } from "react"
import { DocumentCard } from "@/components/documents/DocumentCard"
import { DocumentStats } from "@/components/documents/DocumentStats"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, Filter, Loader2 } from "lucide-react"
import { toast } from "sonner"

import api from "@/lib/api"
import { Modal } from "@/components/ui/modal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Types
interface Document {
    id: number
    name: string
    type: string
    size: string
    category: string
    status: "verified" | "pending" | "missing" | "rejected"
    file_path: string
    created_at: string
}

const CATEGORIES = [
    { id: "all", label: "All Files" },
    { id: "academic", label: "Academic" },
    { id: "application", label: "Application" },
    { id: "financial", label: "Financial" },
    { id: "identity", label: "Identity" },
]

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")
    const [isUploading, setIsUploading] = useState(false)

    // Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedCategory, setSelectedCategory] = useState("academic")

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            const response = await api.get("/documents/")
            setDocuments(response.data)
        } catch (error) {
            console.error("Fetch docs error:", error)
            toast.error("Failed to load documents")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    const handleUploadSubmit = async () => {
        if (!selectedFile) {
            toast.error("Please select a file")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("category", selectedCategory)

        try {
            await api.post("/documents/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            toast.success("Document uploaded successfully")
            setIsUploadModalOpen(false)
            setSelectedFile(null)
            fetchDocuments()
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload document")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/documents/${id}`)
            toast.success("Document deleted")
            setDocuments(prev => prev.filter(d => d.id !== id))
        } catch (error) {
            toast.error("Failed to delete document")
        }
    }

    const filteredDocs = activeTab === "all"
        ? documents
        : documents.filter(d => d.category === activeTab)

    const stats = {
        total: documents.length,
        verified: documents.filter(d => d.status === "verified").length,
        pending: documents.filter(d => d.status === "pending").length,
        missing: documents.filter(d => d.status === "missing").length,
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-[60]">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Document Vault</h1>
                    <p className="text-muted-foreground mt-1">
                        Securely manage all your application documents in one place.
                    </p>
                </div>

                <button
                    type="button"
                    className={cn(buttonVariants({ variant: "default" }), "shadow-lg shadow-primary/25 relative z-[60] cursor-pointer pointer-events-auto")}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Opening modal via FORCE click");
                        setIsUploadModalOpen(true);
                    }}
                >
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload New
                </button>
            </div>

            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Upload Document"
            >
                <form onSubmit={(e) => { e.preventDefault(); handleUploadSubmit(); }} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Document Category</Label>
                        <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="academic">Academic</option>
                            <option value="application">Application</option>
                            <option value="financial">Financial</option>
                            <option value="identity">Identity</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Select File</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUploading || !selectedFile}>
                            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </form>
            </Modal>

            <DocumentStats {...stats} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
                            {CATEGORIES.map(cat => (
                                <TabsTrigger key={cat.id} value={cat.id}>{cat.label}</TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                </div>

                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredDocs.map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                // @ts-ignore - ID type mismatch (number vs string) handled by component update
                                doc={doc}
                                // @ts-ignore - ID type mismatch handled below
                                onDelete={() => handleDelete(doc.id)}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredDocs.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <p className="text-muted-foreground">No documents found in this category.</p>
                        <Button
                            variant="link"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="mt-2 text-primary"
                        >
                            Upload your first document
                        </Button>
                    </div>
                )}
            </div>
        </div >
    )
}
