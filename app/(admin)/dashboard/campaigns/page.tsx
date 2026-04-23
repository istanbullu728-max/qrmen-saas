"use client"

import { useState, useEffect } from "react"
import { Plus, Megaphone, Check, X, Trash2, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog"
import { getCampaigns, saveCampaign, deleteCampaign, toggleCampaign } from "@/app/actions"
import { toast } from "sonner"

type Campaign = {
    id: string
    title: string
    description?: string
    price?: number
    isActive: boolean
}

export default function CampaignsPage() {
    const [loading, setLoading] = useState(true)
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [isCampDialogOpen, setIsCampDialogOpen] = useState(false)
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
    const [campForm, setCampForm] = useState({ title: "", description: "", price: "" })

    useEffect(() => {
        getCampaigns()
            .then(data => {
                if (data) setCampaigns(data)
            })
            .catch(err => {
                console.error(err)
                toast.error("Kampanyalar yüklenirken hata oluştu")
            })
            .finally(() => setLoading(false))
    }, [])

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
            const newCampaigns = await getCampaigns()
            setCampaigns(newCampaigns)
            toast.success(editingCampaign ? "Kampanya güncellendi" : "Kampanya oluşturuldu")
            setIsCampDialogOpen(false)
        } catch (error) { toast.error("Kaydetme başarısız") }
    }

    const handleDeleteCamp = async (id: string) => {
        if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return
        try {
            await deleteCampaign(id)
            setCampaigns(prev => prev.filter(c => c.id !== id))
            toast.success("Kampanya silindi")
        } catch (error) { toast.error("Silme başarısız") }
    }

    const handleToggleCamp = async (id: string) => {
        try {
            await toggleCampaign(id)
            setCampaigns(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))
            toast.success("Durum güncellendi")
        } catch (error) { toast.error("İşlem başarısız") }
    }

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Yükleniyor...</div>

    return (
        <div className="flex-1 p-4 pt-4 md:p-8 md:pt-6 animate-in fade-in duration-500 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Kampanyalar</h2>
                    <p className="text-slate-500">Müşterilerinize sunduğunuz güncel fırsatları buradan yönetin.</p>
                </div>
                <Button onClick={() => openCampDialog()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 rounded-xl h-11 px-6">
                    <Plus className="mr-2 h-4 w-4" /> Yeni Kampanya
                </Button>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-3xl bg-white text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Megaphone className="h-8 w-8 text-indigo-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Kampanya Bulunamadı</h3>
                        <p className="text-sm text-slate-500 mt-2 mb-8 text-center max-w-xs">Restoranınız için avantajlı kampanyalar oluşturarak satışlarınızı artırabilirsiniz.</p>
                        <Button onClick={() => openCampDialog()} variant="outline" className="rounded-xl border-slate-200">+ İlk Kampanyanızı Oluşturun</Button>
                    </div>
                )}
                {campaigns.map((camp) => (
                    <Card key={camp.id} className="relative overflow-hidden group border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white rounded-3xl">
                        <div className={`absolute top-4 right-4 p-2 z-10 rounded-full ${camp.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {camp.isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </div>

                        <CardHeader className="pb-3 pt-8 px-6">
                            <CardTitle className="text-2xl font-bold text-slate-900 pr-10 leading-tight group-hover:text-indigo-600 transition-colors font-sans">{camp.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <p className="text-slate-500 mb-8 min-h-[48px] leading-relaxed line-clamp-2 font-medium">{camp.description || "Kampanya açıklaması bulunmuyor."}</p>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
                                    {camp.price ? `${camp.price}` : ""}
                                    <span className="text-sm font-bold text-slate-400">₺</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch checked={camp.isActive} onCheckedChange={() => handleToggleCamp(camp.id)} className="data-[state=checked]:bg-green-500" />
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-50 hover:text-indigo-600" onClick={() => openCampDialog(camp)}>
                                        <EditIcon className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteCamp(camp.id)}>
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isCampDialogOpen} onOpenChange={setIsCampDialogOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[32px] p-8 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900">{editingCampaign ? "Kampanyayı Düzenle" : "Yeni Kampanya"}</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium pt-2">Müşterilerinize özel kampanya detaylarını aşağıda belirtebilirsiniz.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-8">
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-bold ml-1">Kampanya Başlığı</Label>
                            <Input value={campForm.title} onChange={e => setCampForm({ ...campForm, title: e.target.value })} placeholder="Örn: Hafta Sonu Özel Menüsü" className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-bold ml-1">Fiyat (Opsiyonel)</Label>
                            <div className="relative">
                                <Input type="number" value={campForm.price} onChange={e => setCampForm({ ...campForm, price: e.target.value })} className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white pl-4 pr-10 font-bold text-lg" />
                                <span className="absolute right-4 top-3 text-slate-400 font-bold text-lg">₺</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-bold ml-1">Kampanya Açıklaması</Label>
                            <Textarea value={campForm.description} onChange={e => setCampForm({ ...campForm, description: e.target.value })} placeholder="Kampanya detaylarını buraya yazın..." className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white resize-none font-medium p-4" />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setIsCampDialogOpen(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-500">Vazgeç</Button>
                        <Button onClick={saveCamp} className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 px-10 font-bold shadow-lg shadow-slate-200">Kaydet</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function EditIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22h6" /><path d="M18.5 4.98a2.23 2.23 0 0 1 3.15 3.15L8 21.78l-4 1 1-4Z" /><path d="m14.5 9 3 3" />
        </svg>
    )
}
