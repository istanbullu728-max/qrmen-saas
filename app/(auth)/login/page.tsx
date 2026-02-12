"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChefHat, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await signInWithEmailAndPassword(auth, email, password)
            toast.success("Giriş başarılı! Yönlendiriliyorsunuz...")
            router.push("/dashboard")
        } catch (error: any) {
            console.error(error)
            let message = "Giriş yapılamadı."
            if (error.code === 'auth/invalid-credential') message = "Hatalı e-posta veya şifre."
            if (error.code === 'auth/user-not-found') message = "Kullanıcı bulunamadı."
            if (error.code === 'auth/wrong-password') message = "Hatalı şifre."
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <ChefHat className="h-8 w-8" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Tekrar Hoşgeldiniz</CardTitle>
                <CardDescription>
                    Yönetim paneline erişmek için giriş yapın
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta Adresi</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="ornek@restoran.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Şifre</Label>
                            <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                Şifremi unuttum?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Giriş Yapılıyor...
                            </>
                        ) : (
                            <>
                                Giriş Yap <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-primary/20 hover:bg-primary/5"
                        onClick={async () => {
                            const { simulateLogin } = await import("@/app/actions")
                            await simulateLogin()
                            toast.success("Demo Girişi Başarılı!")
                            router.push("/dashboard")
                        }}
                    >
                        Demo Girişi (Şifresiz)
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
                <div className="text-sm text-muted-foreground">
                    Hesabınız yok mu?{" "}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        Hemen Kaydolun
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
