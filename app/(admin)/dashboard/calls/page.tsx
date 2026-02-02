"use client"

import { useState, useEffect, useRef } from "react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"
import { Check, Bell, Clock, RefreshCcw, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { getWaiterCalls, completeCall } from "@/app/actions"

// No external files -> No errors. Pure Math.
type WaiterCall = {
    id: string
    tableNo: string
    timestamp: number
    status: 'pending' | 'completed'
}

export default function WaiterCallsPage() {
    const [calls, setCalls] = useState<WaiterCall[]>([])
    const [loading, setLoading] = useState(true)
    const previousCallCount = useRef(0)

    // Web Audio Context
    const audioCtxRef = useRef<AudioContext | null>(null)
    const [soundReady, setSoundReady] = useState(false)

    useEffect(() => {
        // Initialize AudioContext on mount (suspended state)
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            audioCtxRef.current = new AudioContext();
        }

        // Unlock function
        const unlockAudio = () => {
            if (audioCtxRef.current) {
                if (audioCtxRef.current.state === 'suspended') {
                    audioCtxRef.current.resume().then(() => {
                        setSoundReady(true)
                    });
                } else {
                    setSoundReady(true)
                }
            }
        }

        // Listen for ANY interaction to unlock sound
        const handleInteraction = () => {
            unlockAudio()
        }

        document.addEventListener('click', handleInteraction)
        document.addEventListener('keydown', handleInteraction)
        document.addEventListener('touchstart', handleInteraction)

        return () => {
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('keydown', handleInteraction)
            document.removeEventListener('touchstart', handleInteraction)
            audioCtxRef.current?.close()
        }
    }, [])

    const playReceptionBell = () => {
        const ctx = audioCtxRef.current;
        if (!ctx || !soundReady) return;

        try {
            const t = ctx.currentTime;

            // Fundamental Frequency (High Ring)
            const fundamental = 1200;

            // Create 3 oscillators for a "metallic" bell overtones
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator(); // Inharmonic
            const osc3 = ctx.createOscillator(); // High shimmer

            const gainMain = ctx.createGain();

            osc1.connect(gainMain);
            osc2.connect(gainMain);
            osc3.connect(gainMain);
            gainMain.connect(ctx.destination);

            osc1.type = "sine";
            osc1.frequency.setValueAtTime(fundamental, t);

            osc2.type = "sine";
            osc2.frequency.setValueAtTime(fundamental * 1.6, t); // Overtone

            osc3.type = "triangle";
            osc3.frequency.setValueAtTime(fundamental * 2.4, t); // High overtone

            // Envelope (Sharp attack, long decay)
            gainMain.gain.setValueAtTime(0, t);
            gainMain.gain.linearRampToValueAtTime(0.5, t + 0.01); // Hit
            gainMain.gain.exponentialRampToValueAtTime(0.001, t + 2.5); // Ring out

            osc1.start(t);
            osc2.start(t);
            osc3.start(t);

            const stopTime = t + 2.5;
            osc1.stop(stopTime);
            osc2.stop(stopTime);
            osc3.stop(stopTime);

        } catch (e) {
            console.error("Audio synth error", e)
        }
    }

    const testSound = () => {
        if (!soundReady) {
            // Force unlock if button clicked directly
            if (audioCtxRef.current?.state === 'suspended') {
                audioCtxRef.current.resume().then(() => {
                    setSoundReady(true)
                    playReceptionBell()
                    toast.success("Test sesi çalıştı!")
                })
            }
        } else {
            playReceptionBell()
            toast.success("Test sesi çalıştı!")
        }
    }

    const fetchCalls = async () => {
        try {
            const data = await getWaiterCalls()
            // Check for new calls
            if (data.length > previousCallCount.current) {
                // Play bell
                playReceptionBell()

                toast.info("YENİ GARSON ÇAĞRISI!", {
                    description: `Masa ${data[0].tableNo} servis bekliyor.`,
                    icon: <Bell className="h-5 w-5 text-primary" />,
                    duration: 5000
                })
            }
            previousCallCount.current = data.length
            setCalls(data as WaiterCall[])
        } catch (error) {
            console.error("Failed to fetch calls", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCalls()
        const interval = setInterval(fetchCalls, 3000)
        return () => clearInterval(interval)
    }, [soundReady]) // Dependency ensures we retry playing if soundReady status changes

    const handleComplete = async (id: string) => {
        try {
            await completeCall(id)
            setCalls(prev => prev.filter(c => c.id !== id))
            previousCallCount.current = Math.max(0, previousCallCount.current - 1)
            toast.success("Çağrı tamamlandı")
        } catch (error) {
            toast.error("İşlem başarısız")
        }
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-4 md:p-8 md:pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Garson Çağrıları</h2>
                    <p className="text-slate-500">Masalardan gelen çağrıları buradan takip edin.</p>
                </div>

                <div className="flex items-center space-x-2">
                    {soundReady ? (
                        <div className="flex items-center text-sm text-green-700 bg-green-100 px-4 py-2 rounded-full border border-green-200 shadow-sm font-medium animate-in fade-in">
                            <Volume2 className="mr-2 h-4 w-4" /> Ses Sistemi Aktif
                        </div>
                    ) : (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={testSound}
                            className="animate-pulse shadow-red-500/20 shadow-lg"
                        >
                            <VolumeX className="mr-2 h-4 w-4" /> Sesi Etkinleştir
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={fetchCalls} className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200">
                        <RefreshCcw className="mr-2 h-4 w-4" /> Yenile
                    </Button>
                </div>
            </div>

            {!soundReady && (
                <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2 border-none shadow-lg shadow-red-500/10 bg-red-50 text-red-900 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-2 rounded-full">
                            <VolumeX className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <AlertTitle className="text-lg font-bold text-red-800">Ses İzni Bekleniyor</AlertTitle>
                            <AlertDescription className="text-red-700/80 mt-1">
                                Sesli bildirimleri açmak için <strong>herhangi bir yere tıklayın</strong>.
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            )}

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loading && <p className="text-slate-500 animate-pulse">Yükleniyor...</p>}

                {!loading && calls.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400">
                        <div className="bg-white p-6 rounded-full shadow-sm mb-6 ring-1 ring-slate-100">
                            <Bell className="h-10 w-10 text-slate-300" />
                        </div>
                        <p className="text-xl font-bold text-slate-700">Bekleyen çağrı yok</p>
                        <p className="text-sm text-slate-500 mt-1">Şu an tüm masalar memnun görünüyor.</p>
                    </div>
                )}

                {calls.map((call) => (
                    <Card key={call.id} className="border-none shadow-md bg-white hover:shadow-xl transition-all duration-300 animate-in fade-in zoom-in-95 group overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                        <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-50">
                            <CardTitle className="flex justify-between items-center text-2xl font-bold text-slate-800">
                                <span>Masa {call.tableNo}</span>
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-3 py-1">Bekliyor</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center text-slate-500 mb-8 bg-slate-50 rounded-lg p-3">
                                <Clock className="mr-3 h-5 w-5 text-indigo-400" />
                                <span className="font-medium text-lg">{formatDistanceToNow(call.timestamp, { addSuffix: true, locale: tr })}</span>
                            </div>
                            <Button className="w-full font-bold h-12 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95" onClick={() => handleComplete(call.id)}>
                                <Check className="mr-2 h-5 w-5" /> Çağrıyı Tamamla
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
