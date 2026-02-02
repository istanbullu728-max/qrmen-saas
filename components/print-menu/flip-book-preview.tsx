"use client";

import React, { useCallback, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { A4Page } from "./a4-page";
import { MenuItem } from "./pagination-utils";
import { MenuTemplate } from "./templates";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FlipBookPreviewProps {
    pages: MenuItem[][];
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
    onMoveProduct: (catId: string, prodId: string, direction: 'up' | 'down') => void;
}

export const FlipBookPreview = ({
    pages,
    restaurantInfo,
    template,
    config,
    onMoveProduct
}: FlipBookPreviewProps) => {
    const bookRef = useRef<any>(null);

    const onFlip = useCallback((e: any) => {
        // console.log("Current page: " + e.data);
    }, []);

    const nextFlip = () => {
        bookRef.current?.pageFlip()?.flipNext();
    };

    const prevFlip = () => {
        bookRef.current?.pageFlip()?.flipPrev();
    };

    // Calculate dimensions based on scale
    // Standard A4 ratio
    // We need fixed dimensions for the book container
    // A4 is roughly 210mm x 297mm. 
    // We scale this down for preview usually.
    // In PrintPreview, we used scale transform. Here, the book needs explicit width/height in px.

    // Base A4 pixel size @ 72 DPI ~ 595 x 842
    // We can use a reference width, say 400px per page.
    const width = 450;
    const height = 636; // 450 * 1.414 (sqrt 2)

    // Base dimensions for the "Source" A4Page component in pixels (approx 96 DPI)
    // A4: 210mm * 3.78 = ~794px
    // A5: 148mm * 3.78 = ~560px
    const sourceWidth = config.paperSize === 'a5' ? 560 : 794;
    const scale = width / sourceWidth;

    return (
        <div className="relative flex justify-center items-center py-10 select-none">
            {/* Controls */}
            <button
                onClick={prevFlip}
                className="absolute left-0 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-white text-slate-700 transition-all -translate-x-full lg:-translate-x-12"
            >
                <ChevronLeft size={32} />
            </button>

            <button
                onClick={nextFlip}
                className="absolute right-0 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-white text-slate-700 transition-all translate-x-full lg:translate-x-12"
            >
                <ChevronRight size={32} />
            </button>

            {/* @ts-ignore - react-pageflip types might be missing */}
            <HTMLFlipBook
                width={width}
                height={height}
                size="fixed"
                minWidth={300}
                maxWidth={1000}
                minHeight={400}
                maxHeight={1533}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl"
                ref={bookRef}
                onFlip={onFlip}
                clickEventForward={true}
                usePortrait={false}
                startPage={0}
                drawShadow={true}
                flippingTime={1000}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
            >
                {pages.map((pageItems, index) => (
                    <div key={index} className="bg-white overflow-hidden h-full shadow-inner border-r border-slate-100/50">
                        {/* Wrapper for A4Page to scale it to fit the book page */}
                        <div style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "top left",
                            width: config.paperSize === 'a5' ? "148mm" : "210mm",
                            height: config.paperSize === 'a5' ? "210mm" : "297mm",
                        }}>
                            <A4Page
                                pageIndex={index}
                                totalPages={pages.length}
                                items={pageItems}
                                restaurantInfo={restaurantInfo}
                                template={template}
                                config={config}
                                onMoveProduct={onMoveProduct}
                            />
                        </div>
                    </div>
                ))}
            </HTMLFlipBook>
        </div>
    );
};
