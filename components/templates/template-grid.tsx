"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, MessageCircle, ChevronLeft, Bell, X, ChefHat } from "lucide-react"
import { createWaiterCall } from "@/app/actions"
import { toast } from "sonner"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
}

export function TemplateGrid({ data, restaurantInfo, activeCategories, onProductClick }: TemplateProps) {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null)

    // Waiter Call State
    const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false)
    const [waiterLoading, setWaiterLoading] = useState(false)
    const [hasCalled, setHasCalled] = useState(false)
    const [tableNo, setTableNo] = useState("")

    const handleCall = async () => {
        if (!tableNo) {
            toast.error("Lütfen masa numaranızı giriniz.")
            return
        }
        setWaiterLoading(true)
        try {
            await createWaiterCall({
                tableId: `Masa ${tableNo}`,
                type: 'GENEL',
                note: 'Garson Çağrısı'
            })
            toast.success("Garsona haber verildi.", {
                description: "En kısa sürede masanıza gelinecektir.",
                style: { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none' }
            })
            setIsWaiterModalOpen(false)
            setHasCalled(true)
        } catch (error) {
            toast.error("Bir sorun oluştu.")
        } finally {
            setWaiterLoading(false)
        }
    }

    // Dynamic Theme
    // Using simple semantic classes that map to the injected CSS vars
    const THEME = {
        bg: "bg-background",
        text: "text-foreground",
        accent: "text-accent",
        button: "bg-primary text-primary-foreground",
        muted: "bg-muted text-muted-foreground",
        card: "bg-card border-border",
        input: "bg-muted text-foreground border-input"
    }

    return (
        <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans pb-32 relative overflow-x-hidden`}>

            <AnimatePresence mode="wait">
                {!selectedCategory ? (
                    // --- HOME VIEW (Grid) ---
                    <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                    >
                        {/* Header Image */}
                        <div className="relative w-full h-[280px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src={restaurantInfo.coverImage || "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80"}
                                className="w-full h-full object-cover"
                                alt="Cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center">
                                <h1 className="text-4xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
                                    {restaurantInfo.name}
                                </h1>
                                <p className="text-white/80 text-sm uppercase tracking-widest font-medium" style={{ fontFamily: "var(--font-body)" }}>Hoşgeldiniz</p>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="flex gap-4 px-6 justify-center">
                            <a
                                href={restaurantInfo.instagramUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => { if (!restaurantInfo.instagramUrl) { e.preventDefault(); alert("Instagram adresi tanımlanmamış.") } }}
                                className={`flex-1 py-3 ${THEME.card} border rounded-xl flex items-center justify-center gap-2 text-sm font-bold ${THEME.text} active:scale-95 transition-transform`}
                            >
                                <Instagram size={18} />
                                <span>Instagram</span>
                            </a>
                            <a
                                href={restaurantInfo.googleMapsUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => { if (!restaurantInfo.googleMapsUrl) { e.preventDefault(); alert("Yorum linki tanımlanmamış.") } }}
                                className={`flex-1 py-3 ${THEME.card} border rounded-xl flex items-center justify-center gap-2 text-sm font-bold ${THEME.text} active:scale-95 transition-transform`}
                            >
                                <MessageCircle size={18} />
                                <span>Yorum Yaz</span>
                            </a>
                        </div>

                        {/* Category Grid */}
                        <div className="px-4 pb-8">
                            <h2 className="text-lg font-bold mb-4 px-1 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                                <div className={`w-1 h-6 bg-primary rounded-full`} />
                                Menü Kategorileri
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {activeCategories.map((cat, idx) => (
                                    <motion.div
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat)
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-md ${THEME.muted}`}
                                    >
                                        {/* Image */}
                                        <img
                                            src={cat.imageUrl || `https://source.unsplash.com/random/400x500?food,${idx}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300&h=400"
                                            }}
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                                        {/* Text Bottom Left */}
                                        <div className="absolute bottom-0 left-0 p-4 w-full">
                                            <h3 className="text-white text-lg font-bold leading-tight uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                                                {cat.name}
                                            </h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // --- DETAIL VIEW (List) ---
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                    >
                        {/* Sticky Header */}
                        <div className={`sticky top-0 z-40 ${THEME.bg}/80 backdrop-blur-md px-4 h-16 flex items-center justify-between border-b border-border mb-2`}>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-10 h-10 rounded-full ${THEME.muted} flex items-center justify-center hover:bg-muted/80 transition-colors`}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className="font-bold text-xl uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>{selectedCategory.name}</h2>
                            <div className="w-10" /> {/* Spacer for balance */}
                        </div>

                        {/* Product List */}
                        <div className="px-4 space-y-4 pb-8">
                            {selectedCategory.products.filter((p: any) => p.isActive).map((product: any, idx: number) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => onProductClick(product.id)}
                                    className={`flex ${THEME.card} border rounded-2xl p-3 shadow-sm gap-4 cursor-pointer active:scale-[0.99] transition-transform h-32`}
                                >
                                    {/* Image Left */}
                                    <div className={`w-28 h-full rounded-xl overflow-hidden flex-shrink-0 ${THEME.muted}`}>
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <ChefHat size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Right */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight mb-1" style={{ fontFamily: "var(--font-heading)" }}>{product.name}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{product.description}</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <span className={`font-bold text-lg ${THEME.muted} px-3 py-1 rounded-lg`}>
                                                ₺{product.price}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- FIXED BOARD WAITER BUTTON --- */}
            <div className="fixed bottom-6 inset-x-4 z-50">
                <button
                    onClick={() => {
                        if (hasCalled) {
                            toast.success("Garson çağrıldı.")
                            return
                        }
                        setIsWaiterModalOpen(true)
                    }}
                    className={`w-full py-4 ${THEME.button} rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold text-lg active:scale-[0.98] transition-all`}
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
                            className={`fixed bottom-6 left-4 right-4 z-[70] ${THEME.bg} rounded-[2rem] p-6 shadow-2xl`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>Masayı Bildirin</h3>
                                <button
                                    onClick={() => setIsWaiterModalOpen(false)}
                                    className={`w-8 h-8 rounded-full ${THEME.muted} flex items-center justify-center hover:opacity-80 transition-opacity`}
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
                                        className={`w-full p-4 rounded-xl border ${THEME.input} text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:font-normal placeholder:text-muted-foreground/50`}
                                    />
                                </div>

                                <button
                                    onClick={handleCall}
                                    disabled={waiterLoading || !tableNo}
                                    className={`w-full py-4 rounded-xl ${THEME.button} text-lg font-bold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100`}
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
