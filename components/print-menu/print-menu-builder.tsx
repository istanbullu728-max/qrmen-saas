"use client";

import { useState, useRef, useEffect } from "react";
import { PrintPreview } from "./print-preview";
import { templates } from "./templates";
import { paginateMenu, MenuItem } from "./pagination-utils"; // Import paginate for auto-scale logic
import { Button } from "@/components/ui/button";
import { Download, LayoutTemplate, Type, Scaling, Image as ImageIcon, Check, Wand2, Star, Palette, FileText, ImageOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PrintMenuBuilderProps {
    categories: any[];
    restaurantInfo: any;
}

// --- CONFIGURATION CONSTANTS ---

const COLOR_PALETTES = [
    { id: "default", name: "Varsayılan", color: "#64748b" }, // Fallback to template
    { id: "emerald", name: "Zümrüt", color: "#059669", styles: { primaryColor: "#059669", header: "text-emerald-700", category: "text-emerald-600", price: "text-emerald-700" } },
    { id: "indigo", name: "İndigo", color: "#4f46e5", styles: { primaryColor: "#4f46e5", header: "text-indigo-700", category: "text-indigo-600", price: "text-indigo-700" } },
    { id: "rose", name: "Gül", color: "#e11d48", styles: { primaryColor: "#e11d48", header: "text-rose-700", category: "text-rose-600", price: "text-rose-700" } },
    { id: "amber", name: "Kehribar", color: "#d97706", styles: { primaryColor: "#d97706", header: "text-amber-700", category: "text-amber-600", price: "text-amber-700" } },
    { id: "slate", name: "Antrasit", color: "#1e293b", styles: { primaryColor: "#1e293b", header: "text-slate-900", category: "text-slate-700", price: "text-slate-900" } },
    { id: "black", name: "Siyah", color: "#000000", styles: { primaryColor: "#000000", header: "text-black", category: "text-black", price: "text-black" } },
    { id: "purple", name: "Mor", color: "#7c3aed", styles: { primaryColor: "#7c3aed", header: "text-purple-700", category: "text-purple-600", price: "text-purple-700" } },
    { id: "cyan", name: "Okyanus", color: "#0891b2", styles: { primaryColor: "#0891b2", header: "text-cyan-700", category: "text-cyan-600", price: "text-cyan-700" } },
];

const FONT_PAIRINGS = [
    { id: "default", name: "Varsayılan" },
    { id: "modern", name: "Modern Sans", header: "font-[family-name:var(--font-inter)]", body: "font-[family-name:var(--font-inter)]" },
    { id: "serif", name: "Classic Serif", header: "font-[family-name:var(--font-playfair)]", body: "font-[family-name:var(--font-lato)]" },
    { id: "hand", name: "El Yazısı", header: "font-[family-name:var(--font-dancing)]", body: "font-[family-name:var(--font-quicksand)]" },
    { id: "bold", name: "Güçlü & Tok", header: "font-[family-name:var(--font-oswald)]", body: "font-[family-name:var(--font-raleway)]" },
    { id: "retro", name: "Retro", header: "font-[family-name:var(--font-cinzel)]", body: "font-[family-name:var(--font-cormorant)]" },
    { id: "friendly", name: "Samimi", header: "font-[family-name:var(--font-amatic)]", body: "font-[family-name:var(--font-quicksand)]" },
    { id: "minimal", name: "Minimal", header: "font-[family-name:var(--font-raleway)]", body: "font-[family-name:var(--font-lato)]" },
];

export function PrintMenuBuilder({ categories, restaurantInfo }: PrintMenuBuilderProps) {
    // Local state for reordering
    const [localCategories, setLocalCategories] = useState(categories);
    const [selectedTemplateId, setSelectedTemplateId] = useState("modern");

    // Mobile Tab State
    const [mobileTab, setMobileTab] = useState<"design" | "preview">("design");

    // Customization State
    const [selectedPaletteId, setSelectedPaletteId] = useState("default");
    const [selectedFontId, setSelectedFontId] = useState("default");
    const [paperSize, setPaperSize] = useState<"a4" | "a5">("a4");

    const [spacingScale, setSpacingScale] = useState(1);
    const [fontScale, setFontScale] = useState(1);
    const [showImages, setShowImages] = useState(true);
    const [imageShape, setImageShape] = useState<"square" | "circle" | "rounded">("rounded");

    const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState(false);
    const [isAutoScaling, setIsAutoScaling] = useState(false);
    const [publicUrl, setPublicUrl] = useState("https://example.com/menu");

    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPublicUrl(`${window.location.origin}`);
        }
    }, []);

    // Sync categories from props if they update (e.g. data fetching)
    useEffect(() => {
        if (categories && categories.length > 0) {
            setLocalCategories(categories);
        }
    }, [categories]);

    const processedCategories = localCategories.map(cat => ({
        ...cat,
        products: cat.products.map((p: any) => ({
            ...p,
            isHighlighted: highlightedIds.has(p.id)
        }))
    }));

    const handleMoveProduct = (categoryId: string, productId: string, direction: 'up' | 'down') => {
        setLocalCategories(prevCats => {
            return prevCats.map(cat => {
                if (cat.id !== categoryId) return cat;

                const products = [...cat.products];
                const index = products.findIndex(p => p.id === productId);
                if (index === -1) return cat;

                if (direction === 'up' && index > 0) {
                    // Swap with previous
                    [products[index], products[index - 1]] = [products[index - 1], products[index]];
                } else if (direction === 'down' && index < products.length - 1) {
                    // Swap with next
                    [products[index], products[index + 1]] = [products[index + 1], products[index]];
                }

                return { ...cat, products };
            });
        });
    };

    const toggleHighlight = (id: string) => {
        const newSet = new Set(highlightedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setHighlightedIds(newSet);
    }

    const handleAutoScale = () => {
        setIsAutoScaling(true);
        setTimeout(() => {
            const template = templates[selectedTemplateId];
            let bestFont = 1.0;
            let bestSpacing = 1.0;
            let minPages = 999;

            for (let f = 1.1; f >= 0.85; f -= 0.05) {
                for (let s = 1.1; s >= 0.8; s -= 0.1) {
                    const pages = paginateMenu(processedCategories, template, s, showImages);
                    if (pages.length < minPages) {
                        minPages = pages.length;
                        bestFont = f;
                        bestSpacing = s;
                    }
                }
            }
            setFontScale(bestFont);
            setSpacingScale(bestSpacing);
            setIsAutoScaling(false);
        }, 600);
    };

    const handleAddTestContent = () => {
        setLocalCategories(prev => [...prev, ...prev.map(c => ({ ...c, id: c.id + '_copy', name: c.name + ' (Kopya)' }))]);
    };

    const handleDownload = async () => {
        if (!previewRef.current) return;
        setIsExporting(true);

        try {
            // Adjust PDF size based on selection
            const pdf = new jsPDF("p", "mm", paperSize);
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const pages = previewRef.current.children;

            for (let i = 0; i < pages.length; i++) {
                const pageElement = pages[i] as HTMLElement;
                const canvas = await html2canvas(pageElement, {
                    scale: 3, // High Res
                    useCORS: true,
                    logging: false,
                    backgroundColor: "#ffffff",
                });

                const imgData = canvas.toDataURL("image/jpeg", 0.95);
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
            }

            pdf.save(`${restaurantInfo.name.replace(/\s+/g, '-').toLowerCase()}-baski-menu-${paperSize}.pdf`);
        } catch (error) {
            console.error("Export failed", error);
            alert("PDF oluşturulurken bir hata oluştu.");
        } finally {
            setIsExporting(false);
        }
    };

    // Prepare override styles
    const activePalette = COLOR_PALETTES.find(p => p.id === selectedPaletteId);
    const activeFont = FONT_PAIRINGS.find(p => p.id === selectedFontId);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] lg:bg-slate-50 lg:overflow-hidden lg:rounded-xl lg:border lg:border-slate-200 lg:shadow-sm relative">

            {/* MOBILE TAB NAVIGATION (Visible only on mobile) */}
            <div className="lg:hidden p-2 bg-white border-b border-slate-200 flex gap-2 flex-none z-30">
                <Button
                    variant={mobileTab === 'design' ? 'default' : 'outline'}
                    className={cn("flex-1", mobileTab === 'design' ? "bg-indigo-600" : "")}
                    onClick={() => setMobileTab('design')}
                >
                    <Palette className="w-4 h-4 mr-2" /> Tasarım
                </Button>
                <Button
                    variant={mobileTab === 'preview' ? 'default' : 'outline'}
                    className={cn("flex-1", mobileTab === 'preview' ? "bg-indigo-600" : "")}
                    onClick={() => setMobileTab('preview')}
                >
                    <FileText className="w-4 h-4 mr-2" /> Önizleme
                </Button>
            </div>

            {/* Sidebar with FIXED Layout Strategy */}
            <aside className={cn(
                "w-full lg:w-[450px] flex-none border-b lg:border-b-0 lg:border-r border-slate-200 bg-white shadow-sm flex flex-col h-full z-20 relative",
                mobileTab === 'preview' ? "hidden lg:flex" : "flex"
            )}>
                <div className="p-4 border-b flex items-center justify-between bg-white flex-none z-10">
                    <h2 className="font-semibold text-slate-800">Tasarım Stüdyosu</h2>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">BETA v3.1</span>
                </div>

                {/* NATIVE SCROLL CONTAINER - Removing ScrollArea for reliability */}
                <div className="flex-1 w-full overflow-y-auto custom-scrollbar relative">
                    <div className="p-6 space-y-8 pb-48">

                        {/* TOP CONTROLS: Image Toggle */}
                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn("p-2 rounded-lg transition-colors", showImages ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500")}>
                                    <ImageIcon size={20} />
                                </div>
                                <div>
                                    <Label className="text-sm font-bold text-slate-900 cursor-pointer" htmlFor="img-toggle">Görselli Menü</Label>
                                    <p className="text-[10px] text-slate-500 leading-tight">Ürün görsellerini göster</p>
                                </div>
                            </div>
                            <Switch
                                id="img-toggle"
                                checked={showImages}
                                onCheckedChange={setShowImages}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>

                        {/* Templates Carousel */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b">
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                                    <LayoutTemplate size={18} />
                                    <h3>Şablonlar</h3>
                                </div>
                                {/* DEBUG TOOL: Quick Page Filler */}
                                <Button variant="ghost" size="xs" onClick={handleAddTestContent} className="text-[10px] h-6 text-slate-400 hover:text-indigo-600">
                                    + Test Sayfaları Ekle
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.values(templates).map(tmpl => (
                                    <button
                                        key={tmpl.id}
                                        onClick={() => setSelectedTemplateId(tmpl.id)}
                                        className={cn(
                                            "p-3 rounded-lg border-2 text-left transition-all relative overflow-hidden group hover:border-indigo-300",
                                            selectedTemplateId === tmpl.id
                                                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-200"
                                                : "border-slate-100 bg-white"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.primaryColor }}></div>
                                            <span className="block font-bold text-sm text-slate-800 line-clamp-1">{tmpl.name}</span>
                                        </div>
                                        <span className="text-[10px] items-start text-slate-500 line-clamp-2 leading-tight h-8">{tmpl.description}</span>
                                        {selectedTemplateId === tmpl.id && (
                                            <div className="absolute top-2 right-2 text-indigo-600">
                                                <Check size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PAPER SIZE SELECTOR */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold pb-2 border-b">
                                <FileText size={18} />
                                <h3>Kağıt Boyutu</h3>
                            </div>
                            <Tabs value={paperSize} onValueChange={(v: any) => setPaperSize(v)} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="a4">A4 (21 x 29.7 cm)</TabsTrigger>
                                    <TabsTrigger value="a5">A5 (14.8 x 21 cm)</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* CUSTOMIZATION: COLOR & FONTS */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold pb-2 border-b">
                                <Palette size={18} />
                                <h3>Özelleştirme</h3>
                            </div>

                            {/* Color Palettes */}
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Renk Paleti</Label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_PALETTES.map(palette => (
                                        <button
                                            key={palette.id}
                                            onClick={() => setSelectedPaletteId(palette.id)}
                                            className={cn(
                                                "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative",
                                                selectedPaletteId === palette.id ? "border-slate-800 scale-110 shadow-md" : "border-slate-200 hover:scale-105"
                                            )}
                                            style={{ backgroundColor: palette.color }}
                                            title={palette.name}
                                        >
                                            {palette.id === "default" && <span className="text-[8px] text-white font-bold opacity-70">OTO</span>}
                                            {selectedPaletteId === palette.id && palette.id !== "default" && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Pairings */}
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Yazı Tipi</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FONT_PAIRINGS.map(font => (
                                        <button
                                            key={font.id}
                                            onClick={() => setSelectedFontId(font.id)}
                                            className={cn(
                                                "px-3 py-2 rounded-md border text-sm text-center transition-colors",
                                                selectedFontId === font.id
                                                    ? "bg-slate-800 text-white border-slate-800"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            {font.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Magic AI */}
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-3">
                            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                                <Wand2 size={16} />
                                <h3>Sihirli Değnek</h3>
                            </div>
                            <p className="text-xs text-indigo-600/80">Yazı boyutu ve aralıkları değiştirerek sayfaya tam sığdırır.</p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full bg-white text-indigo-700 hover:bg-indigo-100 border-indigo-200"
                                onClick={handleAutoScale}
                                disabled={isAutoScaling}
                            >
                                {isAutoScaling ? "Hesaplanıyor..." : "✨ Otomatik Sığdır"}
                            </Button>
                        </div>

                        {/* Manual Controls */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold pb-2 border-b">
                                <Scaling size={18} />
                                <h3>İnce Ayarlar</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <Label>Satır Aralığı</Label>
                                        <span className="text-slate-500">{spacingScale.toFixed(1)}x</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {[0.8, 0.9, 1.0, 1.1, 1.2, 1.3].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => setSpacingScale(v)}
                                                className={cn("flex-1 h-8 rounded border text-xs font-medium transition-colors",
                                                    spacingScale === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 hover:bg-slate-50")}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <Label>Yazı Boyutu</Label>
                                        <span className="text-slate-500">{fontScale.toFixed(2)}x</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {[0.85, 0.9, 0.95, 1.0, 1.05, 1.1].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => setFontScale(v)}
                                                className={cn("flex-1 h-8 rounded border text-xs font-medium transition-colors",
                                                    fontScale === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 hover:bg-slate-50")}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-white flex-none z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Button
                        size="lg"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        onClick={handleDownload}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            "Hazırlanıyor..."
                        ) : (
                            <>
                                <Download className="mr-2 h-5 w-5" />
                                PDF İndir ({paperSize.toUpperCase()})
                            </>
                        )}
                    </Button>
                </div>
            </aside>

            {/* Preview Area */}
            <main className={cn(
                "flex-1 bg-slate-100 overflow-y-auto overflow-x-hidden flex justify-center py-6 lg:py-8 px-4 relative z-0",
                mobileTab === 'design' ? "hidden lg:flex" : "flex"
            )}>
                <div className="w-full max-w-4xl flex justify-center">
                    <div ref={previewRef} className={cn("transition-transform duration-300 origin-top mt-2 lg:mt-0 flex-shrink-0", isExporting ? "scale-100" : "scale-[0.42] sm:scale-[0.60] lg:scale-[0.80] xl:scale-[0.85]")}>
                        <PrintPreview
                            categories={processedCategories}
                            templateId={selectedTemplateId}
                            restaurantInfo={restaurantInfo}
                            config={{
                                spacingScale,
                                fontScale,
                                showImages,
                                imageShape,
                                publicUrl,
                                paperSize,
                                isExporting // Pass export state to force list view
                            }}
                            // Overrides
                            // Overrides
                            overrideStyles={activePalette?.styles as any}
                            overrideFonts={activeFont?.header ? { header: activeFont.header, body: activeFont.body } : undefined}
                            onToggleHighlight={toggleHighlight}
                            onMoveProduct={handleMoveProduct}
                        />
                    </div>
                </div>
            </main>

            {/* MOBILE: Persistent Download Button (Fixed Bottom) */}
            <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-indigo-100 lg:hidden z-40 pb-safe">
                <Button
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                    onClick={handleDownload}
                    disabled={isExporting}
                >
                    {isExporting ? (
                        "Hazırlanıyor..."
                    ) : (
                        <>
                            <Download className="mr-2 h-5 w-5" />
                            PDF İndir
                        </>
                    )}
                </Button>
            </div>
        </div >
    );
}
