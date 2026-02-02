"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Image as ImageIcon, Loader2, X, Plus, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
// We'll need to make sure compressImage is available or handle it inline if simple
import { compressImage } from "@/lib/image-utils"
import { toast } from "sonner"

interface ImagePickerProps {
    value?: string
    onChange: (url: string) => void
    className?: string
}

export function ImagePicker({ value, onChange, className }: ImagePickerProps) {
    const [activeTab, setActiveTab] = useState<'search' | 'upload'>('search')
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handle File Upload
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const compressed = await compressImage(file)
                onChange(compressed)
                toast.success("Görsel yüklendi")
            } catch (error) {
                toast.error("Görsel işlenemedi")
            }
        }
    }

    // Handle Search
    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        setSearchResults([])
        try {
            const res = await fetch(`/api/search-images?q=${encodeURIComponent(searchQuery)}`)
            const data = await res.json()
            if (data.results && data.results.length > 0) {
                setSearchResults(data.results)
            } else {
                toast.error("Görsel bulunamadı")
            }
        } catch (error) {
            toast.error("Arama hatası")
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        type="button"
                        className={cn("flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2", activeTab === 'search' ? "bg-slate-50 text-slate-900 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")}
                        onClick={() => setActiveTab('search')}
                    >
                        <Search className="w-4 h-4" />
                        Web'de Ara
                    </button>
                    <button
                        type="button"
                        className={cn("flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2", activeTab === 'upload' ? "bg-slate-50 text-slate-900 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")}
                        onClick={() => setActiveTab('upload')}
                    >
                        <Upload className="w-4 h-4" />
                        Yükle / URL
                    </button>
                </div>

                <div className="p-4 min-h-[220px]">
                    {activeTab === 'search' && (
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Örn: Hamburger, Pizza, İçecek..."
                                    className="bg-white"
                                />
                                <Button type="button" onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                </Button>
                            </div>

                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1">
                                    {searchResults.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="aspect-square relative rounded-md overflow-hidden cursor-pointer group border border-slate-200 bg-slate-50"
                                            onClick={() => {
                                                onChange(img.full)
                                                setActiveTab('upload') // Switch to preview
                                            }}
                                        >
                                            <img src={img.thumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <Plus className="text-white opacity-0 group-hover:opacity-100 w-6 h-6 drop-shadow-md" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                                    <Search className="w-8 h-8 mb-2 opacity-20" />
                                    <span>Görsel aramak için bir kelime yazın.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'upload' && (
                        <div className="space-y-4">
                            {/* Preview Area */}
                            <div
                                className="h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-400 transition-all relative overflow-hidden group bg-slate-50/50"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {value ? (
                                    <>
                                        <img src={value} className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Değiştir</span>
                                        </div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onChange("")
                                            }}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                        <span className="text-sm font-medium text-slate-600 block">Bilgisayardan Seç</span>
                                        <span className="text-[10px] text-slate-400">veya URL yapıştırın</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* URL Fallback */}
                            <div>
                                <Label className="text-xs text-slate-500 mb-1.5 block">veya Görsel Bağlantısı (URL)</Label>
                                <Input
                                    value={value || ""}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder="https://..."
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <p className="text-[10px] text-slate-400 text-right">JPG, PNG, WEBP desteklenir.</p>
        </div>
    )
}
