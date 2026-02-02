"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Smartphone, Palette, ChevronRight, LayoutGrid, List, AlignLeft, MousePointerClick, Type, Sparkles, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getMenuData, saveMenuData } from "@/app/actions"
import { toast } from "sonner"
import PublicMenuClientside from "@/components/PublicMenuClient"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

// Mock Template Options
const TEMPLATES = [
    { id: "pastel", name: "Pastel Rüyası", description: "El yazısı fontlar, yumuşak renkler.", color: "bg-[#9370DB]" },
    { id: "gold", name: "Doğadan Masanıza", description: "Premium kavisli tasarım, toprak tonları.", color: "bg-[#8D7F68]" },
    { id: "grid", name: "Modern Vitrin", description: "Görsel odaklı 2'li grid ve liste görünümü.", color: "bg-black" },
    { id: "vibrant", name: "Vibrant Dark", description: "Modern, karanlık mod ve canlı renkler.", color: "bg-[#111]" },
    { id: "elegant", name: "Elegant Beige", description: "Sakin tonlar, şık ve ferah görünüm.", color: "bg-[#EAE0D5]" }
]

// Font Options
const TYPOGRAPHY_SETS = [
    { id: "default", name: "Standart", desc: "Inter & Sans-Serif", variable: "font-sans" },
    { id: "luxury", name: "Luxury Serif", desc: "Playfair & Cormorant", variable: "font-serif" },
    { id: "artisan", name: "Artisan", desc: "Dancing Script & Lato", variable: "font-dancing" },
    { id: "bistro", name: "Classic Bistro", desc: "Libre Baskerville", variable: "font-libre" },
]

// Color Palettes
const COLOR_PALETTES = [
    { id: "natural", name: "Doğal (Cream/Brown)", colors: { bg: "#FDFBF7", primary: "#2C3E50", accent: "#D35400" } },
    { id: "midnight", name: "Gece (Black/Gold)", colors: { bg: "#000000", primary: "#FFFFFF", accent: "#FFD700" } },
    { id: "pastel", name: "Pastel (Lavender)", colors: { bg: "#F3E5F5", primary: "#4A148C", accent: "#E1BEE7" } },
    { id: "clean", name: "Sade (White/Blue)", colors: { bg: "#FFFFFF", primary: "#1E293B", accent: "#3B82F6" } },
]

// Texture Options
const TEXTURES = [
    { id: "none", name: "Düz Renk", class: "" },
    { id: "paper", name: "Vintage Kağıt", class: "bg-paper-pattern" }, // Will map to CSS
    { id: "linen", name: "Premium Keten", class: "bg-linen-pattern" },
    { id: "leather", name: "Eskitilmiş Deri", class: "bg-leather-pattern" },
]

