"use client"

import { useState, useEffect } from "react"
import { BioLink } from "@/lib/memory-db"
import { getBioLinks, saveBioLinks, getMenuData, saveMenuData } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, GripVertical, Plus, ExternalLink, Save, Instagram, Facebook, Twitter, Youtube, Globe, MapPin, MessageCircle, Menu as MenuIcon, Calendar } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

function SortableLinkItem({ link, onEdit, onDelete, onToggle }: { link: BioLink, onEdit: (l: BioLink) => void, onDelete: (id: string) => void, onToggle: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <button {...attributes} {...listeners} className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                <GripVertical size={20} />
            </button>
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 truncate">{link.title}</div>
                <div className="text-xs text-slate-500 truncate">{link.url}</div>
            </div>
            <div className="flex items-center gap-2">
                <Switch checked={link.isActive} onCheckedChange={() => onToggle(link.id)} />
                <Button variant="ghost" size="icon" onClick={() => onEdit(link)} className="h-8 w-8 text-slate-500 hover:text-blue-600">
                    <ExternalLink size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)} className="h-8 w-8 text-slate-500 hover:text-red-600">
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    )
}

export default function BioLinkPage() {
    const [links, setLinks] = useState<BioLink[]>([])
    const [restaurantInfo, setRestaurantInfo] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null)
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")

    // Fixed Link States
    const [reservationUrl, setReservationUrl] = useState("")
    const [reviewUrl, setReviewUrl] = useState("")

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    useEffect(() => {
        Promise.all([getBioLinks(), getMenuData()]).then(([linksData, menuData]) => {
            setLinks(linksData.sort((a, b) => a.order - b.order))
            setRestaurantInfo(menuData.restaurantInfo)
            setReservationUrl(menuData.restaurantInfo.reservationUrl || "")
            setReviewUrl(menuData.restaurantInfo.reviewUrl || "")
            setLoading(false)
        })
    }, [])

    const handleSave = async (newLinks: BioLink[]) => {
        setLinks(newLinks)
        await saveBioLinks(newLinks)
    }

    const handleSaveFixedLinks = async () => {
        const newInfo = { ...restaurantInfo, reservationUrl, reviewUrl }
        setRestaurantInfo(newInfo)

        // Correct approach: Re-fetch full object, merge, save.
        const fullData = await getMenuData()
        await saveMenuData({
            categories: fullData.categories,
            restaurantInfo: { ...fullData.restaurantInfo, reservationUrl, reviewUrl }
        })
        toast.success("Sabit butonlar güncellendi")
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = links.findIndex((item) => item.id === active.id)
            const newIndex = links.findIndex((item) => item.id === over?.id)
            const newLinks = arrayMove(links, oldIndex, newIndex).map((l, i) => ({ ...l, order: i }))
            handleSave(newLinks)
        }
    }

    const addOrUpdateLink = () => {
        if (!title || !url) return toast.error("Başlık ve URL gereklidir")

        let newLinks = [...links]
        if (editingId) {
            newLinks = newLinks.map(l => l.id === editingId ? { ...l, title, url } : l)
            toast.success("Link güncellendi")
        } else {
            newLinks.push({
                id: Math.random().toString(36).substr(2, 9),
                title,
                url,
                isActive: true,
                order: links.length
            })
            toast.success("Link eklendi")
        }

        handleSave(newLinks)
        resetForm()
    }

    const deleteLink = (id: string) => {
        if (confirm("Silmek istediğinize emin misiniz?")) {
            handleSave(links.filter(l => l.id !== id))
            toast.success("Link silindi")
        }
    }

    const toggleLink = (id: string) => {
        handleSave(links.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l))
    }

    const editLink = (link: BioLink) => {
        setEditingId(link.id)
        setTitle(link.title)
        setUrl(link.url)
    }

    const resetForm = () => {
        setEditingId(null)
        setTitle("")
        setUrl("")
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bio Link Yönetimi</h2>
                    <p className="text-slate-500">Instagram ve sosyal medya için bio sayfanızı oluşturun.</p>
                </div>
                <Button onClick={() => window.open("/demo/bio", "_blank")} variant="outline" className="hidden sm:flex">
                    <ExternalLink className="mr-2 h-4 w-4" /> Sayfayı Görüntüle
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Management */}
                <div className="space-y-6">

                    {/* Fixed Buttons Config */}
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Sabit Butonlar</CardTitle>
                            <CardDescription>En sık kullanılan 4 temel fonksiyon</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Menu & Location are read-only/auto */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 opacity-70">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MenuIcon className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm font-semibold">Menüyü İncele</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500">Otomatik (Menü Sayfası)</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 opacity-70">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-semibold">Konum</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500">Otomatik (Mevcut Konum)</span>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Rezervasyon Linki
                                </Label>
                                <Input value={reservationUrl} onChange={e => setReservationUrl(e.target.value)} placeholder="https://rezervasyon..." />
                            </div>

                            <div className="grid gap-2">
                                <Label className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" /> Değerlendirme Linki
                                </Label>
                                <Input value={reviewUrl} onChange={e => setReviewUrl(e.target.value)} placeholder="https://google.com/reviews..." />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveFixedLinks} className="bg-slate-900">
                                    <Save className="mr-2 h-4 w-4" /> Sabit Butonları Kaydet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Custom Links Add/Edit Form */}
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>{editingId ? "Ekstra Linki Düzenle" : "Ekstra Link Ekle"}</CardTitle>
                            <CardDescription>Listenin altına özel linkler ekleyin</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Başlık</Label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: Web Sitemiz" />
                            </div>
                            <div className="grid gap-2">
                                <Label>URL</Label>
                                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
                            </div>
                            <div className="flex justify-end gap-2">
                                {editingId && <Button variant="ghost" onClick={resetForm}>İptal</Button>}
                                <Button onClick={addOrUpdateLink}>
                                    {editingId ? "Güncelle" : <><Plus className="mr-2 h-4 w-4" /> Ekle</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Draggable List */}
                    <Card className="border-none shadow-md bg-slate-50/50">
                        <CardContent className="p-4">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-3">
                                        {links.map(link => (
                                            <SortableLinkItem
                                                key={link.id}
                                                link={link}
                                                onEdit={editLink}
                                                onDelete={deleteLink}
                                                onToggle={toggleLink}
                                            />
                                        ))}
                                        {links.length === 0 && <div className="text-center text-slate-400 py-8">Henüz ekstra link eklenmedi.</div>}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Live Preview */}
                <div className="flex justify-center lg:justify-start">
                    <div className="relative w-[320px] h-[640px] bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-900 ring-1 ring-slate-900/5">
                        {/* Status Bar Mock */}
                        <div className="absolute top-0 w-full h-6 bg-transparent z-20 flex justify-between px-6 pt-2">
                            <span className="text-[10px] text-white font-medium">9:41</span>
                            <div className="flex gap-1">
                                <div className="w-4 h-2.5 bg-white rounded-[1px]" />
                                <div className="w-0.5 h-2.5 bg-white rounded-[1px]" />
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: restaurantInfo?.coverImage ? `url(${restaurantInfo.coverImage})` : 'none', backgroundColor: '#333' }}>
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                            <div className="relative h-full flex flex-col p-6 overflow-y-auto no-scrollbar">
                                {/* Profile */}
                                <div className="mt-12 text-center space-y-3">
                                    <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-xl">
                                        {restaurantInfo?.logo ? (
                                            <img src={restaurantInfo.logo} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-2xl">🏪</div>
                                        )}
                                    </div>
                                    <h2 className="text-white text-xl font-bold drop-shadow-md">{restaurantInfo?.name || "Restoran İsmi"}</h2>
                                    <p className="text-white/80 text-xs font-medium">Mutluluğun adresi 🍝</p>
                                </div>

                                {/* Main Actions - 4 Boxes */}
                                <div className="mt-8 space-y-3">
                                    {/* 1. Menu */}
                                    <div className="bg-white hover:bg-slate-50 text-slate-900 py-3.5 px-6 rounded-xl text-center font-bold text-sm shadow-lg border-b-4 border-slate-200">
                                        Menüyü İncele
                                    </div>

                                    {/* 2. Review */}
                                    <div className={cn("bg-white/90 backdrop-blur text-slate-900 py-3.5 px-6 rounded-xl text-center font-semibold text-sm shadow-lg", !reviewUrl && "opacity-50 dashed border-2 border-white/40")}>
                                        {reviewUrl ? "Bizi Değerlendir" : "Değerlendirme (Link Giriniz)"}
                                    </div>

                                    {/* 3. Reservation */}
                                    <div className={cn("bg-white/90 backdrop-blur text-slate-900 py-3.5 px-6 rounded-xl text-center font-semibold text-sm shadow-lg", !reservationUrl && "opacity-50 dashed border-2 border-white/40")}>
                                        {reservationUrl ? "Rezervasyon Yap" : "Rezervasyon (Link Giriniz)"}
                                    </div>

                                    {/* 4. Location */}
                                    <div className="bg-white/90 backdrop-blur text-slate-900 py-3.5 px-6 rounded-xl text-center font-semibold text-sm shadow-lg">
                                        Konum
                                    </div>
                                </div>

                                {/* Custom Links */}
                                <div className="mt-4 space-y-3 flex-1">
                                    {links.filter(l => l.isActive).map(link => (
                                        <div key={link.id} className="bg-white/40 backdrop-blur-md text-white border border-white/20 py-3.5 px-6 rounded-xl text-center font-semibold text-sm shadow-sm">
                                            {link.title}
                                        </div>
                                    ))}
                                </div>

                                {/* Socials */}
                                <div className="mt-auto pt-6 flex justify-center gap-4 pb-4">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white cursor-pointer hover:bg-white/40"><Instagram size={16} /></div>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white cursor-pointer hover:bg-white/40"><Globe size={16} /></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
