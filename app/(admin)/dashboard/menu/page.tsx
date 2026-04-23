"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, MoreHorizontal, MoreVertical, Edit, Trash2, Image as ImageIcon, Save, AlertCircle, X, ChevronDown, ChevronRight, Search, Star, Loader2, GripVertical, Layers, Box, ArrowUp, ArrowDown, Megaphone, Ticket, Check, List, Settings } from "lucide-react"
import { ImagePicker } from "@/components/ImagePicker"
import { SortableCategoryItem, DragHandleButton } from "@/components/menu-builder/SortableCategoryItem"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { compressImage } from "@/lib/image-utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { getMenuData, saveMenuData, getCampaigns, saveCampaign, deleteCampaign, toggleCampaign } from "@/app/actions"
import { toast } from "sonner"

// Types matching Server Actions
type Product = {
    id: string
    name: string
    price: number
    description?: string
    isActive: boolean
    imageUrl?: string
    sectionName?: string
    suggestedProductIds?: string[]
    isFeatured?: boolean
}

type Category = {
    id: string
    name: string
    isActive: boolean
    products: Product[]
    sections?: string[] // Explicit sections list
    imageUrl?: string
}

type Campaign = {
    id: string
    title: string
    description?: string
    price?: number
    isActive: boolean
}

