"use client"

import { useState, useEffect } from "react"
import { Plus, Upload, Loader2, Image as ImageIcon } from "lucide-react"
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
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kategoriler</h2>
                    <p className="text-sm text-slate-500">Menü kategorilerinizi buradan yönetin.</p>
                </div>
                <Button onClick={openAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Yeni Kategori Ekle
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
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

            <div className="border rounded-md bg-white shadow-sm">
                <Table>
                    <TableHeader>
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
                            <TableRow key={category.id}>
                                <TableCell>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                        {category.imageUrl ? (
                                            <img src={category.imageUrl} className="w-full h-full object-cover" alt={category.name} />
                                        ) : (
                                            <ImageIcon className="w-4 h-4 text-slate-400" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={category.isActive}
                                        onCheckedChange={() => toggleStatus(category.id)}
                                    />
                                </TableCell>
                                <TableCell>{category.productsCount}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(category)}>Düzenle</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
