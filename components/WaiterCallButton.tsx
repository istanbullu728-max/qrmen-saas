"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BellRing, X, Check, Utensils, GlassWater, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createWaiterCall } from "@/app/actions"

export function WaiterCallButton({ tableId }: { tableId?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [inputTableId, setInputTableId] = useState("")

    const handleCall = async (type: string, note: string) => {
        const targetTable = tableId || inputTableId;

        if (!targetTable) {
            const userInput = prompt("Lütfen masa numaranızı giriniz:");
            if (!userInput) return;
            // Update state purely for logic, though prompt is synchronous
            // A better UI would be a dialog input, using prompt for speed now as requested "Practical Minimalist"
            // Actually, let's use the nice UI if tableId is missing, but prompt inside the handleCall logic for now or rely on pre-set input in a dialog.
            // Simplified: If no tableId from URL, we ask for it.
            return handleCallWithId(userInput, type, note);
        }
        return handleCallWithId(targetTable, type, note);
    }

    const handleCallWithId = async (tId: string, type: string, note: string) => {
        setLoading(true)
        try {
            await createWaiterCall({
                tableId: tId,
                type,
                note
            })
            toast.success("Garsona haber verildi.", {
                description: `Masa ${tId} için talebiniz iletildi.`
            })
            setIsOpen(false)
        } catch (error) {
            toast.error("Bir sorun oluştu.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* FAB Button - Premium Glass */}
            <motion.button
                layoutId="waiter-fab"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition-all group"
            >
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <BellRing className="w-6 h-6 relative z-10" />
            </motion.button>

            {/* Overlay Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        <motion.div
                            layoutId="waiter-fab"
                            className="fixed bottom-6 right-6 z-50 w-[300px] bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
                            style={{ borderRadius: 24 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-white font-serif font-bold text-lg">Garson Çağır</h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="grid gap-3">
                                <CallOption
                                    icon={Utensils}
                                    label="Sipariş Vermek İstiyorum"
                                    onClick={() => handleCall('ORDER', 'Sipariş')}
                                    disabled={loading}
                                />
                                <CallOption
                                    icon={Receipt}
                                    label="Hesabı İsterim"
                                    onClick={() => handleCall('PAYMENT', 'Hesap')}
                                    disabled={loading}
                                />
                                <CallOption
                                    icon={GlassWater}
                                    label="Su / Servis İsteği"
                                    onClick={() => handleCall('SERVICE', 'Su')}
                                    disabled={loading}
                                />
                            </div>

                            <p className="text-center text-[10px] text-neutral-500 mt-6 tracking-widest uppercase">
                                Masa: 05 • Salon
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

function CallOption({ icon: Icon, label, onClick, disabled }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-500/30 transition-all text-left group active:scale-[0.98]"
        >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-neutral-200 group-hover:text-white">{label}</span>
        </button>
    )
}