export default function MenuBuilderPage() {
    // --- GLOBAL STATE ---
    const [activeTab, setActiveTab] = useState("menu")
    const [loading, setLoading] = useState(true)

    // --- MENU DATA ---
    const [categories, setCategories] = useState<Category[]>([])

    // --- RESTAURANT INFO ---
    const [restaurantInfo, setRestaurantInfo] = useState<{
        name: string,
        coverImage: string,
        logo?: string,
        instagramUrl?: string,
        googleMapsUrl?: string
    }>({
        name: "",
        coverImage: "",
        logo: "",
        instagramUrl: "",
        googleMapsUrl: ""
    })

    // --- CAMPAIGNS DATA ---
    const [campaigns, setCampaigns] = useState<Campaign[]>([])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const bannerInputRef = useRef<HTMLInputElement>(null)


    // Load Data
    useEffect(() => {
        Promise.all([getMenuData(), getCampaigns()])
            .then(([menuData, campaignsData]) => {
                // Menu Data
                if (menuData?.categories) {
                    setCategories(menuData.categories)
                }

                const info = menuData?.restaurantInfo as any
                if (info) {
                    setRestaurantInfo({
                        name: info.name || "",
                        coverImage: info.coverImage || "",
                        logo: info.logo || "",
                        instagramUrl: info.instagramUrl || "",
                        googleMapsUrl: info.googleMapsUrl || ""
                    })
                }

                // Campaigns Data
                if (campaignsData) {
                    setCampaigns(campaignsData)
                }
            })
            .catch(err => {
                console.error(err)
                toast.error("Veriler yüklenirken bir hata oluştu.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    // --- MENU LOGIC ---
    const updateCategories = async (newCategories: Category[], newInfo = restaurantInfo) => {
        setCategories(newCategories) // Optimistic
        try {
            await saveMenuData({ categories: newCategories, restaurantInfo: newInfo })
        } catch (error) {
            console.error("Save failed", error)
            toast.error("Kaydedilirken hata oluştu.")
        }
    }

    const handleSaveInfo = () => {
        saveMenuData({ categories, restaurantInfo })
            .then(() => toast.success("Ayarlar kaydedildi"))
            .catch(() => toast.error("Hata oluştu"))
    }

    const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const compressed = await compressImage(file)
                setRestaurantInfo(prev => ({ ...prev, coverImage: compressed }))
            } catch (error) { toast.error("Resim yüklenemedi") }
        }
    }



    // --- CAMPAIGN LOGIC ---
    const [isCampDialogOpen, setIsCampDialogOpen] = useState(false)
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
    const [campForm, setCampForm] = useState({ title: "", description: "", price: "" })

    const openCampDialog = (campaign?: Campaign) => {
        if (campaign) {
            setEditingCampaign(campaign)
            setCampForm({
                title: campaign.title,
                description: campaign.description || "",
                price: campaign.price?.toString() || ""
            })
        } else {
            setEditingCampaign(null)
            setCampForm({ title: "", description: "", price: "" })
        }
        setIsCampDialogOpen(true)
    }

    const saveCamp = async () => {
        if (!campForm.title) return toast.error("Başlık zorunludur")
        try {
            await saveCampaign({
                id: editingCampaign?.id,
                title: campForm.title,
                description: campForm.description,
                price: campForm.price ? parseFloat(campForm.price) : undefined,
                isActive: editingCampaign ? editingCampaign.isActive : true
            })
            // Refetch
            const newCampaigns = await getCampaigns()
            setCampaigns(newCampaigns)
            toast.success(editingCampaign ? "Kampanya güncellendi" : "Kampanya oluşturuldu")
            setIsCampDialogOpen(false)
        } catch (error) { toast.error("Kaydetme başarısız") }
    }

    const deleteCamp = async (id: string) => {
        if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return
        try {
            await deleteCampaign(id)
            setCampaigns(prev => prev.filter(c => c.id !== id))
            toast.success("Kampanya silindi")
        } catch (error) { toast.error("Silme başarısız") }
    }

    const toggleCamp = async (id: string) => {
        try {
            await toggleCampaign(id)
            setCampaigns(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
            toast.success("Durum güncellendi")
        } catch (error) { toast.error("İşlem başarısız") }
    }


    // --- CATEGORY & PRODUCT STATES ---
    const [isCatDialogOpen, setIsCatDialogOpen] = useState(false)
    const [isProdDialogOpen, setIsProdDialogOpen] = useState(false)
    const [isReorderMode, setIsReorderMode] = useState(false)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [selectedCatId, setSelectedCatId] = useState<string | null>(null)

    // Form States
    const [catName, setCatName] = useState("")
    const [catImage, setCatImage] = useState("")
    const [prodName, setProdName] = useState("")
    const [prodDesc, setProdDesc] = useState("")
    const [prodPrice, setProdPrice] = useState("")
    const [prodSection, setProdSection] = useState("")
    const [prodImagePreview, setProdImagePreview] = useState<string | null>(null)
    const [prodSuggestedIds, setProdSuggestedIds] = useState<string[]>([])
    const [prodIsFeatured, setProdIsFeatured] = useState(false)

    // Image Search States
    const [searchTab, setSearchTab] = useState<'upload' | 'search'>('search')
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<any[]>([])

    // Helpers
    const generateId = () => Math.random().toString(36).substr(2, 9) + "-" + Date.now().toString(36)

    // Category Actions
    const openAddCategory = () => {
        setEditingCategory(null)
        setCatName("")
        setCatImage("")
        setIsCatDialogOpen(true)
    }

    const openEditCategory = (category: Category, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingCategory(category)
        setCatName(category.name)
        setCatImage(category.imageUrl || "")
        setIsCatDialogOpen(true)
    }

    const handleSaveCategory = () => {
        if (!catName) return
        if (editingCategory) {
            updateCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: catName, imageUrl: catImage } : c))
        } else {
            const newCat: Category = {
                id: generateId(),
                name: catName,
                isActive: true,
                products: [],
                sections: [],
                imageUrl: catImage
            }
            updateCategories([...categories, newCat])
        }
        setIsCatDialogOpen(false)
    }

    const deleteCategory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("Kategoriyi silmek istediğinize emin misiniz?")) {
            updateCategories(categories.filter(c => c.id !== id))
        }
    }

    // Drag Actions
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = categories.findIndex((item) => item.id === active.id)
            const newIndex = categories.findIndex((item) => item.id === over?.id)
            const newCategories = arrayMove(categories, oldIndex, newIndex)
            updateCategories(newCategories)
        }
        setActiveId(null)
    }

    const moveCategory = (e: React.MouseEvent, id: string, direction: 'up' | 'down') => {
        e.stopPropagation()
        const index = categories.findIndex(c => c.id === id)
        if (index === -1) return
        let newIndex = index
        if (direction === 'up' && index > 0) newIndex = index - 1
        if (direction === 'down' && index < categories.length - 1) newIndex = index + 1
        if (newIndex !== index) {
            const newCategories = arrayMove(categories, index, newIndex)
            updateCategories(newCategories)
        }
    }

    // Product Actions
    const openAddProduct = (catId?: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        setSelectedCatId(catId || (categories.length > 0 ? categories[0].id : null))
        setEditingProduct(null)
        setProdName("")
        setProdPrice("")
        setProdDesc("")
        setProdSection("")
        setProdImagePreview(null)
        setProdSuggestedIds([])
        setProdIsFeatured(false)
        setSearchTab('search')
        setSearchQuery("")
        setSearchResults([])
        setIsProdDialogOpen(true)
    }

    const openEditProduct = (catId: string, product: Product) => {
        setSelectedCatId(catId)
        setEditingProduct(product)
        setProdName(product.name)
        setProdPrice(product.price.toString())
        setProdDesc(product.description || "")
        setProdSection(product.sectionName || "")
        setProdImagePreview(product.imageUrl || null)
        setProdSuggestedIds(product.suggestedProductIds || [])
        setProdIsFeatured(product.isFeatured || false)
        setSearchTab('search')
        setSearchQuery(product.name)
        setSearchResults([])
        setIsProdDialogOpen(true)
    }

    const handleSaveProduct = () => {
        if (!prodName || !selectedCatId) return
        updateCategories(categories.map(cat => {
            if (cat.id !== selectedCatId) return cat
            let updatedProducts = [...cat.products]
            const productData = {
                name: prodName,
                price: parseFloat(prodPrice) || 0,
                description: prodDesc,
                sectionName: prodSection || undefined,
                imageUrl: prodImagePreview || undefined,
                suggestedProductIds: prodSuggestedIds,
                isFeatured: prodIsFeatured
            }
            if (editingProduct) {
                updatedProducts = updatedProducts.map(p =>
                    p.id === editingProduct.id ? { ...p, ...productData } : p
                )
            } else {
                updatedProducts.push({
                    id: generateId(),
                    isActive: true,
                    ...productData
                })
            }
            return { ...cat, products: updatedProducts }
        }))
        setIsProdDialogOpen(false)
    }

    const deleteProduct = (catId: string, prodId: string) => {
        if (confirm("Ürünü silmek istiyor musunuz?")) {
            updateCategories(categories.map(cat =>
                cat.id === catId ? { ...cat, products: cat.products.filter(p => p.id !== prodId) } : cat
            ))
        }
    }

    const toggleProductStatus = (catId: string, prodId: string) => {
        updateCategories(categories.map(cat =>
            cat.id === catId ? {
                ...cat,
                products: cat.products.map(p => p.id === prodId ? { ...p, isActive: !p.isActive } : p)
            } : cat
        ))
    }

    // Image Search
    const handleSearchImages = async (queryOverride?: string | any) => {
        const query = typeof queryOverride === 'string' ? queryOverride : searchQuery
        if (!query) return
        setIsSearching(true)
        setSearchResults([])
        try {
        } catch (error) { toast.error("Hata oluştu") }
        finally { setIsSearching(false) }
    }

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Yükleniyor...</div>

    return (
        <div className="flex-1 p-4 pt-4 md:p-8 md:pt-6 animate-in fade-in duration-500 space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Dijital Menü İçeriği</h2>
                <p className="text-slate-500">Kategorilerinizi ve ürünlerinizi yönetin.</p>
            </div>

            <div className="space-y-6">
                {/* Categories Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-slate-800">
                        {isReorderMode ? "Kategori Sıralama" : "Kategoriler"}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.length > 1 && (
                            <Button
                                variant={isReorderMode ? "default" : "outline"}
                                onClick={() => setIsReorderMode(!isReorderMode)}
                                className={cn("transition-all rounded-xl", isReorderMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "")}
                            >
                                {isReorderMode ? <><Save className="mr-2 h-4 w-4" /> Tamam</> : <><ArrowUp className="mr-1 h-3 w-3" /><ArrowDown className="mr-2 h-3 w-3" /> Sırala</>}
                            </Button>
                        )}
                        {!isReorderMode && (
                            <Button onClick={openAddCategory} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 h-10 px-5">
                                <Plus className="mr-2 h-4 w-4" /> Kategori Ekle
                            </Button>
                        )}
                    </div>
                </div>

                {/* Reorder Mode List */}
                {isReorderMode && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {categories.map((category, index) => (
                            <div key={category.id} className="flex items-center justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="bg-slate-50 p-2 rounded-lg text-slate-400 flex-shrink-0">
                                        <GripVertical className="h-5 w-5" />
                                    </div>
                                    <div className="truncate">
                                        <h4 className="font-bold text-slate-900 text-base sm:text-lg truncate">{category.name}</h4>
                                        <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{category.products.length} ürün</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg" disabled={index === 0} onClick={(e) => moveCategory(e, category.id, 'up')}>
                                        <ArrowUp className="h-5 w-5" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-lg" disabled={index === categories.length - 1} onClick={(e) => moveCategory(e, category.id, 'down')}>
                                        <ArrowDown className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Normal Mode List */}
                {!isReorderMode && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={(event) => setActiveId(event.active.id as string)}
                        onDragEnd={handleDragEnd}
                        onDragCancel={() => setActiveId(null)}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <Accordion type="multiple" className="w-full space-y-4">
                            <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                {categories.map((category) => (
                                    <SortableCategoryItem key={category.id} category={category}>
                                        <AccordionItem value={category.id} className="border-none bg-white rounded-2xl shadow-sm overflow-hidden">
                                            <AccordionTrigger
                                                className="px-6 py-5 hover:no-underline hover:bg-slate-50/50 rounded-t-2xl transition-all"
                                                triggerPrefix={<div onClick={e => e.stopPropagation()} className="pl-0"><DragHandleButton /></div>}
                                                actions={
                                                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                        <div className="hidden sm:flex gap-2">
                                                            <Button size="sm" variant="ghost" className="h-9 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg px-4" onClick={e => openAddProduct(category.id, e)}>
                                                                <Plus className="h-3.5 w-3.5 mr-1.5" /> Ürün Ekle
                                                            </Button>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100 transition-colors"><MoreVertical className="h-5 w-5" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                                                                <DropdownMenuItem onClick={e => openEditCategory(category, e)} className="rounded-lg"><Edit className="mr-2 h-4 w-4" /> Düzenle</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="sm:hidden" onClick={e => openAddProduct(category.id, e)}><Plus className="mr-2 h-4 w-4" /> Ürün Ekle</DropdownMenuItem>
                                                                <DropdownMenuSeparator className="sm:hidden" />
                                                                <DropdownMenuItem className="text-red-500 hover:text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 rounded-lg" onClick={e => deleteCategory(category.id, e)}><Trash2 className="mr-2 h-4 w-4" /> Sil</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                }
                                            >
                                                <div className="flex items-center gap-3 py-1 flex-1 min-w-0 pr-2">
                                                    <span className="font-extrabold text-lg text-slate-800 truncate tracking-tight">{category.name}</span>
                                                    <Badge variant="secondary" className="font-bold text-slate-400 bg-slate-50 px-2 rounded-md">{category.products.length}</Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-6 pb-6 pt-2">
                                                <div className="space-y-4">
                                                    <ProductList products={category.products} category={category} onEdit={openEditProduct} onDelete={deleteProduct} onToggleStatus={toggleProductStatus} />
                                                    {category.products.length === 0 && (
                                                        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-white">
                                                            <p className="text-slate-400 font-medium mb-4">Henüz ürün eklenmemiş.</p>
                                                            <Button onClick={e => openAddProduct(category.id, e)} className="rounded-xl border-slate-200" variant="outline">+ İlk Ürünü Ekleyin</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </SortableCategoryItem>
                                ))}
                            </SortableContext>
                        </Accordion>
                        <DragOverlay>
                            {activeId ? (
                                <div className="opacity-95 bg-white rounded-2xl shadow-2xl border-2 border-indigo-500 p-5 flex items-center gap-4 scale-105 cursor-grabbing">
                                    <div className="h-10 w-10 text-indigo-600 bg-indigo-50 rounded-full flex items-center justify-center"><GripVertical className="h-5 w-5" /></div>
                                    <div>
                                        <span className="font-extrabold text-lg text-slate-900 block">{categories.find(c => c.id === activeId)?.name}</span>
                                        <span className="text-xs font-bold text-slate-400">{categories.find(c => c.id === activeId)?.products.length} ürün</span>
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>

            {/* Category Dialog */}
            <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div><Label>Kategori İsmi</Label><Input value={catName} onChange={e => setCatName(e.target.value)} className="mt-2" /></div>
                        <div><Label>Kategori Görseli</Label><ImagePicker value={catImage} onChange={setCatImage} className="mt-2" /></div>
                    </div>
                    <DialogFooter><Button onClick={handleSaveCategory}>Kaydet</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Product Dialog */}
            <Dialog open={isProdDialogOpen} onOpenChange={setIsProdDialogOpen}>
                <DialogContent className="sm:max-w-[500px] w-[95%] max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingProduct ? "Ürünü Düzenle" : "Ürün Ekle"}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2"><Label>Ürün İsmi</Label><Input value={prodName} onChange={e => setProdName(e.target.value)} /></div>
                        <div className="grid gap-2"><Label>Fiyat (₺)</Label><Input type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} /></div>
                        <div className="grid gap-2"><Label>Açıklama</Label><Textarea value={prodDesc} onChange={e => setProdDesc(e.target.value)} /></div>
                        <div className="grid gap-2">
                            <Label>Görsel</Label>
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                <div className="flex border-b border-slate-200">
                                    <button className={cn("flex-1 px-4 py-2 text-sm font-medium", searchTab === 'search' ? "bg-slate-50 border-b-2 border-indigo-500" : "")} onClick={() => setSearchTab('search')}>Web'de Ara</button>
                                    <button className={cn("flex-1 px-4 py-2 text-sm font-medium", searchTab === 'upload' ? "bg-slate-50 border-b-2 border-indigo-500" : "")} onClick={() => setSearchTab('upload')}>Yükle</button>
                                </div>
                                <div className="p-4 bg-slate-50/50 min-h-[200px]">
                                    {searchTab === 'upload' ? (
                                        <div className="flex flex-col items-center justify-center gap-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-white transition-colors relative">
                                            {prodImagePreview ? <img src={prodImagePreview} className="h-32 object-contain" /> : <div className="text-center text-slate-400"><ImageIcon className="mx-auto h-8 w-8 mb-2" /><span>Görsel Yükle</span></div>}
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={async (e) => {
                                                const file = e.target.files?.[0]; if (file) {
                                                    try { const c = await compressImage(file); setProdImagePreview(c); } catch { toast.error("Hata") }
                                                }
                                            }} />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Yemek ismi..." />
                                                <Button size="icon" onClick={() => handleSearchImages()} disabled={isSearching}>{isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</Button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                                                {searchResults.map((url, i) => (
                                                    <div key={i} className={cn("aspect-square rounded-md overflow-hidden cursor-pointer border-2 hover:border-indigo-500", prodImagePreview === url ? "border-indigo-600 ring-2 ring-indigo-200" : "border-transparent")} onClick={() => setProdImagePreview(url)}>
                                                        <img src={url} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleSaveProduct}>Kaydet</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Subcomponent for Product List
function ProductList({ products, category, onEdit, onDelete, onToggleStatus }: any) {
    if (!products || products.length === 0) return null
    return (
        <div className="grid gap-2 sm:gap-3">
            {products.map((product: any) => (
                <div key={product.id} className={cn("flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl border bg-white transition-all group", product.isActive ? "border-slate-100 shadow-sm active-scale" : "border-slate-100 opacity-60 bg-slate-50")}>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden relative border border-slate-100 italic">
                        {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="h-5 w-5" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-900 truncate text-sm sm:text-base leading-tight">{product.name}</h5>
                        <p className="text-xs sm:text-sm text-slate-500 truncate font-medium">{product.price} ₺</p>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-slate-400 hover:text-indigo-600 active:bg-indigo-50 rounded-full" onClick={() => onToggleStatus(category.id, product.id)}>
                            {product.isActive ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <X className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-slate-400 hover:text-indigo-600 active:bg-indigo-50 rounded-full" onClick={(e) => { e.stopPropagation(); onEdit(category.id, product); }}>
                            <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-slate-400 hover:text-red-600 active:bg-red-50 rounded-full" onClick={() => onDelete(category.id, product.id)}>
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
