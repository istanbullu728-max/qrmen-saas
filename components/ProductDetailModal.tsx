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
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl gap-0">
                <DialogTitle className="sr-only">{product.name} Detayı</DialogTitle>

                {/* Product Image Header */}
                <div className="relative h-64 bg-slate-100">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                            <span className="text-3xl font-bold opacity-20">{product.name.charAt(0)}</span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{product.name}</h2>
                        <span className="text-xl font-bold text-indigo-600 block shrink-0 ml-4">{product.price}₺</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        {product.description || "Lezzetli bir seçim."}
                    </p>

                    {/* Suggestions Section */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-6 border-t border-slate-100 pt-6">
                            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-yellow-400 rounded-full inline-block"></span>
                                Yanına Çok Yakışır
                            </h3>

                            {/* Horizontal Scroll Area */}
                            <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x">
                                {relatedProducts.map(rel => (
                                    <div
                                        key={rel.id}
                                        className="snap-start shrink-0 w-32 flex flex-col gap-2 group cursor-pointer"
                                        onClick={() => onAddSuggested(rel)} // For now, maybe just switch to that product? Or add to 'cart' (not implemented yet)
                                    >
                                        <div className="w-32 h-24 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-100">
                                            {rel.imageUrl && (
                                                <img src={rel.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            )}
                                            <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur rounded px-1.5 text-[10px] font-bold shadow-sm">
                                                {rel.price}₺
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-slate-700 leading-tight line-clamp-2">{rel.name}</h4>
                                        </div>
                                        <button className="text-[10px] py-1 bg-indigo-50 text-indigo-700 font-bold rounded flex items-center justify-center gap-1 hover:bg-indigo-100 transition-colors">
                                            <ShoppingBag size={10} />
                                            Ekle
                                        </button>
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
