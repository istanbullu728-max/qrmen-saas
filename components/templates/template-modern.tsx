"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Star, Search, ChevronRight, ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
    language?: 'tr' | 'en'
}

export function TemplateModern({ data, restaurantInfo, activeCategories, onProductClick, language = 'tr' }: TemplateProps) {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
    const [activeTab, setActiveTab] = useState(activeCategories[0]?.id)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll Spy for Tabs
    useEffect(() => {
        const handleScroll = () => {
            // Simple interaction observer replacement for demo
        }
        // implementation detail
    }, [])

    const scrollToCategory = (catId: string) => {
        setActiveTab(catId)
        const el = document.getElementById(`cat-${catId}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    // Modern "Elite" Theme Colors - NOW DYNAMIC via CSS Variables
    const THEME = {
        bg: "bg-transparent", // Was bg-slate-950
        text: "text-foreground", // Was text-slate-50
        card: "bg-card/40", // Was bg-slate-900/50
        border: "border-border/10", // Was border-white/5
        accent: "bg-primary",
        accentText: "text-primary"
    }

    return (
        <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans pb-32 relative selection:bg-primary/30`}>

            {/* --- HEADER --- */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-12 pb-4 px-6 relative z-20"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-card/50 border border-border/10 flex items-center justify-center overflow-hidden">
                            {restaurantInfo.coverImage ? (
                                <img src={restaurantInfo.coverImage} className="w-full h-full object-cover" />
                            ) : (
                                <span className="font-serif font-bold text-primary">M</span>
                            )}
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-lg leading-tight tracking-tight text-foreground">{restaurantInfo.name}</h1>
                            <p className="text-xs text-muted-foreground font-medium">
                                {language === 'en' ? 'Fine Dining & Lounge' : 'Lezzet & Keyif'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-full bg-card/60 border border-border/10 flex items-center justify-center text-muted-foreground">
                            <Search size={16} />
                        </button>
                    </div>
                </div>

                {/* --- STICKY PILL NAV --- */}
                <div className="sticky top-4 z-40 -mx-6 px-6 overflow-x-auto no-scrollbar pb-4 pt-2">
                    <div className="flex items-center gap-2 w-max">
                        {activeCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => scrollToCategory(cat.id)}
                                className={cn(
                                    "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border backdrop-blur-md",
                                    activeTab === cat.id
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                        : "bg-slate-900/80 border-white/5 text-slate-400 hover:bg-slate-800"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.header>

            {/* --- CONTENT --- */}
            <main className="px-4 space-y-8">
                {activeCategories.map((cat) => (
                    <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-36">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <h2 className="text-xl font-serif font-bold text-foreground">{cat.name}</h2>
                            <div className="h-px bg-border/20 flex-1"></div>
                        </div>

                        <div className="space-y-4">
                            {cat.products.filter((p: any) => p.isActive).map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    theme={THEME}
                                    onClick={() => onProductClick(product.id)}
                                    language={language}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </main>

        </div>
    )
}

function ProductCard({ product, theme, onClick, language }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            onClick={onClick}
            className={cn(
                "group relative w-full bg-card/40 border border-border/10 rounded-[1.5rem] p-4 flex gap-4 overflow-hidden active:scale-[0.98] transition-transform duration-200 cursor-pointer backdrop-blur-sm",
                "hover:bg-card/60 hover:border-border/20"
            )}
        >
            {/* Gradient Glow on Hover */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Image */}
            <div className="w-24 h-24 rounded-2xl bg-muted/20 flex-shrink-0 overflow-hidden relative shadow-inner">
                {product.imageUrl ? (
                    <img src={product.imageUrl} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                        <ShoppingBag size={20} />
                    </div>
                )}
                {product.isFeatured && (
                    <div className="absolute top-0 left-0 bg-primary text-[10px] font-bold text-primary-foreground px-2 py-1 rounded-br-lg shadow">
                        {language === 'en' ? 'SPECIAL' : 'ÖZEL'}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                <div>
                    <h3 className="font-bold text-base text-foreground leading-tight mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-light">{product.description}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <span className="font-serif font-bold text-lg text-primary">{product.price}₺</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Plus size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
