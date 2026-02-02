"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, MessageCircle, Star, Search, Plus, Bell, ChefHat, X } from "lucide-react"
import { createWaiterCall } from "@/app/actions"
import { toast } from "sonner"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
    tableId?: string
}

export function TemplateNature({ data, restaurantInfo, activeCategories, onProductClick, tableId }: TemplateProps) {
    const [activeTab, setActiveTab] = useState(activeCategories[0]?.id)

    // Waiter Call State (Pastel Logic)
    const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false)
    const [waiterLoading, setWaiterLoading] = useState(false)
    const [hasCalled, setHasCalled] = useState(false)
    const [tableNo, setTableNo] = useState("")

    const scrollToCategory = (catId: string) => {
        setActiveTab(catId)
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
                style: { backgroundColor: '#5D6D3A', color: 'white', border: 'none' }
            })
            setIsWaiterModalOpen(false)
            setHasCalled(true)
        } catch (error) {
            toast.error("Bir sorun oluştu.")
        } finally {
            setWaiterLoading(false)
        }
    }

    const handleButtonClick = () => {
        if (hasCalled) {
            toast.success("Garson çağrıldı.")
            return
        }

        if (tableId) {
            // If tableId exists, skip modal and call directly
            handleCall()
        } else {
            // Else open modal
            setIsWaiterModalOpen(true)
        }
    }

    // Dynamic Theme References
    // Instead of hardcoded colors, we use Tailwind classes that map to the injected CSS vars
    const THEME = {
        bg: "bg-background",
        headerBg: "bg-muted",
        accent: "text-accent",
        primary: "text-foreground",
        secondary: "text-muted-foreground",
        cardBg: "bg-card",
        buttonGreen: "bg-primary text-primary-foreground",
        buttonBrown: "bg-secondary text-secondary-foreground",
    }

    return (
        <div className={`min-h-screen ${THEME.bg} font-sans pb-32 relative`}>

            {/* --- HEADER SECTION --- */}
            <div className="relative w-full h-[280px] rounded-b-[40px] overflow-hidden shadow-xl z-10">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src={restaurantInfo.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop"}
                    className="w-full h-full object-cover"
                    alt="Restaurant Cover"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-6 pt-12">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-handwriting text-5xl text-white drop-shadow-lg transform -rotate-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {restaurantInfo.name || "Doğadan Masanıza"}
                    </motion.h1>
                </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex gap-4 px-6 -mt-6 relative z-30 justify-center">
                <a
                    href={restaurantInfo.instagramUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!restaurantInfo.instagramUrl) { e.preventDefault(); alert("Instagram adresi tanımlanmamış.") } }}
                    className={`${THEME.buttonBrown} flex-1 py-3 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm font-semibold active:scale-95 transition-transform`}
                >
                    <Instagram size={18} />
                    <span>Instagram</span>
                </a>
                <a
                    href={restaurantInfo.googleMapsUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { if (!restaurantInfo.googleMapsUrl) { e.preventDefault(); alert("Yorum linki tanımlanmamış.") } }}
                    className={`${THEME.buttonBrown} flex-1 py-3 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm font-semibold active:scale-95 transition-transform`}
                >
                    <MessageCircle size={18} />
                    <span>Yorum Yaz</span>
                </a>
            </div>

            {/* --- CATEGORY NAVIGATION (CIRCLES) --- */}
            <div className="mt-8 px-4 overflow-x-auto no-scrollbar py-2">
                <div className="flex gap-4">
                    {activeCategories.map((cat, index) => (
                        <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[80px]" onClick={() => scrollToCategory(cat.id)}>
                            <div className={cn(
                                "w-20 h-20 rounded-full overflow-hidden border-2 shadow-md transition-all duration-300 relative",
                                activeTab === cat.id
                                    ? "border-accent scale-105 ring-2 ring-accent/20"
                                    : "border-transparent opacity-80"
                            )}>
                                {/* Placeholder for category image if missing */}
                                <img
                                    src={cat.imageUrl || `https://source.unsplash.com/random/100x100?food,${index}`}
                                    className="w-full h-full object-cover"
                                    alt={cat.name}
                                    onError={(e) => {
                                        // Fallback if image fails
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100&h=100"
                                    }}
                                />
                            </div>
                            <span className={cn(
                                "text-sm font-medium transition-colors",
                                activeTab === cat.id ? "text-accent font-bold" : "text-muted-foreground"
                            )}>
                                {cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CONTENT --- */}
            <main className="px-5 mt-8 space-y-10 min-h-[400px]">
                {activeCategories.filter(cat => cat.id === activeTab).map((cat) => (
                    <motion.section
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="scroll-mt-32"
                    >
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <h2
                                className="text-3xl text-accent transform -rotate-2"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                {cat.name}
                            </h2>
                            <div className="h-px bg-border flex-1 mt-2"></div>
                        </div>

                        <div className="space-y-4">
                            {cat.products.filter((p: any) => p.isActive).map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    theme={THEME}
                                    onClick={() => onProductClick(product.id)}
                                />
                            ))}
                        </div>
                    </motion.section>
                ))}
            </main>

            {/* --- FIXED WAITER FULL WIDTH BUTTON --- */}
            <div className="fixed bottom-6 inset-x-4 z-50">
                <button
                    onClick={handleButtonClick}
                    className={`${THEME.buttonGreen} w-full py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-bold text-lg active:scale-[0.98] transition-all`}
                >
                    <Bell size={24} fill="currentColor" />
                    <span>Garson Çağır</span>
                </button>
            </div>

            {/* --- WAITER MODAL --- */}
            <AnimatePresence>
                {isWaiterModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                            onClick={() => setIsWaiterModalOpen(false)}
                        />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-6 left-4 right-4 z-[70] bg-background rounded-[2rem] p-6 shadow-2xl border border-border"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Masayı Bildirin</h3>
                                <button
                                    onClick={() => setIsWaiterModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
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
                                        className="w-full p-4 rounded-xl border border-input bg-card text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:font-normal placeholder:text-muted-foreground/50"
                                    />
                                </div>

                                <button
                                    onClick={handleCall}
                                    disabled={waiterLoading || !tableNo}
                                    className={`w-full py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100 ${THEME.buttonGreen}`}
                                >
                                    {waiterLoading ? 'Bildiriliyor...' : 'Garsonu Çağır'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function ProductCard({ product, theme, onClick }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onClick={onClick}
            className={`
                group relative w-full ${theme.cardBg} rounded-[2rem] p-3 flex gap-4 overflow-hidden 
                shadow-sm border border-border cursor-pointer active:scale-[0.99] transition-all duration-300
            `}
        >
            {/* Image (Square with rounded corners) */}
            <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-muted shadow-inner">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        alt={product.name}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ChefHat size={24} />
                    </div>
                )}
            </div>

            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center py-1">
                <div className="flex justify-between items-start">
                    <h3 className={`${theme.primary} font-bold text-lg leading-tight mb-1`} style={{ fontFamily: "var(--font-heading)" }}>{product.name}</h3>
                </div>

                <p className={`${theme.secondary} text-xs line-clamp-2 leading-relaxed mb-3`} style={{ fontFamily: "var(--font-body)" }}>
                    {product.description || "Lezzetli bir seçim, taze malzemelerle hazırlanmıştır."}
                </p>

                <div className="flex items-center justify-between">
                    <span className={`${theme.accent} font-bold text-xl`}>
                        ₺{product.price}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}
