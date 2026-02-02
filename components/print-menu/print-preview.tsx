"use client";

import React, { forwardRef, useMemo } from "react";
import { templates, MenuTemplate } from "./templates";
import { paginateMenu } from "./pagination-utils";
import { A4Page } from "./a4-page";
import { FlipBookPreview } from "./flip-book-preview";

interface PrintPreviewProps {
    categories: any[];
    restaurantInfo: any;
    templateId: string;
    config: {
        spacingScale: number;
        fontScale: number;
        showImages: boolean;
        imageShape: "square" | "circle" | "rounded";
        publicUrl: string;
        paperSize: "a4" | "a5";
        isExporting?: boolean;
    };
    overrideStyles?: Partial<MenuTemplate["fonts"]> & { primaryColor?: string };
    overrideFonts?: { header: string; body: string };
    onToggleHighlight: (id: string) => void;
    onMoveProduct: (catId: string, prodId: string, direction: 'up' | 'down') => void;
}

export const PrintPreview = forwardRef<HTMLDivElement, PrintPreviewProps>(
    (
        {
            categories,
            restaurantInfo,
            templateId,
            config,
            overrideStyles,
            overrideFonts,
            onToggleHighlight,
            onMoveProduct
        },
        ref
    ) => {
        const baseTemplate = templates[templateId] || templates['modern'];

        // Merge Overrides
        const template: MenuTemplate = useMemo(() => {
            const merged = { ...baseTemplate };

            // Apply Font Overrides (if any)
            if (overrideFonts) {
                merged.fonts = {
                    ...merged.fonts,
                    header: merged.fonts.header.replace(/font-\[family-name:var\(--font-[^)]+\)\]/g, overrideFonts.header),
                    category: merged.fonts.category.replace(/font-\[family-name:var\(--font-[^)]+\)\]/g, overrideFonts.header), // Categories usually match header font
                    product: merged.fonts.product.replace(/font-\[family-name:var\(--font-[^)]+\)\]/g, overrideFonts.body),
                    description: merged.fonts.description.replace(/font-\[family-name:var\(--font-[^)]+\)\]/g, overrideFonts.body),
                    price: merged.fonts.price.replace(/font-\[family-name:var\(--font-[^)]+\)\]/g, overrideFonts.body),
                };
            }

            // Apply Color/Style Overrides (if any)
            if (overrideStyles) {
                if (overrideStyles.primaryColor) merged.primaryColor = overrideStyles.primaryColor;

                // For text colors, we need a smarter replace or just simple class append if the override provides full classes.
                // The current COLOR_PALETTES provides full functional classes like "text-emerald-700".
                // We will try to replace existing color classes with these new ones.
                // A simple approach is: remove existing text-* classes and append new ones. 
                // But regex replacement is safer to preserve layout classes (mb-4, font-bold etc).

                const replaceColor = (original: string, newClass: string) => {
                    // Remove existing text color classes (e.g. text-slate-900, text-red-500)
                    // limit to tailwind standard colors or common patterns
                    return original.replace(/text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)-[0-9]{2,3}/g, "")
                        .concat(" ", newClass);
                };

                if (overrideStyles.header) merged.fonts.header = replaceColor(merged.fonts.header, overrideStyles.header);
                if (overrideStyles.category) merged.fonts.category = replaceColor(merged.fonts.category, overrideStyles.category);
                if (overrideStyles.price) merged.fonts.price = replaceColor(merged.fonts.price, overrideStyles.price);
            }

            return merged;

        }, [baseTemplate, overrideFonts, overrideStyles]);


        // Calculate Pages
        const pages = useMemo(() => {
            return paginateMenu(categories, template, config.spacingScale, config.showImages);
        }, [categories, template, config.spacingScale, config.showImages]);

        // A5 Dimensions equivalent in pixels (approx) or Tailwind classes
        // A4: 210mm x 297mm
        // A5: 148mm x 210mm
        // effectively by passing the paperSize prop.

        const [viewMode, setViewMode] = React.useState<"list" | "book">("book");
        const isExporting = config.isExporting; // We need to add this to config or props

        // If exporting, force list view to ensure html2canvas works
        const effectiveViewMode = isExporting ? "list" : viewMode;

        // Auto-switch to list if only 1 page
        React.useEffect(() => {
            if (pages.length === 1) {
                setViewMode("list");
            } else {
                setViewMode("book");
            }
        }, [pages.length]);

        if (pages.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-96 w-full text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="font-semibold text-lg">Önizleme Oluşturulamadı</p>
                    <p className="text-sm">Menünüzde henüz aktif ürün bulunmuyor veya kategori eklenmemiş.</p>
                </div>
            )
        }

        return (
            <div className="flex flex-col items-center w-full">
                {/* View Mode Toggles (Only if > 1 page and not exporting) */}
                {pages.length > 1 && !isExporting && (
                    <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setViewMode("book")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${effectiveViewMode === "book" ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            📖 Kitap
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${effectiveViewMode === "list" ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            📜 Liste
                        </button>
                    </div>
                )}

                {/* Container ID for PDF Export usually targets the list view */}
                <div id="print-preview-container" ref={ref} className={`flex flex-col items-center gap-8 pb-20 w-full ${effectiveViewMode === 'book' ? 'hidden' : 'flex'}`}>
                    {pages.map((pageItems, index) => (
                        <A4Page
                            key={index}
                            pageIndex={index}
                            totalPages={pages.length}
                            items={pageItems}
                            restaurantInfo={restaurantInfo}
                            template={template}
                            config={config} // Pass full config including paperSize
                            onMoveProduct={onMoveProduct}
                        />
                    ))}
                </div>

                {/* FlipBook Mode */}
                {effectiveViewMode === "book" && (
                    <div className="w-full overflow-hidden flex justify-center">
                        <FlipBookPreview
                            pages={pages}
                            restaurantInfo={restaurantInfo}
                            template={template}
                            config={config}
                            onMoveProduct={onMoveProduct}
                        />
                    </div>
                )}
            </div>
        );
    }
);

PrintPreview.displayName = "PrintPreview";