// Mock Data for Preview
const PREVIEW_DATA = {
    restaurantInfo: {
        name: "Restoran Adı",
        coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
        instagramUrl: "#",
        googleMapsUrl: "#",
        template: "modern",
        typography: "default",
        colorPalette: "natural",
        texture: "none",
        textureOpacity: 0.1,
        baseFontWeight: 400
    },
    campaigns: [],
    categories: [
        {
            id: "1", name: "Başlangıçlar", isActive: true, products: [
                { id: "p1", name: "Çıtır Tavuk", price: 120, isActive: true, description: "Özel soslu kızarmış tavuk parçaları", imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=300&q=80", isFeatured: true },
                { id: "p2", name: "Humus", price: 80, isActive: true, description: "Ev yapımı nohut ezmesi" }
            ]
        },
        {
            id: "2", name: "Ana Yemekler", isActive: true, products: [
                { id: "p4", name: "Dana Bonfile", price: 450, isActive: true, description: "Mantar soslu ızgara bonfile", imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=300&q=80", isFeatured: true }
            ]
        }
    ]
}

export default function DesignPage() {
    // Consolidated State
    const [designState, setDesignState] = useState({
        template: "pastel",
        typography: "default",
        colorPalette: "natural",
        texture: "none",
        textureOpacity: 0.1,
        baseFontWeight: 400
    })

    const [loading, setLoading] = useState(true)
    const [menuData, setMenuData] = useState<any>(null)
    const [showMobilePreview, setShowMobilePreview] = useState(false) // New state for custom overlay

    useEffect(() => {
        getMenuData().then(data => {
            setMenuData(data)

            const info = data.restaurantInfo || {}
            setDesignState({
                template: info.template || "pastel",
                typography: info.typography || "default",
                colorPalette: info.colorPalette || "natural",
                texture: info.texture || "none",
                textureOpacity: info.textureOpacity ?? 0.1,
                baseFontWeight: info.baseFontWeight ?? 400
            })

            setLoading(false)
        })
    }, [])

    const handleSave = async (newState = designState) => {
        setDesignState(newState) // Optimistic

        const updatedInfo = {
            ...menuData.restaurantInfo,
            ...newState
        }

        setMenuData({ ...menuData, restaurantInfo: updatedInfo })

        try {
            await saveMenuData({
                categories: menuData.categories,
                restaurantInfo: updatedInfo
            })
            // toast.success("Tasarım güncellendi") // Too noisy for sliders
        } catch (error) {
            console.error("Save failed", error)
        }
    }

    // Debounced save for sliders could be better, but direct verify for now is ok
    const updateField = (field: string, value: any) => {
        const newState = { ...designState, [field]: value }
        setDesignState(newState)
        // Auto save on change logic
        // For sliders, we might want to defer saving, but for buttons immediate is fine
        if (field !== 'textureOpacity' && field !== 'baseFontWeight') {
            handleSave(newState)
        }
    }

    // Explicit save button for sliders? Or just timeout
    // For this task, I'll allow "Canlı Önizleme" to update state, and a "Kaydet" button or auto-save debounce
    // Simpler: Just save on unmount or have a "Kaydet" button? 
    // The previous implementation saved on click. Let's keep saving on click for buttons.
    // For sliders, handleSave on commit (mouse up).

    const previewDataWithTemplate = menuData ? {
        ...PREVIEW_DATA,
        restaurantInfo: {
            ...menuData.restaurantInfo,
            ...designState
        },
        // Merge real products if available
        categories: menuData.categories.length > 0 ? menuData.categories : PREVIEW_DATA.categories
    } : PREVIEW_DATA

    return (
        <div className="flex-1 p-4 md:p-8 md:h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] flex flex-col md:flex-row items-center md:items-start gap-6 bg-slate-50/50 pb-24 md:pb-8 overflow-y-auto md:overflow-hidden">
            {/* Left: Controls */}
            <div className="flex-1 w-full md:h-full flex flex-col md:overflow-hidden">
                <div className="mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-900">Tasarım & Görünüm</h2>
                    <p className="text-slate-500 text-sm">Menünüzün kimliğini oluşturun.</p>
                </div>

                <Tabs defaultValue="template" className="flex-1 flex flex-col md:overflow-hidden">
                    <TabsList className="w-full justify-start mb-4 bg-white p-1 border border-slate-200">
                        <TabsTrigger value="template" className="flex-1">Şablon Seçimi</TabsTrigger>
                        <TabsTrigger value="appearance" className="flex-1">Premium Görünüm</TabsTrigger>
                    </TabsList>

                    {/* TEMPLATE TAB */}
                    <TabsContent value="template" className="flex-1 md:overflow-y-auto pr-2 no-scrollbar md:pb-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-2 overflow-x-auto snap-x flex-nowrap flex md:grid pb-4 pt-1 px-1 -mx-4 md:mx-0 md:pb-0 md:pt-0">
                            {/* Mobile: Horizontal Scroll / Desktop: Grid */}
                            {TEMPLATES.map(t => (
                                <div key={t.id} className="min-w-[85vw] md:min-w-0 snap-center pl-4 first:pl-4 md:pl-0">
                                    <TemplateCard
                                        title={t.name}
                                        active={designState.template === t.id}
                                        onClick={() => updateField('template', t.id)}
                                    >
                                        <div className={cn("h-full flex flex-col p-4", t.color)}>
                                            <div className="text-white/80 text-xs font-medium">{t.description}</div>
                                        </div>
                                    </TemplateCard>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* APPEARANCE TAB */}
                    <TabsContent value="appearance" className="flex-1 md:overflow-y-auto pr-2 no-scrollbar md:pb-20 space-y-8">
                        {/* Typography */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Type className="w-4 h-4" /> Tipografi Seti
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {TYPOGRAPHY_SETS.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => updateField('typography', t.id)}
                                        className={cn(
                                            "cursor-pointer p-3 rounded-lg border-2 transition-all hover:bg-slate-50",
                                            designState.typography === t.id ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" : "border-slate-200"
                                        )}
                                    >
                                        <div className="font-bold text-slate-900">{t.name}</div>
                                        <div className="text-xs text-slate-500 mt-1">{t.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Textures */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Arka Plan Dokusu
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {TEXTURES.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => updateField('texture', t.id)}
                                        className={cn(
                                            "cursor-pointer p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                                            designState.texture === t.id ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className={cn("w-8 h-8 rounded-full border border-slate-300 shadow-inner", t.class === "" ? "bg-white" : "bg-slate-200")}></div>
                                        <span className="text-sm font-medium">{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Color Palettes */}
                        <section>
                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <Palette className="w-4 h-4" /> Renk Paleti
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {COLOR_PALETTES.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => updateField('colorPalette', p.id)}
                                        className={cn(
                                            "cursor-pointer p-3 rounded-lg border-2 transition-all hover:bg-slate-50",
                                            designState.colorPalette === p.id ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600" : "border-slate-200"
                                        )}
                                    >
                                        <div className="flex gap-1 mb-2">
                                            <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: p.colors.bg }}></div>
                                            <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: p.colors.primary }}></div>
                                            <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: p.colors.accent }}></div>
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Sliders */}
                        <section className="space-y-6 bg-white p-5 rounded-xl border border-slate-200">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Doku Yoğunluğu</Label>
                                    <span className="text-xs text-slate-500">{(designState.textureOpacity * 100).toFixed(0)}%</span>
                                </div>
                                <Slider
                                    value={[designState.textureOpacity]}
                                    min={0} max={1} step={0.05}
                                    onValueChange={([val]) => updateField('textureOpacity', val)}
                                    onValueCommit={() => handleSave()}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Yazı Kalınlığı (Font Weight)</Label>
                                    <span className="text-xs text-slate-500">{designState.baseFontWeight}</span>
                                </div>
                                <Slider
                                    value={[designState.baseFontWeight]}
                                    min={100} max={900} step={100}
                                    onValueChange={([val]) => updateField('baseFontWeight', val)}
                                    onValueCommit={() => handleSave()}
                                />
                            </div>
                        </section>

                        <div className="pt-4">
                            <Button onClick={() => handleSave()} className="w-full">
                                <Check className="mr-2 w-4 h-4" /> Tüm Ayarları Kaydet
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right: Preview (Desktop) */}
            <div className="hidden md:flex md:w-[420px] w-full flex-shrink-0 flex-col items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl h-full sticky top-4">
                <div className="mb-4 text-center">
                    <h3 className="font-bold text-slate-800 flex items-center justify-center gap-2">
                        <Smartphone className="w-4 h-4" /> Canlı Önizleme
                    </h3>
                </div>
                {/* Scaled Container */}
                <div className="transform scale-[0.85] origin-top">
                    <PreviewFrame data={previewDataWithTemplate} />
                </div>
            </div>

            {/* Mobile Preview FAB & Custom Overlay */}

            {/* FAB */}
            <Button
                onClick={() => setShowMobilePreview(true)}
                size="icon"
                className="md:hidden fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 z-50 border-4 border-white"
            >
                <Eye className="w-6 h-6 text-white" />
            </Button>

            {/* Custom Full Screen Overlay */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-[200] bg-white flex flex-col h-[100dvh] w-screen overflow-hidden animate-in fade-in duration-200">
                    {/* Close Button Area */}
                    <div className="absolute top-4 right-4 z-[210]">
                        <Button
                            onClick={() => setShowMobilePreview(false)}
                            size="icon"
                            variant="secondary"
                            className="rounded-full shadow-lg bg-white/90 backdrop-blur text-slate-800 h-10 w-10 border border-slate-200 hover:bg-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full h-full overflow-y-auto no-scrollbar bg-slate-50 relative pb-[env(safe-area-inset-bottom)]">
                        <PublicMenuClientside
                            data={previewDataWithTemplate.categories}
                            restaurantInfo={previewDataWithTemplate.restaurantInfo}
                            campaigns={previewDataWithTemplate.campaigns}
                            // Important: No min-h-full logic that forces scroll if not needed, but ensure wrapper is big enough
                            className="min-h-full pb-24"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function TemplateCard({ title, active, onClick, children }: any) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-4",
                active ? "border-indigo-600 shadow-xl scale-[1.02]" : "border-transparent bg-white shadow-sm hover:shadow-md hover:scale-[1.01]"
            )}
        >
            <div className="absolute inset-x-0 bottom-0 top-10 bg-slate-50 border-t border-slate-100 group-hover:opacity-90 transition-opacity">
                {children}
            </div>
            <div className={cn(
                "absolute top-0 inset-x-0 h-10 px-4 flex items-center justify-between",
                active ? "bg-indigo-600 text-white" : "bg-white text-slate-700"
            )}>
                <span className="font-bold text-sm tracking-wide">{title}</span>
                {active && <Check className="w-4 h-4" />}
            </div>
        </div>
    )
}

function PreviewFrame({ data }: any) {
    return (
        <div className="relative w-[375px] h-[812px] bg-black rounded-[45px] shadow-2xl border-[12px] border-black overflow-hidden ring-4 ring-slate-900/10 pointer-events-auto">
            <div className="w-full h-full bg-white overflow-y-auto no-scrollbar relative rounded-[32px]">
                <PublicMenuClientside
                    data={data.categories}
                    restaurantInfo={data.restaurantInfo}
                    campaigns={data.campaigns}
                    className="min-h-full"
                />
            </div>
            {/* Phone Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-xl z-50"></div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/20 rounded-full z-50"></div>
        </div>
    )
}
