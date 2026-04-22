"use client"

import { useState, useEffect } from "react"
import { Plus, Upload, Loader2, Image as ImageIcon, Edit } from "lucide-react"
import { ImagePicker } from "@/components/ImagePicker"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { getMenuData, saveMenuData } from "@/app/actions"
import { toast } from "sonner"

// Type matches backend + ui needs
type Category = {
    id: string
    name: string
    isActive: boolean
    productsCount?: number // UI helper
    imageUrl?: string
    products?: any[]
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [restaurantInfo, setRestaurantInfo] = useState<any>({})

    // Dialog State
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", imageUrl: "" })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getMenuData()
            const cats = data.categories.map((c: any) => ({
                ...c,
                productsCount: c.products?.length || 0
            }))
            setCategories(cats)
            setRestaurantInfo(data.restaurantInfo)
        } catch (error) {
            toast.error("Veriler yüklenemedi")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Kategori adı zorunludur")
            return
        }

        let updatedCategories = [...categories]

        if (editingId) {
            // Edit
            updatedCategories = updatedCategories.map(c =>
                c.id === editingId ? { ...c, name: formData.name, imageUrl: formData.imageUrl } : c
            )
            toast.success("Kategori güncellendi")
        } else {
            // Add
            const newCat: Category = {
                id: Math.random().toString(36).substring(7),
                name: formData.name,
                imageUrl: formData.imageUrl,
                isActive: true,
                productsCount: 0,
                products: []
            }
            updatedCategories.push(newCat)
            toast.success("Kategori eklendi")
        }

        setCategories(updatedCategories)
        setIsOpen(false)
        setEditingId(null)
        setFormData({ name: "", imageUrl: "" })

        // Persist
        await saveMenuData({
            categories: updatedCategories.map(({ productsCount, ...c }) => c) as any,
            restaurantInfo
        })
    }

    const openEdit = (cat: Category) => {
        setEditingId(cat.id)
        setFormData({ name: cat.name, imageUrl: cat.imageUrl || "" })
        setIsOpen(true)
    }

    const openAdd = () => {
        setEditingId(null)
        setFormData({ name: "", imageUrl: "" })
        setIsOpen(true)
    }

    const toggleStatus = async (id: string) => {
        const updatedCategories = categories.map(c =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
        )
        setCategories(updatedCategories)
        await saveMenuData({
            categories: updatedCategories.map(({ productsCount, ...c }) => c) as any,
            restaurantInfo
        })
    }

    if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6 pb-24 md:pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight">Kategoriler</h2>
                    <p className="hidden md:block text-sm text-slate-500">Menü kategorilerinizi buradan yönetin.</p>
                </div>
                <Button onClick={openAdd} className="rounded-full shadow-lg">
                    <Plus className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Yeni Kategori Ekle</span><span className="sm:hidden">Ekle</span>
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95%] rounded-2xl md:rounded-lg">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle (Resimli)"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Kategori Adı</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Örn: Başlangıçlar"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Kategori Görseli</Label>
                            <ImagePicker
                                value={formData.imageUrl}
                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>İptal</Button>
                        <Button onClick={handleSave}>Kaydet</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Desktop View: Table */}
            <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[80px]">Görsel</TableHead>
                            <TableHead>Kategori Adı</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Ürün Sayısı</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                        {category.imageUrl ? (
                                            <img src={category.imageUrl} className="w-full h-full object-cover" alt={category.name} />
                                        ) : (
                                            <ImageIcon className="w-4 h-4 text-slate-400" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-slate-900">{category.name}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={category.isActive}
                                        onCheckedChange={() => toggleStatus(category.id)}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                </TableCell>
                                <TableCell className="text-slate-500">{category.productsCount} Ürün</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(category)} className="h-8 w-8 rounded-full text-slate-400 hover:text-indigo-600">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center gap-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-xl flex-shrink-0 border border-slate-100 overflow-hidden flex items-center justify-center">
                            {category.imageUrl ? (
                                <img src={category.imageUrl} className="w-full h-full object-cover" alt={category.name} />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">{category.name}</h3>
                            <p className="text-xs text-slate-500">{category.productsCount} Ürün</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <Switch
                                checked={category.isActive}
                                onCheckedChange={() => toggleStatus(category.id)}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50 text-slate-600" onClick={() => openEdit(category)}>
                                <Edit className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
