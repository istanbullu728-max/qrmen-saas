"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Search, MapPin, Phone, MessageCircle, Instagram, Globe } from "lucide-react"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
    language?: 'tr' | 'en'
}

export function TemplateElegant({ data, restaurantInfo, activeCategories, onProductClick, language = 'tr' }: TemplateProps) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    // Beige/Sand Theme
    const THEME = {
        bg: "bg-[#EAE0D5]", // Soft beige/sand
        card: "bg-white",
        text: "text-[#3E2723]", // Dark brown
        accent: "text-[#8D6E63]",
    }

    // Scroll to category function
    const handleCategoryClick = (catId: string) => {
        setSelectedCategory(catId)
        const el = document.getElementById(`cat-${catId}`)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-serif pb-32`}>

            {/* Header */}
            <header className="px-6 pt-12 pb-6 text-center space-y-4 relative z-10">
                {/* Icons Top Right */}
                <div className="flex justify-end gap-3 mb-2 absolute top-6 right-6">
                    {restaurantInfo.instagramUrl && (
                        <div className="w-8 h-8 rounded-full bg-[#D7CCC8]/50 flex items-center justify-center text-[#5D4037]">
                            <Instagram size={16} />
                        </div>
                    )}
                    <div className="w-8 h-8 rounded-full bg-[#D7CCC8]/50 flex items-center justify-center text-[#5D4037]">
                        <Globe size={16} />
                    </div>
                </div>

                <div className="pt-8">
                    {/* Removed "A TASTE OF HOME" as requested (duplicate/small text) */}
                    <h1 className="text-4xl font-medium tracking-tight mb-4 text-[#3E2723]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {restaurantInfo.name}
                    </h1>
                </div>

                {/* Language Dropdown Mockup */}
                <div className="inline-flex items-center bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-sans font-medium border border-[#D7CCC8] text-[#5D4037]">
                    {language === 'tr' ? 'Türkçe' : 'English'}
                </div>
            </header>

            {/* Categories List */}
            <main className="px-5 space-y-4 pb-32 relative z-10">
                {activeCategories.map((cat, idx) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="relative h-36 bg-white rounded-[1.5rem] overflow-hidden flex shadow-sm cursor-pointer group border border-[#D7CCC8]/30"
                    >
                        {/* Text Side (Left) - Expanded width and z-index */}
                        <div className="flex-1 pl-6 pr-2 flex flex-col justify-center relative z-20 h-full">
                            <h2 className="text-2xl font-bold text-[#3E2723] leading-none drop-shadow-sm pr-4 break-words" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {cat.name}
                            </h2>
                        </div>

                        {/* Image Side (Right) - Adjusted mask and width */}
                        <div className="absolute right-0 top-0 bottom-0 w-[55%] z-10">
                            {/* Stronger Gradient for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10" />
                            <img
                                src={cat.imageUrl || `https://images.unsplash.com/photo-1544025162-d7669d26563d?auto=format&fit=crop&q=80&w=400&h=300`}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                alt={cat.name}
                            />
                        </div>
                    </motion.div>
                ))}
            </main>

            {/* Selected Category Products Modal */}
            {selectedCategory && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end justify-center" onClick={() => setSelectedCategory(null)}>
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="bg-[#FDFBF7] w-full rounded-t-[2.5rem] max-h-[85vh] overflow-y-auto relative shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="sticky top-0 left-0 right-0 bg-[#FDFBF7] pt-6 pb-4 px-6 z-20 flex flex-col items-center border-b border-[#D7CCC8]/30">
                            <div className="w-12 h-1.5 bg-[#D7CCC8] rounded-full mb-4" />
                            <h2 className="text-2xl font-bold text-[#3E2723] text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {activeCategories.find(c => c.id === selectedCategory)?.name}
                            </h2>
                        </div>

                        <div className="p-6 space-y-4 pb-12">
                            {activeCategories.find(c => c.id === selectedCategory)?.products.filter((p: any) => p.isActive).map((product: any) => (
                                <div
                                    key={product.id}
                                    onClick={() => onProductClick(product.id)}
                                    className="bg-white p-4 rounded-2xl flex gap-4 items-start shadow-sm border border-[#F5F5F5]"
                                >
                                    <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} className="w-full h-full object-cover" />
                                        ) : <div className="w-full h-full bg-[#EAE0D5] flex items-center justify-center text-[#8D6E63] text-xs">No Image</div>}
                                    </div>
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-lg leading-tight text-[#3E2723] mb-1">{product.name}</h3>
                                            <span className="font-bold text-[#5D4037] whitespace-nowrap bg-[#EAE0D5]/50 px-2 py-1 rounded-lg text-sm">{product.price}₺</span>
                                        </div>
                                        <p className="text-sm text-[#8D6E63] line-clamp-2 leading-relaxed">{product.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    )
}
