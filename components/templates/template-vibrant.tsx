"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Utensils, Plus, ChevronRight, Flame } from "lucide-react"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
}

export function TemplateVibrant({ data, restaurantInfo, activeCategories, onProductClick }: TemplateProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(activeCategories[0]?.id)

    // Auto-scroll to selected category section
    const scrollToCategory = (id: string) => {
        setSelectedCategory(id)
        const element = document.getElementById(`cat-${id}`)
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100
            window.scrollTo({ top: y, behavior: 'smooth' })
        }
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white font-sans pb-20 selection:bg-orange-500/30">

            {/* Header */}
            <header className="px-6 pt-8 pb-6 flex items-center justify-between sticky top-0 z-50 bg-[#111111]/80 backdrop-blur-md">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                        <Utensils size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none mb-1">{restaurantInfo.name}</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">QR MENU</p>
                    </div>
                </div>
            </header>

            {/* Top Categories (Horizontal Scroll) */}
            <section className="pl-6 mb-8">
                <div className="flex items-center justify-between pr-6 mb-4">
                    <h2 className="text-lg font-bold">Kategoriler</h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 pr-6 no-scrollbar">
                    {activeCategories.map((cat) => (
                        <motion.div
                            key={cat.id}
                            onClick={() => scrollToCategory(cat.id)}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "relative flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden cursor-pointer group",
                                selectedCategory === cat.id ? "ring-2 ring-orange-500" : ""
                            )}
                        >
                            <img
                                src={cat.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                alt={cat.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="text-sm font-bold block leading-tight">{cat.name}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Main Content (Products by Category) */}
            <main className="px-5 space-y-10">
                {activeCategories.map((cat) => (
                    <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-28">
                        <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                            {cat.name}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            {cat.products.filter((p: any) => p.isActive).map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => onProductClick(product.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </main>

        </div>
    )
}

function ProductCard({ product, onClick }: { product: any, onClick: () => void }) {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1a] rounded-[1.25rem] p-3 border border-white/5 cursor-pointer group"
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-[#222]">
                <img
                    src={product.imageUrl || "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80"}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.name}
                />
                {product.isFeatured && (
                    <div className="absolute top-2 right-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg backdrop-blur-sm">
                        POPÜLER
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-2">
                <div>
                    <h4 className="font-bold text-white text-[15px] leading-tight line-clamp-2 min-h-[2.5rem]">{product.name}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-medium">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <span className="text-orange-500 font-bold text-lg">{product.price}₺</span>
                    <button className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/20">
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
