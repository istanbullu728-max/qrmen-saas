"use client"

import { useMemo } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, ShoppingBag } from "lucide-react"

type Product = {
    id: string
    name: string
    price: number
    description?: string
    isActive: boolean
    imageUrl?: string
    suggestedProductIds?: string[]
}

type Category = {
    id: string
    name: string
    isActive: boolean
    products: Product[]
}

interface ProductDetailModalProps {
    isOpen: boolean
    onClose: () => void
    product: Product | null
    allCategories: Category[]
    onAddSuggested: (product: Product) => void // Could link to a cart or just close for now
}

export function ProductDetailModal({ isOpen, onClose, product, allCategories, onAddSuggested }: ProductDetailModalProps) {
    if (!product) return null

    // Logic to find related products
    const relatedProducts = useMemo(() => {
        let suggested: Product[] = []

        // 1. Manual Suggestions
        if (product.suggestedProductIds && product.suggestedProductIds.length > 0) {
            const allProducts = allCategories.flatMap(c => c.products)
            suggested = allProducts.filter(p => product.suggestedProductIds?.includes(p.id))
        }

        // 2. Fallback: Same Category Popular items (if manual is empty)
        if (suggested.length === 0) {
            const sameCategory = allCategories.find(c => c.products.some(p => p.id === product.id))
            if (sameCategory) {
                // Get other products from same category, exclude self
                suggested = sameCategory.products
                    .filter(p => p.id !== product.id && p.isActive)
                    .slice(0, 3) // Take top 3
            }
        }

        return suggested
    }, [product, allCategories])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background border-0 shadow-2xl rounded-[32px] gap-0 outline-none">
                <DialogTitle className="sr-only">{product.name} Detayı</DialogTitle>

                {/* Product Image Header */}
                <div className="relative h-72 bg-muted overflow-hidden">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 bg-muted/50">
                            <span className="text-4xl font-black">{product.name.charAt(0)}</span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center text-white active-scale transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-6 left-6 pr-6">
                        <span className="bg-primary px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-tighter shadow-lg">
                            Şefin Tavsiyesi
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div className="min-w-0 pr-4">
                            <h2 className="text-2xl font-black text-foreground leading-tight tracking-tight mb-1">{product.name}</h2>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Şu an serviste</span>
                            </div>
                        </div>
                        <span className="text-2xl font-black text-primary block shrink-0">₺{product.price.toFixed(0)}</span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 opacity-80 font-medium">
                        {product.description || "Bu eşsiz lezzetimiz, taze malzemeler ve şefimizin özel dokunuşlarıyla hazırlanmıştır."}
                    </p>

                    {/* Suggestions Section */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-border/50">
                            <h3 className="text-xs font-black text-foreground mb-4 uppercase tracking-widest flex items-center gap-2 opacity-60">
                                Yanına Çok Yakışır
                            </h3>

                            {/* Horizontal Scroll Area */}
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-8 px-8 no-scrollbar snap-x">
                                {relatedProducts.map(rel => (
                                    <div
                                        key={rel.id}
                                        className="snap-start shrink-0 w-36 flex flex-col gap-3 group cursor-pointer active-scale"
                                        onClick={() => onAddSuggested(rel)}
                                    >
                                        <div className="w-36 h-28 rounded-2xl bg-muted overflow-hidden relative border border-border/50 shadow-sm transition-shadow group-hover:shadow-md">
                                            {rel.imageUrl && (
                                                <img src={rel.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            )}
                                            <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-xl rounded-lg px-2 py-0.5 text-[10px] font-black shadow-sm">
                                                ₺{rel.price.toFixed(0)}
                                            </div>
                                        </div>
                                        <div className="px-1">
                                            <h4 className="text-xs font-black text-foreground leading-tight line-clamp-2 uppercase tracking-tighter opacity-80">{rel.name}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
