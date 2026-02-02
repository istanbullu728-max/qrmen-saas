"use client";

import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { MenuTemplate } from "./templates";
import { MenuItem } from "./pagination-utils";
import { Star, ChevronUp, ChevronDown } from "lucide-react";

interface A4PageProps {
    pageIndex: number;
    items: MenuItem[];
    restaurantInfo: any;
    template: MenuTemplate;
    config: {
        spacingScale: number;
        fontScale: number;
        showImages: boolean;
        imageShape: "square" | "circle" | "rounded";
        publicUrl: string;
        paperSize: "a4" | "a5";
    };
    totalPages: number;
    onMoveProduct?: (catId: string, prodId: string, direction: 'up' | 'down') => void;
}

export const A4Page = forwardRef<HTMLDivElement, A4PageProps>(
    (
        {
            pageIndex,
            items,
            restaurantInfo,
            template,
            config,
            totalPages,
            onMoveProduct,
        },
        ref
    ) => {
        // Determine CSS for Image Shape
        const imgShapeClass =
            config.imageShape === "circle" ? "rounded-full aspect-square object-cover" :
                config.imageShape === "rounded" ? "rounded-xl aspect-[4/3] object-cover" :
                    "rounded-none aspect-square object-cover";

        // Dimensions
        const dimensions = config.paperSize === "a5"
            ? { width: "148mm", height: "210mm" }
            : { width: "210mm", height: "297mm" };

        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white relative overflow-hidden text-slate-900 shadow-xl mb-8 print:shadow-none print:mb-0 page-break-after-always",
                    template.background
                )}
                style={{
                    width: dimensions.width,
                    minHeight: dimensions.height, // Use min-height to avoid cut-off in preview if slight overflow
                    height: dimensions.height,
                    padding: `${(config.paperSize === "a5" ? 25 : 40) * config.spacingScale}px`, // Reduced padding for A5
                    fontSize: `${(config.paperSize === "a5" ? 11 : 14) * config.fontScale}px`, // Reduced base font for A5
                    position: "relative",
                    boxSizing: "border-box", // Ensure padding is inside
                }}
            >
                {/* Background Texture/Pattern Layer if any */}
                {/* SKETCH: Paper Texture */}
                {template.id === 'sketch' && (
                    <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/lined-paper.png")' }}></div>
                )}

                {/* COASTAL: Wave Patterns */}
                {template.id === 'coastal' && (
                    <>
                        <div className="absolute top-0 left-0 right-0 h-4 bg-sky-200" style={{ clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)" }}></div>
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-sky-200" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 20%, 50% 0%, 0 20%)" }}></div>
                    </>
                )}

                {/* RETRO: Rounded Border Frame */}
                {template.id === 'retro' && (
                    <div className="absolute inset-4 border-4 border-rose-500/30 rounded-[32px] pointer-events-none"></div>
                )}

                {/* Header Section - Only on First Page */}
                {pageIndex === 0 && (
                    <div className={`mb-8 ${template.fonts.header.includes('border') ? '' : 'pb-4'}`} style={{ marginBottom: `${40 * config.spacingScale}px` }}>
                        <div className="flex flex-col items-center justify-center">
                            {/* COASTAL DECORATION: Anchor Icon */}
                            {template.id === 'coastal' && (
                                <div className="mb-4 text-sky-800">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /></svg>
                                </div>
                            )}

                            {/* SKETCH DECORATION: Doodle lines */}
                            {template.id === 'sketch' && (
                                <svg className="w-48 h-4 text-blue-500 mb-2 opacity-70" viewBox="0 0 200 10"><path fill="none" stroke="currentColor" strokeWidth="2" d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5 T120,5 T140,5 T160,5 T180,5 T200,5" /></svg>
                            )}

                            {/* COFFEE DECORATION: Bean */}
                            {template.id === 'coffee' && (
                                <div className="mb-2 text-amber-900/50">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M12 2C9 2 6 3 4 5c-2 2-2 5-1 7l.5 1 4 7c1 2 4 4 7 4s6-2 7-4l4-7c1-2 1-5-1-7-2-2-5-3-8-3zm0 14c-2 0-3-1-4-3l-1-2c0-2 1-4 3-5 1 0 3 .5 4 2 2-2 4-2 4-2 2 1 3 3 3 5l-1 2c-1 2-3 3-5 3z" /></svg>
                                </div>
                            )}

                            <h1 className={template.fonts.header}>{restaurantInfo.name}</h1>
                        </div>
                    </div>
                )}

                {/* Content Flow */}
                <div
                    className={cn(
                        "w-full",
                        template.layout.columns === 2 ? "columns-2 gap-8" : "flex flex-col gap-6"
                    )}
                    style={{ columnGap: `${32 * config.spacingScale}px` }}
                >
                    {items.map((item, idx) => {
                        if (item.isCategoryHeader) {
                            return (
                                <div key={`cat-${item.id}-${idx}`} className="break-inside-avoid mt-4 mb-4 first:mt-0">
                                    <h2 className={template.fonts.category}>{item.name}</h2>
                                </div>
                            )
                        }

                        return (
                            <div
                                key={`prod-${item.id}-${idx}`}
                                className={cn(
                                    "relative group break-inside-avoid transition-all",
                                    template.layout.sectionStyle,
                                    // Highlight Logic
                                    item.isHighlighted && template.fonts.highlight
                                )}
                                style={{ marginBottom: `${template.layout.columns === 1 ? 24 : 16}px` }}
                            >
                                {/* Highlight Badge */}
                                {item.isHighlighted && template.id !== 'finedining' && (
                                    <div className="absolute -right-2 -top-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-1">
                                        <Star size={8} fill="currentColor" />
                                        Özel
                                    </div>
                                )}

                                {/* Hover Reordering Controls - Print Only Hidden */}
                                <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-20 print:hidden">
                                    <button
                                        onClick={() => onMoveProduct?.(item.categoryId!, item.id, 'up')}
                                        className="bg-white/90 p-1 rounded-full shadow-sm hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition-colors"
                                        title="Yukarı Taşı"
                                    >
                                        <ChevronUp size={12} />
                                    </button>
                                    <button
                                        onClick={() => onMoveProduct?.(item.categoryId!, item.id, 'down')}
                                        className="bg-white/90 p-1 rounded-full shadow-sm hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition-colors"
                                        title="Aşağı Taşı"
                                    >
                                        <ChevronDown size={12} />
                                    </button>
                                </div>

                                <div className={cn(
                                    "flex w-full",
                                    (template.layout.imagePosition === 'top' && config.showImages) ? "flex-col gap-3" : "flex-row gap-4 items-start"
                                )}>
                                    {/* Image Logic */}
                                    {config.showImages && item.imageUrl && (
                                        template.layout.imagePosition === 'top' ? (
                                            <div className="w-full h-32 overflow-hidden mb-2 rounded-lg">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.imageUrl} alt={item.name} className={cn("w-full h-full object-cover shadow-sm transition-transform group-hover:scale-105", imgShapeClass)} />
                                            </div>
                                        ) : (
                                            <div className="flex-none w-20 relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.imageUrl} alt={item.name} className={cn("w-full h-full shadow-sm object-cover", imgShapeClass)} />
                                            </div>
                                        )
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline w-full">
                                            <span className={template.fonts.product}>{item.name}</span>

                                            {/* Dotted Leader: The "Smart Price Alignment" */}
                                            <div className="flex-1 mx-2 border-b-[2px] border-dotted border-slate-300 opacity-40 relative -top-1"></div>

                                            <span className={template.fonts.price}>{Number(item.price).toFixed(2)} ₺</span>
                                        </div>
                                        {item.description && (
                                            <p className={template.fonts.description}>{item.description}</p>
                                        )}
                                    </div>
                                </div>

                                {template.layout.displayDivider && <div className="border-b border-dotted border-slate-300 mt-4 opacity-50"></div>}
                            </div>
                        )
                    })}
                </div>

                {/* Footer with Template-Aware QR */}
                <div className="absolute bottom-6 right-6 flex items-end justify-end gap-3 z-20 break-inside-avoid">
                    <div className="text-right">
                        <p
                            className="text-[10px] bg-slate-100 font-medium uppercase tracking-wider mb-1 px-1 py-0.5 rounded"
                            style={{ color: template.primaryColor }}
                        >
                            Güncel Fiyatlar İçin Tarayın
                        </p>
                        {pageIndex === totalPages - 1 && (
                            <p className="text-[9px] text-slate-400 font-light">
                                {restaurantInfo.name} © 2024 • Fiyatlara KDV Dahildir.
                            </p>
                        )}
                    </div>
                    <div className="bg-white p-1.5 shadow-sm border border-slate-100 rounded-md">
                        <QRCodeSVG
                            value={config.publicUrl}
                            size={64}
                            level="Q"
                            includeMargin={false}
                            fgColor={template.primaryColor} // Template Aware Color
                        />
                    </div>
                </div>

                {/* Page Number */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-300">
                    {pageIndex + 1} / {totalPages}
                </div>
            </div>
        );
    }
);

A4Page.displayName = "A4Page";
