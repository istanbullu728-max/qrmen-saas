"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Bell, Instagram, MapPin, X, Utensils, Receipt, GlassWater } from "lucide-react"
import { createWaiterCall } from "@/app/actions"
import { toast } from "sonner"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
    tableId?: string
}

export function TemplatePastel({ data, restaurantInfo, activeCategories, onProductClick, tableId }: TemplateProps) {
    const [activeTab, setActiveTab] = useState(activeCategories[0]?.id)
    const [mounted, setMounted] = useState(false)

    // Waiter Call State
    const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false)
    const [waiterLoading, setWaiterLoading] = useState(false)
    const [hasCalled, setHasCalled] = useState(false)
    const [tableNo, setTableNo] = useState("")


    useEffect(() => {
        setMounted(true)
    }, [])

    // New Function to handle direct call if tableId exists
    const handleDirectCall = async () => {
        if (!tableId) {
            setIsWaiterModalOpen(true)
            return
        }

        setWaiterLoading(true)
        try {
            await createWaiterCall({
                tableId: `Masa ${tableId}`, // Or just tableId depending on preference, sticking to "Masa X" for consistency if simple number passed
                type: 'GENEL',
                note: 'Garson Çağrısı'
            })
            toast.success("Garsona haber verildi.", {
                description: `Masa ${tableId} için talebiniz iletildi.`,
                style: { backgroundColor: 'var(--accent)', color: 'var(--primary-foreground)', border: 'none' }
            })
            setHasCalled(true)
        } catch (error) {
            toast.error("Bir sorun oluştu.")
        } finally {
            setWaiterLoading(false)
        }
    }

    const handleCall = async () => {
        const targetTable = tableId || tableNo
        if (!targetTable) {
            toast.error("Lütfen masa numaranızı giriniz.")
            return
        }
        setWaiterLoading(true)
        try {
            await createWaiterCall({
                tableId: `Masa ${targetTable}`,
                type: 'GENEL',
                note: 'Garson Çağrısı'
            })
            toast.success("Garsona haber verildi.", {
                description: "En kısa sürede masanıza gelinecektir.",
                style: { backgroundColor: 'var(--accent)', color: 'var(--primary-foreground)', border: 'none' }
            })
            setIsWaiterModalOpen(false)
            setHasCalled(true)
        } catch (error) {
            toast.error("Bir sorun oluştu.")
        } finally {
            setWaiterLoading(false)
        }
    }

    const scrollToCategory = (catId: string) => {
        setActiveTab(catId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!mounted) return null

    // Dynamic Theme References
    // Replaced hardcoded colors with CSS variables injected by PublicMenuClient
    const THEME = {
        bg: "bg-background",
        activeTab: "bg-primary text-primary-foreground", // Was purple
        inactiveTab: "bg-muted text-muted-foreground", // Was teal light
        headerText: "text-foreground",
        bodyText: "text-muted-foreground",
        price: "text-primary", // Was purple
        waiterButton: "bg-accent text-primary-foreground", // Was teal
        card: "bg-card border-border",
        input: "bg-white border-input"
    }

    const heroImage = restaurantInfo.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"

    return (
        <div className={`flex flex-col min-h-screen font-sans relative pb-24 ${THEME.bg}`}>

            {/* --- HERO --- */}
            <div className="p-4">
                <div
                    className="w-full aspect-[4/3] rounded-[2.5rem] bg-cover bg-center relative overflow-hidden shadow-lg mx-auto max-w-md"
                    style={{ backgroundImage: `url("${heroImage}")` }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>

                    <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8">
                        <h1 className="text-4xl text-white font-bold leading-none drop-shadow-md" style={{ fontFamily: "var(--font-heading)" }}>
                            {restaurantInfo.name || "Büyülü Tatlar Dünyası"}
                        </h1>
                    </div>
                </div>
            </div>
            {/* --- SOCIAL BUTTONS --- */}
            {(restaurantInfo.instagramUrl || restaurantInfo.googleMapsUrl) && (
                <div className="px-6 mb-2 flex gap-3">
                    {restaurantInfo.instagramUrl && (
                        <a
                            href={restaurantInfo.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 ${THEME.card} bg-card p-3 rounded-2xl shadow-sm border flex items-center justify-center gap-2 ${THEME.headerText} font-bold text-sm hover:opacity-80 transition-colors`}
                        >
                            <Instagram className="w-5 h-5 text-pink-500" />
                            Instagram
                        </a>
                    )}
                    {restaurantInfo.googleMapsUrl && (
                        <a
                            href={restaurantInfo.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 ${THEME.card} bg-card p-3 rounded-2xl shadow-sm border flex items-center justify-center gap-2 ${THEME.headerText} font-bold text-sm hover:opacity-80 transition-colors`}
                        >
                            <MapPin className="w-5 h-5 text-blue-500" />
                            Yorumlar
                        </a>
                    )}
                </div>
            )}

            {/* --- NAVIGATION --- */}
            <div className={`sticky top-0 z-40 py-4 ${THEME.bg}/95 backdrop-blur-sm`}>
                <div className="flex overflow-x-auto no-scrollbar px-4 gap-3">
                    {activeCategories.map((cat) => {
                        const isActive = activeTab === cat.id
                        return (
                            <button
                                key={cat.id}
                                onClick={() => scrollToCategory(cat.id)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-sm",
                                    isActive
                                        ? `${THEME.activeTab} shadow-md transform scale-105`
                                        : `${THEME.inactiveTab}`
                                )}
                            >
                                {isActive && <span className="text-lg">ForkIcon</span> && <span className="w-4 h-4 mr-1">🍴</span>}
                                {cat.name}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* --- CATEGORIES & PRODUCTS --- */}
            <div className="px-5 space-y-8 min-h-[50vh]">
                {activeCategories.filter(c => c.id === activeTab).map((cat) => (
                    <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Category Header */}
                        <h2 className={`text-3xl font-bold ${THEME.headerText} mb-4 pl-1`} style={{ fontFamily: "var(--font-heading)" }}>
                            {cat.name}
                        </h2>

                        {/* Product Cards */}
                        <div className="space-y-4">
                            {cat.products.filter((p: any) => p.isActive).map((product: any) => (
                                <div
                                    key={product.id}
                                    className={`bg-card p-4 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-border flex items-center gap-4 transition-transform`}
                                >
                                    {/* Circular Image */}
                                    <div className="w-20 h-20 shrink-0 rounded-full bg-muted overflow-hidden border-2 border-white shadow-sm">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <span className="text-xs">No Img</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                                        <h3 className={`text-2xl font-bold ${THEME.headerText} leading-tight break-words whitespace-normal text-wrap pr-2`} style={{ fontFamily: "var(--font-heading)" }}>
                                            {product.name}
                                        </h3>
                                        <p className={`text-xs ${THEME.bodyText} font-medium mt-1 font-sans break-words whitespace-normal text-wrap`} style={{ fontFamily: "var(--font-body)" }}>
                                            {product.description}
                                        </p>
                                        <div className="mt-2">
                                            <span className={`text-lg font-bold ${THEME.price}`}>
                                                ₺{product.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- FIXED WAITER BUTTON --- */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <button
                    onClick={() => {
                        if (hasCalled) {
                            toast.success("Garson çağrıldı.", {
                                style: { backgroundColor: 'var(--accent)', color: 'white', border: 'none' }
                            })
                            return
                        }
                        handleDirectCall()
                    }}
                    className={`w-full py-4 rounded-full ${THEME.waiterButton} text-xl font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform`}
                >
                    <Bell className="w-6 h-6" />
                    Garson Çağır
                </button>
            </div>

            {/* --- WAITER MODAL --- */}
            {isWaiterModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        onClick={() => setIsWaiterModalOpen(false)}
                    />
                    <div className={`fixed bottom-6 left-6 right-6 z-[70] ${THEME.bg} rounded-[2rem] p-6 shadow-2xl border-t-4 border-accent`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-2xl font-bold ${THEME.headerText}`} style={{ fontFamily: "var(--font-heading)" }}>Masayı Bildirin</h3>
                            <button
                                onClick={() => setIsWaiterModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:opacity-80 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2 ml-1">Masa Numaranız</label>
                                <input
                                    type="text"
                                    value={tableNo}
                                    onChange={(e) => setTableNo(e.target.value)}
                                    placeholder="Örn: 5"
                                    className={`w-full p-4 rounded-xl border border-input ${THEME.input} text-lg font-bold ${THEME.headerText} focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:font-normal`}
                                />
                            </div>

                            <button
                                onClick={handleCall}
                                disabled={waiterLoading || !tableNo}
                                className={`w-full py-4 rounded-xl ${THEME.waiterButton} text-lg font-bold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100`}
                            >
                                {waiterLoading ? 'Bildiriliyor...' : 'Garsonu Çağır'}
                            </button>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
