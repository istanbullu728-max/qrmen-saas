"use client"

import { useState, useRef, useEffect } from "react"
import { Save, Image as ImageIcon, Trash2, Edit, Instagram, MapPin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { compressImage } from "@/lib/image-utils"
import { cn } from "@/lib/utils"
import { getMenuData, saveMenuData } from "@/app/actions"
import { toast } from "sonner"

export default function RestaurantInfoPage() {
    const [loading, setLoading] = useState(true)
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

    const bannerInputRef = useRef<HTMLInputElement>(null)
    const logoInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        getMenuData()
            .then(data => {
                const info = data?.restaurantInfo as any
                if (info) {
                    setRestaurantInfo({
                        name: info.name || "",
                        coverImage: info.coverImage || "",
                        logo: info.logo || "",
                        instagramUrl: info.instagramUrl || "",
                        googleMapsUrl: info.googleMapsUrl || ""
                    })
                }
            })
            .catch(err => {
                console.error(err)
                toast.error("Bilgiler yüklenirken hata oluştu")
            })
            .finally(() => setLoading(false))
    }, [])

    const handleSaveInfo = async () => {
        try {
            const currentData = await getMenuData()
            await saveMenuData({ 
                categories: currentData?.categories || [], 
                restaurantInfo 
            })
            toast.success("Restoran bilgileri güncellendi")
        } catch (error) {
            toast.error("Kaydedilirken hata oluştu")
        }
    }

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'logo') => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const compressed = await compressImage(file)
                setRestaurantInfo(prev => ({ ...prev, [field]: compressed }))
                toast.success("Görsel eklendi, kaydetmeyi unutmayın.")
            } catch (error) { toast.error("Resim yüklenemedi") }
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Yükleniyor...</div>

    return (
        <div className="flex-1 p-4 pt-4 md:p-8 md:pt-6 animate-in fade-in duration-500 space-y-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Restoran Bilgileri</h2>
                <p className="text-slate-500">QR menünüzde görünecek olan dükkan detaylarını ve sosyal medya linklerinizi yönetin.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Sol Taraf: Görseller */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Kapak Fotoğrafı */}
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800">Kapak Fotoğrafı</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={cn("w-full aspect-video rounded-2xl overflow-hidden border-2 flex items-center justify-center relative bg-slate-50 transition-all", restaurantInfo.coverImage ? "border-transparent" : "border-dashed border-slate-200")}>
                                {restaurantInfo.coverImage ? (
                                    <img src={restaurantInfo.coverImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <ImageIcon className="h-10 w-10 opacity-20" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Kapak Görseli Yok</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 rounded-xl h-11 border-slate-200 font-bold" onClick={() => bannerInputRef.current?.click()}>
                                    <Edit className="h-4 w-4 mr-2" /> Değiştir
                                </Button>
                                {restaurantInfo.coverImage && (
                                    <Button variant="ghost" className="rounded-xl h-11 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setRestaurantInfo(prev => ({ ...prev, coverImage: "" }))}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <input ref={bannerInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'coverImage')} />
                        </CardContent>
                    </Card>

                    {/* Logo */}
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800">Restoran Logosu</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-center">
                                <div className={cn("w-32 h-32 rounded-3xl overflow-hidden border-2 flex items-center justify-center relative bg-slate-50 transition-all", restaurantInfo.logo ? "border-transparent shadow-inner" : "border-dashed border-slate-200")}>
                                    {restaurantInfo.logo ? (
                                        <img src={restaurantInfo.logo} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-slate-200" />
                                    )}
                                </div>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl h-11 border-slate-200 font-bold" onClick={() => logoInputRef.current?.click()}>
                                Logo Yükle
                            </Button>
                            <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'logo')} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sağ Taraf: Bilgiler Formu */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm rounded-3xl bg-white p-2">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-bold text-slate-900">Genel Ayarlar</CardTitle>
                            <CardDescription>Restoranınızın temel bilgilerini girin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="font-bold text-slate-700 ml-1">Restoran Adı</Label>
                                <Input 
                                    placeholder="Örn: Lezzet Durağı" 
                                    value={restaurantInfo.name} 
                                    onChange={e => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })} 
                                    className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium"
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700 ml-1">Instagram Kullanıcı Adı / Link</Label>
                                    <div className="relative">
                                        <Instagram className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                        <Input 
                                            placeholder="https://instagram.com/..." 
                                            value={restaurantInfo.instagramUrl} 
                                            onChange={e => setRestaurantInfo({ ...restaurantInfo, instagramUrl: e.target.value })} 
                                            className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium pl-12"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-bold text-slate-700 ml-1">Google Maps Konum Linki</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                        <Input 
                                            placeholder="https://maps.app.goo.gl/..." 
                                            value={restaurantInfo.googleMapsUrl} 
                                            onChange={e => setRestaurantInfo({ ...restaurantInfo, googleMapsUrl: e.target.value })} 
                                            className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium pl-12"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end">
                                <Button onClick={handleSaveInfo} className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-14 px-12 font-bold shadow-xl shadow-slate-200">
                                    <Save className="mr-2 h-5 w-5" /> Ayarları Kaydet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
