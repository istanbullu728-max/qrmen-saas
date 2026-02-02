"use client"

import { useState, useRef, useEffect } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Printer, Save, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function QRPage() {
    const printRef = useRef<HTMLDivElement>(null)

    // State for slug and baseUrl
    const [slug, setSlug] = useState("my-restaurant")
    const [baseUrl, setBaseUrl] = useState("")
    const [isLocalhost, setIsLocalhost] = useState(false)
    const [manualIp, setManualIp] = useState("192.168.1.102")

    const PORT = "3000"

    // Bulk QR State
    const [startTable, setStartTable] = useState(1)
    const [endTable, setEndTable] = useState(10)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const origin = window.location.origin
            setBaseUrl(origin)

            // Check if user is on localhost
            if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
                setIsLocalhost(true)
            }
        }
    }, [])

    const getUrl = (tNo?: string | number) => {
        const queryParams = tNo ? `?table=${tNo}` : ""
        const domain = isLocalhost ? `http://${manualIp}:${PORT}` : baseUrl
        return `${domain}/${slug}${queryParams}`
    }

    const handleSlugSave = () => {
        toast.success("Restoran linki güncellendi!")
    }

    const handlePrint = () => {
        // Clone the container to modify it safely
        const container = printRef.current
        if (!container) return

        // We need to convert canvases to images because raw canvas doesn't print well in new window via innerHTML
        // However, innerHTML doesn't copy canvas content.
        // Strategy: Create a temporary container, copy HTML, then replace canvas placeholders with real images

        // Better Strategy: Open window, write HTML, then manually draw images? 
        // Easiest: Convert all canvases in ref to dataURLs first.

        const canvases = container.querySelectorAll("canvas")
        const imageUrls: string[] = []
        canvases.forEach(canvas => {
            imageUrls.push(canvas.toDataURL("image/png"))
        })

        const win = window.open('', '', 'height=700,width=1000')
        if (win) {
            win.document.write('<html><head><title>QR Kodları Yazdır</title>')
            win.document.write('<style>')
            win.document.write(`
                body { font-family: sans-serif; padding: 20px; }
                .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                .qr-item { border: 1px solid #ddd; padding: 20px; text-align: center; page-break-inside: avoid; border-radius: 10px; }
                .qr-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; display: block; }
                .qr-url { font-size: 10px; color: #555; margin-top: 5px; word-break: break-all; }
                .qr-img { width: 160px; height: 160px; }
                @media print {
                    .no-print { display: none; }
                }
            `)
            win.document.write('</style></head><body>')

            // Construct HTML manually to inject images
            let htmlContent = '<div class="qr-grid">'
            bulkTables.forEach((tNum, index) => {
                htmlContent += `
                    <div class="qr-item">
                        <span class="qr-title">MASA ${tNum}</span>
                        <img src="${imageUrls[index]}" class="qr-img" />
                        <span class="qr-url">${slug}?table=${tNum}</span>
                    </div>
                `
            })
            htmlContent += '</div>'

            win.document.write(htmlContent)
            win.document.write('</body></html>')
            win.document.close()
            win.focus()
            setTimeout(() => win.print(), 500)
        }
    }

    const handleDownloadPdf = async () => {
        try {
            const { jsPDF } = await import("jspdf")
            const html2canvas = (await import("html2canvas")).default

            if (!printRef.current) return

            toast.info("PDF hazırlanıyor...")

            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                backgroundColor: "#ffffff"
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`qr-masalar-${startTable}-${endTable}.pdf`)

            toast.success("PDF indirildi.")
        } catch (error) {
            console.error(error)
            toast.error("PDF oluşturulurken hata oluştu.")
        }
    }

    // Generate array for bulk
    const bulkTables = Array.from({ length: (endTable - startTable) + 1 }, (_, i) => startTable + i)

    return (
        <div className="flex-1 space-y-8 p-4 pt-4 md:p-8 md:pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">QR Kod Oluştur</h2>
                    <p className="text-slate-500">Masalarınız için toplu olarak QR kod oluşturun ve yazdırın.</p>
                </div>
            </div>

            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                {/* Settings Column */}
                <div className="space-y-8 lg:col-span-1">
                    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg text-slate-800">Menü Ayarları</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="text-slate-700 font-medium">Link Adı (Slug)</Label>
                                <div className="flex items-center gap-0 shadow-sm rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                        className="font-medium h-10 border-none focus-visible:ring-0 rounded-none bg-white text-slate-900 pl-3"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSlugSave} size="sm" variant="outline" className="w-full">
                                <Save className="mr-2 h-4 w-4" /> Kaydet
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg text-slate-800">Masa Aralığı</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Başlangıç</Label>
                                    <Input
                                        type="number"
                                        value={startTable}
                                        onChange={(e) => setStartTable(Number(e.target.value))}
                                        min={1}
                                        className="bg-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Bitiş</Label>
                                    <Input
                                        type="number"
                                        value={endTable}
                                        onChange={(e) => setEndTable(Number(e.target.value))}
                                        min={startTable}
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button onClick={handlePrint} className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 text-md">
                                    <Printer className="mr-2 h-5 w-5" /> Yazdır
                                </Button>
                                <Button onClick={handleDownloadPdf} className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 text-md">
                                    <Download className="mr-2 h-5 w-5" /> PDF İndir
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden h-full flex flex-col">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg text-slate-800">Önizleme ({bulkTables.length} Adet)</CardTitle>
                            <CardDescription>Yazdıra basıldığında bu liste A4 düzeninde açılacaktır.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 flex-1 bg-slate-50/50">
                            <div className="border rounded-xl p-6 bg-white max-h-[600px] overflow-y-auto shadow-sm">
                                <div ref={printRef} className="qr-grid grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {bulkTables.map((tNum) => (
                                        <div key={tNum} className="qr-item flex flex-col items-center p-4 rounded-xl border border-slate-100 shadow-sm bg-white">
                                            {/* Simplified Title: Just the number, large and bold. 
                                                If users want 'Masa' written, they can add it, or we add it once properly.
                                                User complained about 'Masa Masa 1'. So let's just write 'Mas 1' or simply the number if preferred.
                                                Actually, 'Masa 1' is standard. I'll make sure it's just 'Masa {tNum}'.
                                            */}
                                            <span className="qr-title font-bold text-2xl mb-2 text-slate-900">MASA {tNum}</span>

                                            <QRCodeCanvas
                                                value={getUrl(tNum)}
                                                size={160}
                                                level={"M"}
                                                includeMargin={true}
                                            />
                                            <span className="qr-url text-[10px] text-slate-400 mt-2 font-mono break-all text-center leading-tight">
                                                {slug}?table={tNum}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
