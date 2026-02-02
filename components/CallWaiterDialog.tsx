"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Utensils, Receipt, BellRing, Clock } from "lucide-react"
import { toast } from "sonner"
import { createWaiterCall } from "@/app/actions"

export function CallWaiterDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [tableNo, setTableNo] = useState("")
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0) // Remaining seconds

    // Check cooldown on mount and loop
    useEffect(() => {
        const checkCooldown = () => {
            const lastCall = localStorage.getItem('lastWaiterCall')
            if (lastCall) {
                const diff = Date.now() - parseInt(lastCall)
                const COOLDOWN_MS = 2 * 60 * 1000 // 2 minutes
                if (diff < COOLDOWN_MS) {
                    setCooldown(Math.ceil((COOLDOWN_MS - diff) / 1000))
                } else {
                    setCooldown(0)
                }
            }
        }

        checkCooldown()
        const timer = setInterval(checkCooldown, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleCall = async (type: string, note: string) => {
        if (!tableNo.trim()) {
            toast.error("Lütfen masa numaranızı giriniz.")
            return
        }

        if (cooldown > 0) {
            toast.warning(`Lütfen bekleyiniz: ${cooldown} saniye`)
            return
        }

        setLoading(true)
        try {
            const res = await createWaiterCall({
                tableId: tableNo,
                type,
                note
            })

            if (res.success) {
                toast.success(res.message)
                localStorage.setItem('lastWaiterCall', Date.now().toString())
                setIsOpen(false)
                // Cooldown will be updated by effect
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error("Bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-[#FDFBF7] border-none shadow-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-serif text-[#2C3E50]">Garson Çağır</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {cooldown > 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                            <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
                            <p className="text-lg font-medium text-amber-700">Talebiniz İletildi</p>
                            <p className="text-sm text-gray-500">
                                Yeni bir çağrı yapmadan önce lütfen bekleyiniz.<br />
                                <span className="font-bold text-xl block mt-2">{cooldown} sn</span>
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-50"
                            >
                                Tamam
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="tableNo" className="text-[#8D7F68] font-semibold">Masa Numaranız</Label>
                                <Input
                                    id="tableNo"
                                    value={tableNo}
                                    onChange={(e) => setTableNo(e.target.value)}
                                    placeholder="Örn: 5, Bahçe-2"
                                    className="border-[#8D7F68]/30 focus:border-[#D35400] bg-white h-12 text-lg"
                                />
                            </div>

                            <div className="grid gap-3">
                                <Button
                                    onClick={() => handleCall('ORDER', 'Sipariş')}
                                    disabled={loading}
                                    className="h-14 bg-[#5D6D3A] hover:bg-[#4B582E] text-white rounded-xl text-lg font-medium justify-start px-6 gap-4 shadow-md active:scale-[0.98] transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <Utensils size={18} />
                                    </div>
                                    Sipariş Vermek
                                </Button>
                                <Button
                                    onClick={() => handleCall('PAYMENT', 'Hesap')}
                                    disabled={loading}
                                    className="h-14 bg-[#2C3E50] hover:bg-[#1A252F] text-white rounded-xl text-lg font-medium justify-start px-6 gap-4 shadow-md active:scale-[0.98] transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <Receipt size={18} />
                                    </div>
                                    Hesap İste
                                </Button>
                                <Button
                                    onClick={() => handleCall('SERVICE', 'Garson')}
                                    disabled={loading}
                                    className="h-14 bg-[#D35400] hover:bg-[#A04000] text-white rounded-xl text-lg font-medium justify-start px-6 gap-4 shadow-md active:scale-[0.98] transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <BellRing size={18} />
                                    </div>
                                    Garson Çağır
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
