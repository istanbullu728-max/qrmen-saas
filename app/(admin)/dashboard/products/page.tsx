"use client"

import { useState } from "react"
import { Plus, Upload } from "lucide-react"
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
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description</Label>
                                <Textarea id="desc" value={desc} onChange={e => setDesc(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Image</Label>
                                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Click to upload</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleAddProduct}>Save Product</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="h-10 w-10 bg-slate-200 rounded-md" />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Switch checked={product.isActive} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
