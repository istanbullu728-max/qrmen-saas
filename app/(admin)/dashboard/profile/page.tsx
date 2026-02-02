"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CreditCard, LogOut, User, Lock, Settings } from "lucide-react"
import { logout } from "@/app/actions"

export default function ProfilePage() {
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success("Profil bilgileri güncellendi")
        setLoading(false)
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-4 md:p-8 md:pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hesap Ayarları</h2>
                    <p className="text-slate-500">Kişisel bilgilerinizi ve restoran tercihlerinizi yönetin.</p>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-white p-1 border border-slate-200 rounded-xl shadow-sm h-12 w-full md:w-auto overflow-x-auto justify-start">
                    <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-6">Genel Bilgiler</TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-6">Üyelik & Fatura</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-6">Güvenlik</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card className="border-none shadow-md bg-white rounded-2xl">
                        <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50 rounded-t-2xl">
                            <CardTitle className="text-xl font-bold text-slate-800">Profil Bilgileri</CardTitle>
                            <CardDescription className="text-slate-500">
                                Kişisel bilgilerinizi ve restoran detaylarınızı buradan yönetin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8 px-8">
                            <div className="flex items-center gap-8">
                                <Avatar className="h-28 w-28 ring-4 ring-slate-100 shadow-lg">
                                    <AvatarImage src="/placeholder-user.jpg" />
                                    <AvatarFallback className="text-2xl font-bold bg-indigo-100 text-indigo-700">RD</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">Fotoğraf Değiştir</Button>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-medium">Ad Soyad</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                        <Input defaultValue="Ahmet Yılmaz" className="pl-10 h-12 border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-500" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-medium">E-posta</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-3 h-5 w-5 flex items-center justify-center text-slate-400">@</div>
                                        <Input defaultValue="ahmet@restoran.com" disabled className="pl-10 h-12 bg-slate-100/50 text-slate-500 border-slate-200" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-medium">Restoran Adı</Label>
                                    <Input defaultValue="Lezzet Durağı" className="h-12 border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-500" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-medium">Telefon</Label>
                                    <Input defaultValue="+90 555 123 45 67" className="h-12 border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-500" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 rounded-b-2xl px-8 py-4 border-t border-slate-100 flex justify-end">
                            <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-8 shadow-lg shadow-indigo-500/20">
                                {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-6">
                    <Card className="border-none shadow-md bg-white rounded-2xl">
                        <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50 rounded-t-2xl">
                            <CardTitle className="text-xl font-bold text-slate-800">Üyelik Planı</CardTitle>
                            <CardDescription className="text-slate-500">
                                Mevcut planınız ve fatura bilgileriniz.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8 px-8">
                            <div className="flex items-center justify-between border-2 border-indigo-100 p-6 rounded-2xl bg-indigo-50/30">
                                <div className="space-y-2">
                                    <div className="text-xl font-bold text-indigo-900 flex items-center gap-3">
                                        Profesyonel Plan
                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 border-none shadow-sm">Aktif</Badge>
                                    </div>
                                    <p className="text-sm text-indigo-800/70">
                                        Sonraki yenileme: 28 Şubat 2026
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-extrabold text-indigo-600">199₺</div>
                                    <div className="text-sm font-medium text-indigo-400">/aylık</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Ödeme Yöntemi</h3>
                                <div className="flex items-center gap-4 border border-slate-200 p-4 rounded-xl bg-white shadow-sm">
                                    <div className="bg-slate-100 p-3 rounded-lg">
                                        <CreditCard className="h-6 w-6 text-slate-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-800">•••• •••• •••• 4242</div>
                                        <div className="text-xs font-medium text-slate-500">Son kullanma: 12/28</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium">Güncelle</Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-slate-50 rounded-b-2xl px-8 py-4 border-t border-slate-100">
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">Üyeliği İptal Et</Button>
                            <Button variant="outline" className="border-slate-200 text-slate-700">Fatura Geçmişi</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="border-none shadow-md bg-white rounded-2xl">
                        <CardHeader className="border-b border-slate-100 pb-6 bg-slate-50/50 rounded-t-2xl">
                            <CardTitle className="text-xl font-bold text-slate-800">Şifre & Güvenlik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-8 px-8">
                            <div className="space-y-3">
                                <Label className="text-slate-700 font-medium">Mevcut Şifre</Label>
                                <Input type="password" className="h-12 border-slate-200 bg-slate-50/30" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-medium">Yeni Şifre</Label>
                                    <Input type="password" className="h-12 border-slate-200 bg-slate-50/30" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-medium">Yeni Şifre (Tekrar)</Label>
                                    <Input type="password" className="h-12 border-slate-200 bg-slate-50/30" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 rounded-b-2xl px-8 py-4 border-t border-slate-100">
                            <Button className="bg-slate-900 text-white hover:bg-slate-800 px-6">Şifreyi Güncelle</Button>
                        </CardFooter>
                    </Card>
                    <Card className="border-none shadow-md bg-white rounded-2xl border-l-4 border-l-red-500">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <LogOut className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-800">Oturum</CardTitle>
                                    <CardDescription>Güvenli çıkış yapın.</CardDescription>
                                </div>
                            </div>

                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" onClick={() => logout()} className="w-full md:w-auto bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20">
                                <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
