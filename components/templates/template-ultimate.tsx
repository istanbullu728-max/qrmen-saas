"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Star, MapPin, Instagram, Clock, ShoppingBag, MessageSquare, Bell, ChevronRight, Filter, Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"
import { WaiterCallButton } from "../WaiterCallButton"

type Product = {
    id: string
    name: string
    price: number
    description?: string
    isActive: boolean
    imageUrl?: string
    isFeatured?: boolean
}

type Category = {
    id: string
    name: string
    isActive: boolean
    products: Product[]
}

type RestaurantInfo = {
    name: string
    coverImage: string
    logoImage?: string
    address?: string
    rating?: number
    reviewCount?: number
    workingHours?: string
    minOrderAmount?: number
    deliveryTime?: string
}

type TemplateProps = {
    data: Category[]
    restaurantInfo: RestaurantInfo
    activeCategories: Category[]
    campaigns?: any[]
    onProductClick: (id: string) => void
    tableId?: string
    language?: 'tr' | 'en'
}

export function TemplateUltimate({ data, restaurantInfo, activeCategories, campaigns, onProductClick, tableId }: TemplateProps) {
    const [activeTab, setActiveTab] = useState(activeCategories[0]?.id)
    
    // Smooth scroll and tab sync
    useEffect(() => {
        const handleScroll = () => {
            const sections = activeCategories.map(cat => document.getElementById(`cat-${cat.id}`))
            const scrollPosition = window.scrollY + 150

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i]
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveTab(activeCategories[i].id)
                    break
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [activeCategories])

    const scrollToCategory = (catId: string) => {
        const element = document.getElementById(`cat-${catId}`)
        if (element) {
            const offset = 120
            const bodyRect = document.body.getBoundingClientRect().top
            const elementRect = element.getBoundingClientRect().top
            const elementPosition = elementRect - bodyRect
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
        }
    }

    const activeCampaigns = useMemo(() => {
        return activeCategories.flatMap(cat => cat.products).filter(p => (p as any).isCampaign) // Assuming isCampaign flag or similar
        // Actually, the campaigns are passed in Props. Let me check the props again.
    }, [activeCategories])

    const filteredCategories = activeCategories

    // Waiter Modal State
    const [isWaiterOpen, setIsWaiterOpen] = useState(false)
    const [callLoading, setCallLoading] = useState(false)

    const handleCallAction = async (type: string, note: string) => {
        setCallLoading(true)
        try {
            const { createWaiterCall } = await import("@/app/actions")
            await createWaiterCall({
                tableId: tableId || "Masa Yok",
                type,
                note
            })
            const { toast } = await import("sonner")
            toast.success("Talebiniz iletildi.")
            setIsWaiterOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setCallLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans pb-32">
            {/* Header / Hero Section */}
            <div className="relative h-[250px] md:h-[350px] overflow-hidden">
                <img 
                    src={restaurantInfo.coverImage || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"} 
                    alt="Restaurant Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Restaurant Info Card */}
            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-[24px] shadow-xl p-5 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start border border-white/50">
                    {/* Logo */}
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-lg p-2 flex items-center justify-center shrink-0 -mt-16 md:mt-0 border border-slate-100">
                        <img 
                            src={restaurantInfo.logoImage || "https://cdn-icons-png.flaticon.com/512/3443/3443338.png"} 
                            alt="Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                            {restaurantInfo.name || "Lezzet Ustası"}
                        </h1>
                        <p className="text-slate-500 text-sm mb-4 flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-orange-500" /> {restaurantInfo.address || "Şehir Merkezi"}</span>
                            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-orange-500 fill-orange-500" /> {restaurantInfo.rating || 4.8} ({restaurantInfo.reviewCount || 500}+)</span>
                        </p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full border border-green-500/20 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                                Açık
                            </span>
                            <span className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {restaurantInfo.workingHours || "10:00 - 22:00"}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 border-t border-slate-50 pt-6 md:pt-0 md:border-t-0 md:border-l md:pl-8">
                        <div className="text-center">
                            <div className="text-2xl font-black text-slate-800 tracking-tighter">₺{restaurantInfo.minOrderAmount || 150}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Min. Sipariş</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-slate-800 tracking-tighter">{restaurantInfo.deliveryTime || "25"} dk</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Teslimat</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaigns Section */}
            {campaigns && campaigns.length > 0 && (
                <div className="max-w-4xl mx-auto px-4 mt-8">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-orange-500" />
                        Günün Fırsatları
                    </h3>
                    <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                        {campaigns.map((camp) => (
                            <div 
                                key={camp.id}
                                className="min-w-[280px] sm:min-w-[320px] bg-gradient-to-br from-orange-600 to-orange-500 rounded-[32px] p-6 text-white shadow-xl shadow-orange-100 flex flex-col justify-between relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div>
                                    <h4 className="text-xl font-black mb-1 leading-tight">{camp.title}</h4>
                                    <p className="text-white/80 text-xs font-medium line-clamp-2">{camp.description}</p>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black border border-white/20">
                                        ₺{camp.price}
                                    </div>
                                    <button className="text-xs font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                        İncele <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation & Search */}
            <div className="sticky top-0 z-[40] bg-[#F8F9FA]/80 backdrop-blur-xl border-b border-slate-200/50 mt-8">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    {/* Category Tabs */}
                    <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-3">
                        {activeCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => scrollToCategory(cat.id)}
                                className={cn(
                                    "px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap active-scale",
                                    activeTab === cat.id 
                                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                                        : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 pt-8">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-20 px-8">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Sonuç Bulunamadı</h3>
                        <p className="text-slate-500 text-sm mt-1">Aradığınız kriterlere uygun ürün bulamadık.</p>
                    </div>
                ) : (
                    filteredCategories.map((cat) => (
                        <section key={cat.id} id={`cat-${cat.id}`} className="mb-14 scroll-mt-24">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                    <span className="w-2 h-10 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
                                    {cat.name}
                                    <span className="text-orange-500 text-sm font-black bg-orange-50 px-3 py-1 rounded-xl border border-orange-100">{cat.products.length}</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cat.products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        onClick={() => onProductClick(product.id)}
                                        className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col sm:flex-row h-auto sm:h-48"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-full sm:w-48 h-48 sm:h-full shrink-0 overflow-hidden">
                                            <img 
                                                src={product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"} 
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            {product.isFeatured && (
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black tracking-widest rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                                                    <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                                                    POPÜLER
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                                                    {product.name}
                                                </h3>
                                                <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium">
                                                    {product.description || "Taze ve özenle seçilmiş malzemelerle hazırlanan eşsiz lezzet."}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-5">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{product.price}</span>
                                                    <span className="text-xs font-black text-slate-400">₺</span>
                                                </div>
                                                <div className="w-12 h-12 rounded-[18px] bg-slate-900 flex items-center justify-center text-white shadow-xl group-hover:bg-orange-500 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                                                    <Plus className="w-7 h-7" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </div>

            {/* Campaigns Popup Trigger Component could be here but handled by PublicMenuClient */}

            {/* Fixed Call Waiter Button at the Bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] pointer-events-none">
                <div className="max-w-4xl mx-auto flex justify-center pointer-events-auto">
                    <button 
                        onClick={() => setIsWaiterOpen(true)}
                        className="bg-white/90 backdrop-blur-2xl px-3 py-3 rounded-[40px] border border-white shadow-2xl flex items-center gap-4 group active:scale-95 transition-all"
                    >
                         <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-200 group-hover:rotate-12 transition-transform">
                            <Bell className="w-6 h-6 animate-swing" />
                         </div>
                         <div className="flex flex-col pr-8 items-start">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Hızlı Servis</span>
                            <span className="text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors">Garson Çağır</span>
                         </div>
                    </button>
                </div>
            </div>

            {/* Waiter Call Modal */}
            <AnimatePresence>
                {isWaiterOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsWaiterOpen(false)}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[110]"
                        />
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] p-8 z-[120] shadow-2xl border-t border-slate-100"
                        >
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Nasıl Yardımcı Olabiliriz?</h3>
                            <p className="text-slate-500 font-medium mb-8">Lütfe yapmak istediğiniz işlemi seçiniz.</p>

                            <div className="grid gap-4">
                                <CallBtn icon={ShoppingBag} label="Siparişi İletmek İstiyorum" onClick={() => handleCallAction('ORDER', 'Sipariş')} disabled={callLoading} />
                                <CallBtn icon={MessageSquare} label="Bir Sorun / İsteğim Var" onClick={() => handleCallAction('SERVICE', 'Hizmet')} disabled={callLoading} />
                                <CallBtn icon={ShoppingBag} label="Hesabı Alabilir miyim?" onClick={() => handleCallAction('PAYMENT', 'Hesap')} disabled={callLoading} />
                            </div>

                            <button onClick={() => setIsWaiterOpen(false)} className="w-full mt-8 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Vazgeç</button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            <style jsx global>{`
                @keyframes swing {
                    0%, 100% { transform: rotate(0deg); }
                    20% { transform: rotate(15deg); }
                    40% { transform: rotate(-10deg); }
                    60% { transform: rotate(5deg); }
                    80% { transform: rotate(-5deg); }
                }
                .animate-swing {
                    animation: swing 2s infinite;
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .active-scale:active { transform: scale(0.95); }
            `}</style>
        </div>
    )
}

function CallBtn({ icon: Icon, label, onClick, disabled }: any) {
    return (
        <button 
            disabled={disabled}
            onClick={onClick}
            className="w-full flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-500/30 hover:bg-orange-50 transition-all group active:scale-98"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-800 group-hover:text-orange-500 transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-base font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 transition-all group-hover:translate-x-1" />
        </button>
    )
}

