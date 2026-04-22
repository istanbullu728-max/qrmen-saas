"use client"
import { cn } from "@/lib/utils"

import { TemplateUltimate } from "./templates/template-ultimate"
import { AlertCircle } from "lucide-react"
import { WaiterCallButton } from "./WaiterCallButton"
import { CampaignPopup } from "./CampaignPopup"
import { useState, useMemo } from "react"
import { ProductDetailModal } from "./ProductDetailModal"

type Product = {
    id: string
    name: string
    price: number
    description?: string
    isActive: boolean
    imageUrl?: string
    viewCount?: number
    name_en?: string
    description_en?: string
}

type Category = {
    id: string
    name: string
    isActive: boolean
    products: Product[]
    name_en?: string
}

type RestaurantInfo = {
    name: string
    coverImage: string
    instagramUrl?: string
    googleMapsUrl?: string
    template?: string
    typography?: string
    colorPalette?: string
    texture?: string
    textureOpacity?: number
    baseFontWeight?: number
}

type Campaign = {
    id: string
    title: string
    description?: string
    price?: number
    isActive: boolean
}

export default function PublicMenuClientside({
    data,
    restaurantInfo,
    campaigns,
    className,
    tableId
}: {
    data: Category[],
    restaurantInfo: RestaurantInfo,
    campaigns: Campaign[],
    className?: string,
    tableId?: string
}) {
    // Filter only active categories with products
    const activeCategories = data.filter(c => c.isActive && c.products.length > 0)

    // Shared action
    // Shared action removed (duplicate)

    if (activeCategories.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-center text-muted-foreground">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full">
                    <AlertCircle className="mx-auto h-12 w-12 mb-4 text-primary/50" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Henüz Menü Hazır Değil</h2>
                    <p>Restoranımız şu anda menü içeriklerini güncelliyor. Lütfen daha sonra tekrar deneyiniz.</p>
                </div>
            </div>
        )
    }

    const SelectedTemplate = TemplateUltimate

    // --- Language Logic ---
    const [language, setLanguage] = useState<'tr' | 'en'>('tr')

    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

    // Shared action
    const handleProductClick = (id: string) => {
        import("@/app/actions").then(mod => mod.incrementProductView(id))
        setSelectedProductId(id)
    }

    const transformedData = useMemo(() => {
        if (language === 'tr') return activeCategories

        return activeCategories.map(cat => ({
            ...cat,
            name: cat.name_en || cat.name,
            products: cat.products.map(prod => ({
                ...prod,
                name: prod.name_en || prod.name,
                description: prod.description_en || prod.description
            }))
        }))
    }, [activeCategories, language])

    const selectedProduct = useMemo(() => {
        if (!selectedProductId) return null
        // Flatten all products to find by ID
        for (const cat of data) {
            const sent = cat.products.find(p => p.id === selectedProductId)
            if (sent) return sent
        }
        return null
    }, [selectedProductId, data])

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'tr' ? 'en' : 'tr')
    }

    // --- PREMIUM STYLES ---
    const typography = restaurantInfo.typography || 'default'
    const colorPalette = restaurantInfo.colorPalette || 'natural'
    const texture = restaurantInfo.texture || 'none'
    const opacity = restaurantInfo.textureOpacity ?? 0.15
    const weight = restaurantInfo.baseFontWeight ?? 400

    const fontClass = `font-${typography}`

    // Explicit Texture Mapping to avoid Tailwind purge/dynamic issues
    const TEXTURE_MAP: Record<string, string> = {
        'paper': 'bg-paper-pattern',
        'linen': 'bg-linen-pattern',
        'leather': 'bg-leather-pattern',
        'none': ''
    }
    const textureClass = TEXTURE_MAP[texture] || ''

    // Palette Definitions
    const PALETTE_MAP: any = {
        'natural': { bg: '#FDFBF7', text: '#2C3E50', primary: '#2C3E50', accent: '#D35400' },
        'midnight': { bg: '#000000', text: '#FFFFFF', primary: '#FFFFFF', accent: '#FFD700' },
        'pastel': { bg: '#F3E5F5', text: '#4A148C', primary: '#4A148C', accent: '#AB47BC' },
        'clean': { bg: '#FFFFFF', text: '#1E293B', primary: '#1E293B', accent: '#3B82F6' },
        'warm': { bg: '#FFF8E1', text: '#3E2723', primary: '#3E2723', accent: '#FF6F00' }
    }

    const activeColors = PALETTE_MAP[colorPalette] || PALETTE_MAP['natural']

    return (
        <div
            className={cn(`${fontClass} w-full`, className)}
            style={{
                '--font-radius': '1.5rem',
                fontWeight: weight,
                '--background': activeColors.bg,
                '--foreground': activeColors.text,
                '--primary': activeColors.primary,
                '--primary-foreground': activeColors.bg === '#000000' ? '#000' : '#FFF',
                '--accent': activeColors.accent,
                '--card': activeColors.bg,
                '--card-foreground': activeColors.text,
                '--popover': activeColors.bg,
                '--popover-foreground': activeColors.text
            } as React.CSSProperties}
        >
            {/* Texture Overlay */}
            {texture !== 'none' && textureClass && (
                <div
                    className={`fixed inset-0 z-0 pointer-events-none ${textureClass}`}
                    style={{
                        opacity: opacity,
                    }}
                />
            )}

            {/* Language Switcher - Floating (Modernized) */}
            <button
                onClick={toggleLanguage}
                className="fixed top-20 right-4 z-[40] bg-white/40 backdrop-blur-xl border border-white/20 text-foreground px-3 py-1.5 rounded-full shadow-sm font-bold text-xs active-scale transition-all flex items-center gap-2"
            >
                {language === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
            </button>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full">
                <SelectedTemplate
                    data={transformedData}
                    restaurantInfo={restaurantInfo}
                    activeCategories={transformedData}
                    campaigns={campaigns}
                    onProductClick={handleProductClick}
                    language={language}
                    tableId={tableId}
                />
            </div>

            <CampaignPopup campaigns={campaigns} />

            <ProductDetailModal
                isOpen={!!selectedProductId}
                onClose={() => setSelectedProductId(null)}
                product={selectedProduct}
                allCategories={transformedData}
                onAddSuggested={(prod) => setSelectedProductId(prod.id)}
            />
        </div>
    )
}
