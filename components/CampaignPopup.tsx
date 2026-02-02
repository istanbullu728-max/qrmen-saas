"use client"

import { useState, useEffect } from "react"
import { X, Megaphone, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"

type Campaign = {
    id: string
    title: string
    description?: string
    price?: number
    isActive: boolean
}

export function CampaignPopup({ campaigns }: { campaigns: Campaign[] }) {
    const [isVisible, setIsVisible] = useState(false)
    const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null)

    useEffect(() => {
        // Find first active campaign
        const campaign = campaigns.find(c => c.isActive)
        if (campaign) {
            setActiveCampaign(campaign)

            // Show after a small delay for nice entrance
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 1000)

            // Auto close after 30 seconds as requested
            const closeTimer = setTimeout(() => {
                setIsVisible(false)
            }, 30000)

            return () => {
                clearTimeout(timer)
                clearTimeout(closeTimer)
            }
        }
    }, [campaigns])

    if (!activeCampaign) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center pointer-events-none">
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto max-w-sm w-full"
                    >
                        <Card className="bg-gradient-to-br from-slate-900 via-zinc-900 to-black text-white shadow-2xl border border-white/10 relative overflow-hidden ring-1 ring-white/20">
                            {/* Decorative background circle */}
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 text-primary-foreground/70 hover:text-white hover:bg-white/20 rounded-full"
                                onClick={() => setIsVisible(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <CardContent className="p-4 flex gap-4 items-center">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 animate-bounce">
                                    <Megaphone className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80 mb-0.5">
                                        Fırsat Yakala!
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight">
                                        {activeCampaign.title}
                                    </h3>
                                    {activeCampaign.description && (
                                        <p className="text-sm text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                                            {activeCampaign.description}
                                        </p>
                                    )}
                                </div>
                                {activeCampaign.price && (
                                    <div className="flex flex-col items-center justify-center bg-white text-primary font-bold rounded-lg px-3 py-2 min-w-[70px] shadow-sm">
                                        <span className="text-xl">{activeCampaign.price}₺</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
