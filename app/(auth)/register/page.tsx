"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChefHat, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function RegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState(1) // 1: Info, 2: Success
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            // Optional: Update profile with name
            // await updateProfile(auth.currentUser!, { displayName: formData.name })

            setStep(2)
            toast.success("Hesap oluşturuldu!")
        } catch (error: any) {
            console.error(error)
            let message = "Hata oluştu."
            if (error.code === 'auth/email-already-in-use') message = "Bu e-posta zaten kullanımda."
            if (error.code === 'auth/weak-password') message = "Şifre çok zayıf."
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    if (step === 2) {
        return (
            <Card className="border-2 shadow-lg text-center p-6">
                <CardContent className="pt-6 space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Aramıza Hoşgeldiniz!</h2>
                        <p className="text-muted-foreground">
                            Hesabınız başarıyla oluşturuldu. <br />
                            Şimdi restoranınızı dijitalleştirmeye başlayın.
                        </p>
                    </div>
                    <Button size="lg" className="w-full" onClick={() => router.push("/dashboard")}>
                        Panele Git
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <ChefHat className="h-8 w-8" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Hesap Oluşturun</CardTitle>
                <CardDescription>
                    30 gün ücretsiz deneme. Kredi kartı gerekmez.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Restoran Adı</Label>
                        <Input
                            id="name"
                            placeholder="Örn: Lezzet Durağı"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta Adresi</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="isim@sirket.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre Belirleyin</Label>
                        <Input
                            id="password"
                            type="password"
                            minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kayıt Yapılıyor...
                            </>
                        ) : (
                            "Ücretsiz Başla"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
                <div className="text-sm text-muted-foreground">
                    Zaten hesabınız var mı?{" "}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Giriş Yap
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
