"use client";

import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    isActive: boolean;
    imageUrl?: string;
}

interface Category {
    id: string;
    name: string;
    products: Product[];
}

interface RestaurantInfo {
    name: string;
    coverImage: string;
    instagramUrl?: string;
    googleMapsUrl?: string;
}

export type MenuStyle = "modern" | "classic" | "elegant";

interface A4PreviewProps {
    categories: Category[];
    restaurantInfo: RestaurantInfo;
    selectedStyle: MenuStyle;
    spacingScale: number; // 0.5 to 2.0
    fontScale: number; // 0.8 to 1.5
    publicUrl: string;
    fontClass: string;
}

export const A4Preview = forwardRef<HTMLDivElement, A4PreviewProps>(
    (
        {
            categories,
            restaurantInfo,
            selectedStyle,
            spacingScale,
            fontScale,
            publicUrl,
            fontClass,
        },
        ref
    ) => {
        // A4 dimensions in pixels at 96 DPI: 794px x 1123px
        // We will build it assuming this base width, and scale it via CSS transform in the parent.
        // However, for high-res PDF, we want the content to be high quality.
        // When using html2canvas with scale option, it captures at higher res.

        const basePadding = 48 * spacingScale; // ~12mm base
        const itemGap = 16 * spacingScale;

        // Theme Configurations
        const themeParams = {
            modern: {
                header: "text-4xl font-bold uppercase tracking-tight text-slate-900 border-b-2 border-black pb-4 mb-8",
                categoryTitle: "text-2xl font-bold text-slate-800 mb-4 border-l-4 border-indigo-600 pl-3 uppercase",
                productName: "font-bold text-slate-900",
                productPrice: "font-bold text-indigo-600",
                productDesc: "text-slate-500 text-sm mt-1",
                divider: "hidden",
                layout: "grid-cols-1 md:grid-cols-2 gap-8",
            },
            classic: {
                header: "text-5xl font-bold text-center text-slate-900 border-b double-border border-slate-300 pb-6 mb-10 italic",
                categoryTitle: "text-2xl font-bold text-center text-slate-800 mb-6 border-b border-slate-200 pb-2 mx-auto w-1/2",
                productName: "font-bold text-slate-900 text-lg",
                productPrice: "font-semibold text-slate-900",
                productDesc: "text-slate-600 text-sm italic mt-0.5",
                divider: "border-b border-dotted border-slate-300 my-2",
                layout: "grid-cols-1 gap-10",
            },
            elegant: {
                header: "text-4xl font-light text-center tracking-[0.2em] text-slate-800 uppercase mb-12",
                categoryTitle: "text-xl font-light tracking-[0.15em] text-slate-700 mb-5 text-center uppercase decoration-slate-300 underline underline-offset-8",
                productName: "font-medium text-slate-900 tracking-wide",
                productPrice: "font-light text-slate-900",
                productDesc: "text-slate-400 text-xs font-light tracking-wide mt-1",
                divider: "hidden",
                layout: "grid-cols-1 md:grid-cols-2 gap-12",
            },
        };

        const theme = themeParams[selectedStyle];

        return (
            <div
                ref={ref}
                id="print-menu-content"
                className={cn(
                    "bg-white relative mx-auto overflow-hidden text-slate-900",
                    fontClass
                )}
                style={{
                    width: "210mm",
                    minHeight: "297mm", // A4
                    padding: `${basePadding}px`,
                    fontSize: `${16 * fontScale}px`,
                    boxSizing: "border-box",
                }}
            >
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className={theme.header}>{restaurantInfo.name}</h1>
                </div>

                {/* Menu Grid */}
                <div
                    className="columns-1 md:columns-2 gap-8 space-y-8"
                    style={{ columnGap: `${32 * spacingScale}px` }}
                >
                    {categories.map((category) => (
                        category.products.length > 0 && (
                            <div key={category.id} className="break-inside-avoid mb-8" style={{ marginBottom: `${32 * spacingScale}px` }}>
                                <h2 className={theme.categoryTitle}>{category.name}</h2>
                                <div className="space-y-4">
                                    {category.products.map((product) => product.isActive && (
                                        <div key={product.id} className="relative group">
                                            <div className="flex justify-between items-baseline w-full">
                                                <span className={theme.productName}>{product.name}</span>
                                                <div className="flex-1 mx-2 border-b border-dotted border-slate-300 opacity-50 relative top-[-4px]"></div>
                                                <span className={theme.productPrice}>{Number(product.price).toFixed(2)} ₺</span>
                                            </div>
                                            {product.description && (
                                                <p className={theme.productDesc}>{product.description}</p>
                                            )}
                                            <div className={theme.divider}></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Footer with QR */}
                <div className="absolute bottom-0 right-0 p-8 flex items-end justify-end">
                    <div className="bg-white p-2 shadow-sm border border-slate-100 rounded-lg flex flex-col items-center gap-2">
                        <QRCodeSVG
                            value={publicUrl}
                            size={80}
                            level="H"
                            includeMargin={false}
                        />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                            Menüyü Tara
                        </span>
                    </div>
                </div>
            </div>
        );
    }
);

A4Preview.displayName = "A4Preview";
