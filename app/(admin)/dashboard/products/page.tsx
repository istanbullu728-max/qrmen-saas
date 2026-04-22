"use client"

import { useState } from "react"
import { Plus, Upload, Edit } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

// Mock product type
type Product = {
    id: string
    name: string
    price: number
    category: string
    isActive: boolean
    image: string
}

const mockProducts: Product[] = [
    { id: "1", name: "Burger", price: 12.50, category: "Main", isActive: true, image: "/burger.jpg" },
    { id: "2", name: "Coke", price: 2.50, category: "Drinks", isActive: true, image: "/coke.jpg" },
]

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [isOpen, setIsOpen] = useState(false)

    // Form State
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [desc, setDesc] = useState("")

    const handleAddProduct = () => {
        const newProd: Product = {
            id: Math.random().toString(),
            name,
            price: parseFloat(price) || 0,
            category: "Uncategorized", // mock
            isActive: true,
            image: "placeholder",
        }
        setProducts([...products, newProd])
        setIsOpen(false)
        setName(""); setPrice(""); setDesc("")
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-4 md:pt-6 pb-24 md:pb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">Ürünler</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full shadow-lg active-scale">
                            <Plus className="mr-2 h-4 w-4" /> Ürün Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] w-[95%] rounded-2xl md:rounded-lg">
                        <DialogHeader>
                            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Ürün İsmi</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Açıklama</Label>
                                <Textarea id="desc" value={desc} onChange={e => setDesc(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Fiyat (₺)</Label>
                                <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Görsel</Label>
                                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 bg-slate-50/50">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Yüklemek için tıklayın</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleAddProduct} className="w-full sm:w-auto">Ürünü Kaydet</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[80px]">Görsel</TableHead>
                                <TableHead className="min-w-[120px]">İsim</TableHead>
                                <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                                <TableHead>Fiyat</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">İşlem</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="h-10 w-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                                            {/* Image placeholder or actual image */}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-900">{product.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-slate-500">{product.category}</TableCell>
                                    <TableCell className="font-medium">{product.price.toFixed(2)} ₺</TableCell>
                                    <TableCell>
                                        <Switch checked={product.isActive} className="data-[state=checked]:bg-indigo-600" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-indigo-600"><Edit className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {products.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center gap-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-xl flex-shrink-0 border border-slate-100 overflow-hidden">
                            {/* Image placeholder */}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>
                            <p className="text-xs text-slate-500 mb-1">{product.category}</p>
                            <p className="font-bold text-indigo-600">{product.price.toFixed(2)} ₺</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <Switch checked={product.isActive} className="data-[state=checked]:bg-indigo-600" />
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-slate-50 text-slate-600">
                                <Edit className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
