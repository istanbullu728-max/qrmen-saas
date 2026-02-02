"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

type TemplateProps = {
    data: any[]
    restaurantInfo: any
    activeCategories: any[]
    onProductClick: (id: string) => void
}

export function TemplateMinimal({ data, restaurantInfo, activeCategories, onProductClick }: TemplateProps) {
    const [activeCatId, setActiveCatId] = useState<string>(activeCategories[0]?.id || "")

    return (
        <div className="min-h-screen bg-transparent text-foreground pb-32 font-sans selection:bg-primary selection:text-primary-foreground">

            {/* Header - Huge & Bold */}
            <header className="pt-20 pb-8 px-6">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 text-muted-foreground">Menu Collection 2026</p>
                <h1 className="text-5xl font-light tracking-tighter leading-none mb-0 break-words text-foreground">
                    {restaurantInfo.name}
                </h1>
            </header>

            {/* Minimal Sticky Nav */}
            <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/10 w-full">
                <ScrollArea className="w-full">
                    <div className="flex w-max px-6">
                        {activeCategories.map((cat, idx) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCatId(cat.id)}
                                className={cn(
                                    "mr-8 py-5 text-xs font-bold uppercase tracking-widest transition-all relative",
                                    activeCatId === cat.id
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className="mr-2 opacity-30 text-[9px]">0{idx + 1}</span>
                                {cat.name}
                                {activeCatId === cat.id && (
                                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Content Rules:
                1. Typography Focused
                2. Hairline layouts
                3. No photos in list view (Clean)
            */}
            <main className="px-6 pt-8 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {activeCategories
                        .filter(c => c.id === activeCatId)
                        .map(category => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                {/* Category Intro */}
                                <div className="max-w-xs">
                                    <p className="text-sm text-neutral-500 font-serif italic leading-relaxed">
                                        Seçkin malzemeler ve usta şeflerimizin dokunuşuyla hazırlanan {category.name.toLowerCase()} koleksiyonumuz.
                                    </p>
                                </div>

                                <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
                                    {category.products.filter((p: any) => p.isActive).map((product: any, idx: number) => (
                                        <div
                                            key={product.id}
                                            onClick={() => onProductClick(product.id)}
                                            className="group cursor-pointer"
                                        >
                                            <div className="flex items-baseline justify-between border-b border-border/10 pb-4 mb-3 transition-colors group-hover:border-border/30">
                                                <h3 className="text-xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
                                                    {product.name}
                                                </h3>
                                                <span className="font-mono text-base font-medium text-foreground opacity-60 group-hover:opacity-100">
                                                    {product.price}₺
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-start gap-4">
                                                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-[80%]">
                                                    {product.description}
                                                </p>
                                                <ArrowUpRight size={16} className="text-foreground opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                </AnimatePresence>
            </main>
        </div>
    )
}
