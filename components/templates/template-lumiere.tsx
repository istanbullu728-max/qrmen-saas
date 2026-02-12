"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
    tableId?: string
}

export function TemplateLumiere({ data, restaurantInfo, activeCategories, onProductClick, tableId }: TemplateProps) {
    const [activeTab, setActiveTab] = useState(activeCategories[0]?.id)
    const [mounted, setMounted] = useState(false)
    const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false) // Waiter Modal State
    const [waiterLoading, setWaiterLoading] = useState(false)
    const [hasCalled, setHasCalled] = useState(false)
    const [tableNo, setTableNo] = useState("")

    useEffect(() => {
        setMounted(true)
    }, [])

    // Waiter Logic from Pastel ported here for Lumiere since it has custom footer
    const handleDirectCall = async () => {
        if (!tableId) {
            // Fallback to internal simple prompt or modal
            // For Lumiere, let's use a simple prompt for speed as it didn't have a modal
            const input = prompt("Lütfen masa numaranızı giriniz:")
            if (!input) return
            callWithTable(input)
            return
        }
        callWithTable(tableId)
    }

    const callWithTable = async (tId: string) => {
        setWaiterLoading(true)
        try {
            // Using createWaiterCall imported from actions (need to import)
            const { createWaiterCall } = await import("@/app/actions")
            await createWaiterCall({
                tableId: `Masa ${tId}`,
                type: 'GENEL',
                note: 'Garson Çağrısı'
            })
            // Using sonner toast (need to import)
            const { toast } = await import("sonner")
            toast.success("Garsona haber verildi.", {
                description: `Masa ${tId} için talebiniz iletildi.`,
            })
            setHasCalled(true)
        } catch (error) {
            console.error(error)
        } finally {
            setWaiterLoading(false)
        }
    }


    // Smooth scroll handler
    const scrollToCategory = (catId: string) => {
        setActiveTab(catId)
        const element = document.getElementById(`cat-${catId}`)
        if (element) {
            // Internal scroll container logic
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    if (!mounted) return null

    // Exact Colors from user snippet
    const COLORS = {
        lavender: "#E6E6FA",
        mint: "#E0F2F1",
        peach: "#FFDAB9",
        softPurple: "#9370DB",
        softTeal: "#4DB6AC",
        playfulBg: "#FDFCF0",
        textMain: "#4A4A4A",
        accentPink: "#FFB6C1"
    }

    const heroImage = restaurantInfo.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"

    return (
        // Changed min-h-screen to h-full to fit within the preview container properly
        <div className="flex flex-col h-full font-sans relative text-[#4A4A4A] overflow-hidden" style={{ backgroundColor: COLORS.playfulBg }}>
            {/* Inject External Resources */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Nunito:wght@400;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

                body {
                    font-family: 'Nunito', sans-serif;
                }
                h1, h2, h3, .font-display {
                    font-family: 'Kalam', cursive;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .soft-shadow {
                    box-shadow: 0 10px 25px rgba(0,0,0,0.03);
                }
                .bubbly-card {
                    transition: transform 0.2s ease;
                }
                .bubbly-card:active {
                    transform: scale(0.98);
                }
                .category-pill {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col pt-4">
                {/* --- HERO SECTION --- */}
                <div className="px-4 pb-4">
                    <div
                        className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-[32px] min-h-[220px] shadow-sm relative active-scale"
                        style={{ backgroundImage: `url("${heroImage}")` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="relative p-6">
                            <span className="inline-block px-3 py-1 text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-2 shadow-sm" style={{ backgroundColor: COLORS.accentPink }}>
                                HOŞGELDİNİZ
                            </span>
                            <h1 className="text-3xl font-bold text-white leading-tight">
                                {restaurantInfo.name || "Büyülü Tatlar Dünyası"}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* --- STICKY NAV --- */}
                <div className="sticky top-0 z-40 py-4 backdrop-blur-xl border-b border-border/10">
                    <div className="flex overflow-x-auto no-scrollbar px-4 gap-3">
                        {activeCategories.map((cat, index) => {
                            const isActive = activeTab === cat.id

                            const colorSchemes = [
                                { activeBg: 'var(--primary)', activeText: 'var(--primary-foreground)' },
                                { activeBg: '#4DB6AC', activeText: 'white' },
                                { activeBg: '#9370DB', activeText: 'white' },
                                { activeBg: '#FBBF24', activeText: 'white' }
                            ]

                            const theme = colorSchemes[index % colorSchemes.length]

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => scrollToCategory(cat.id)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all active-scale shadow-sm border border-border/50",
                                        isActive ? "shadow-md scale-105" : "bg-white/50 backdrop-blur-sm"
                                    )}
                                    style={isActive ? { backgroundColor: theme.activeBg, color: theme.activeText } : {}}
                                >
                                    {cat.name}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* --- PRODUCTS LIST --- */}
                <div className="px-4 pt-6 pb-20">
                    {activeCategories.map((cat) => (
                        <div key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-24">
                            {/* Category Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold tracking-tight" style={{ color: COLORS.textMain }}>{cat.name}</h2>
                                <div className="h-px flex-1 bg-border/30"></div>
                            </div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 gap-5">
                                {cat.products.filter((p: any) => p.isActive).map((product: any, idx: number) => {
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => onProductClick(product.id)}
                                            className="premium-card relative flex items-center p-3 cursor-pointer group"
                                        >
                                            <div
                                                className="w-24 h-24 shrink-0 bg-cover bg-center rounded-2xl shadow-sm overflow-hidden"
                                                style={{
                                                    backgroundImage: `url("${product.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}")`,
                                                }}
                                            />
                                            <div className="flex-1 ml-4 min-w-0 pr-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-base leading-tight text-foreground truncate">
                                                        {product.name}
                                                    </h3>
                                                    <span className="font-bold text-primary whitespace-nowrap">
                                                        ₺{product.price.toFixed(0)}
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </p>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="h-5 px-2 rounded-full bg-primary/5 text-primary text-[10px] font-bold flex items-center">
                                                        Popüler 🔥
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- WAITER BUTTON (Footer) --- */}
            {/* Changed to Absolute so it stays within the relative parent (phone frame) */}
            <footer className="absolute bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FDFCF0] via-[#FDFCF0]/95 to-transparent -z-10"></div>
                <div className="max-w-md mx-auto relative pointer-events-auto">
                    <button
                        onClick={handleDirectCall}
                        disabled={waiterLoading}
                        className="w-full h-16 rounded-[2rem] text-white font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl bubbly-card active:scale-95 transition-transform"
                        style={{
                            backgroundColor: COLORS.softTeal,
                            boxShadow: `0 15px 30px -8px ${COLORS.softTeal}66`
                        }}
                    >
                        {/* Bell Icon Removed per request */}
                        <span>{waiterLoading ? 'Bildiriliyor...' : 'Garson Çağır'}</span>
                    </button>
                </div>
            </footer>
        </div>
    )
}
