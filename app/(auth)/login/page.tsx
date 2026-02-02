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
import { simulateLogin } from "@/app/actions"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Simulate delay for realism
            await new Promise(resolve => setTimeout(resolve, 1500))

            // In a real app we'd validate properly
            // For now, allow any non-empty login
            if (email && password) {
                // Set cookie or session logic here via Server Action
                await simulateLogin()

                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...")
                router.push("/dashboard")
            } else {
                toast.error("Lütfen tüm alanları doldurun.")
            }
        } catch (error) {
            toast.error("Giriş yapılamadı. Tekrar deneyin.")
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
