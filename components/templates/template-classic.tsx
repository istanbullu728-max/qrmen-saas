"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Camera, Star, Utensils, Bell, Plus, ShoppingBag } from "lucide-react"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
}

export function TemplateClassic({ data, restaurantInfo, activeCategories, onProductClick }: TemplateProps) {
    const [activeCatId, setActiveCatId] = useState(activeCategories[0]?.id)

    // Auto-scroll handler
    const handleCategoryClick = (id: string) => {
        setActiveCatId(id)
        document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const THEME = {
        primary: "bg-primary",
        textPrimary: "text-primary",
    }

    // Featured Item (Mockup: Just take first image available)
    const featuredImage = restaurantInfo.coverImage || activeCategories[0]?.products[0]?.imageUrl

    return (
        <div className="min-h-screen bg-transparent font-sans pb-28 text-foreground selection:bg-primary/20">

            {/* --- HEADER --- */}
            <header className="bg-card/90 backdrop-blur-md px-5 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40 border-b border-border/10">
                <div className="flex items-center gap-3">
                    <Utensils className="w-6 h-6 text-primary" />
                    <h1 className="text-lg font-bold text-foreground tracking-tight">{restaurantInfo.name}</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                    <Search className="w-5 h-5" />
                </div>
            </header>

            <main className="p-5 space-y-6">

                {/* --- HERO BANNER --- */}
                <div className="relative w-full h-48 rounded-[2rem] overflow-hidden shadow-lg group">
                    <img
                        src={featuredImage}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        alt="Featured"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-2">YENİ SEZON</span>
                        <h2 className="text-white text-2xl font-bold leading-none">Özel Lezzetler</h2>
                    </div>
                </div>

                {/* --- ACTION PILLS --- */}
                <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                    <button className="flex-1 min-w-[100px] bg-card py-3 rounded-xl border border-border/10 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground/80">
                        <Camera className="w-4 h-4 text-primary" /> Instagram
                    </button>
                    <button className="flex-1 min-w-[130px] bg-card py-3 rounded-xl border border-border/10 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground/80">
                        <Star className="w-4 h-4 text-primary" /> Google Yorumlar
                    </button>
                </div>

                {/* --- NAV TABS --- */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sticky top-[72px] z-30 py-2 -mx-5 px-5 bg-background/50 backdrop-blur-sm">
                    <button className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20">Menü</button>
                    <button className="px-6 py-2 rounded-full bg-card text-muted-foreground text-sm font-semibold border border-border/10">Sepet</button>
                    <button className="px-6 py-2 rounded-full bg-card text-muted-foreground text-sm font-semibold border border-border/10">İletişim</button>
                </div>

                {/* --- CATEGORY TABS (Secondary) --- */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide border-b border-border/10">
                    {activeCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={cn(
                                "whitespace-nowrap text-sm font-bold transition-colors",
                                activeCatId === cat.id ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* --- PRODUCTS LIST --- */}
                <div className="space-y-12">
                    {activeCategories.map(cat => (
                        <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-40">

                            <div className="flex justify-between items-baseline mb-4">
                                <h3 className="text-xl font-bold text-foreground">{cat.name}</h3>
                                <span className="text-xs font-bold text-primary cursor-pointer">TÜMÜNÜ GÖR</span>
                            </div>

                            <ProductGroupRenderer category={cat} onProductClick={onProductClick} />

                        </div>
                    ))}
                </div>

            </main>

            {/* --- BOTTOM FLOATING BAR --- */}
            <div className="fixed bottom-6 left-6 right-6 z-50 flex gap-4">
                <button className="w-14 h-14 bg-card rounded-2xl shadow-lg flex items-center justify-center text-muted-foreground border border-border/10">
                    <ShoppingBag className="w-6 h-6" />
                </button>
                <button className="flex-1 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 font-bold text-lg">
                    <Bell className="w-5 h-5" /> Garson Çağır
                </button>
            </div>

        </div>
    )
}

function ProductGroupRenderer({ category, onProductClick }: any) {
    const groups: { [key: string]: any[] } = {}
    const noSection: any[] = []

    category.products.filter((p: any) => p.isActive).forEach((p: any) => {
        if (p.sectionName && p.sectionName.trim() !== '') {
            if (!groups[p.sectionName]) groups[p.sectionName] = []
            groups[p.sectionName].push(p)
        } else {
            noSection.push(p)
        }
    })

    return (
        <div className="space-y-4">
            {/* No Section Items */}
            {noSection.map(p => <ProductItem key={p.id} product={p} onClick={onProductClick} />)}

            {/* Sections */}
            {Object.entries(groups).map(([name, products]) => (
                <div key={name} className="pt-4">
                    <h4 className="text-sm font-bold text-muted-foreground uppercase mb-3">{name}</h4>
                    <div className="space-y-4">
                        {products.map(p => <ProductItem key={p.id} product={p} onClick={onProductClick} />)}
                    </div>
                </div>
            ))}
        </div>
    )
}

function ProductItem({ product, onClick }: any) {
    return (
        <div
            onClick={() => onClick(product.id)}
            className="bg-card p-3 rounded-2xl shadow-sm border border-border/10 flex gap-4 cursor-pointer hover:border-primary/20 transition-colors"
        >
            <div className="w-24 h-24 rounded-xl bg-muted/20 flex-shrink-0 overflow-hidden">
                {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
            </div>

            <div className="flex-1 flex flex-col">
                <h4 className="font-bold text-foreground mb-1">{product.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{product.description}</p>

                <div className="mt-auto flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">{product.price.toFixed(2)}₺</span>
                    <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
