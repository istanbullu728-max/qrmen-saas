
import { MenuTemplate } from "./templates";

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    isActive: boolean;
    imageUrl?: string;
    isHighlighted?: boolean;
}

interface Category {
    id: string;
    name: string;
    products: Product[];
}

export interface MenuItem extends Product {
    categoryId: string;
    categoryName: string;
    isCategoryHeader?: boolean;
}

export interface PageContent {
    column1: MenuItem[];
    column2: MenuItem[]; // Only if 2 columns
}

// Simple heuristic based pagination:
// We assign a "height unit" to each item.
// A4 Page has roughly 1000 units of printable height (excluding header/footer).
// Category Header: 60 units
// Product: 40 units ( +20 if description, + 60 if image)
// Spacing scale multiplies these units.

export function paginateMenu(
    categories: Category[],
    template: MenuTemplate,
    spacingScale: number,
    showImages: boolean
): MenuItem[][] {
    const items: MenuItem[] = [];

    // 1. Flatten the structure
    categories.forEach(cat => {
        if (cat.products.filter(p => p.isActive).length === 0) return;

        // Push Category Header Placeholder
        items.push({
            id: `cat-${cat.id}`,
            name: cat.name,
            price: 0,
            isActive: true,
            categoryId: cat.id,
            categoryName: cat.name,
            isCategoryHeader: true
        });

        cat.products.filter(p => p.isActive).forEach(prod => {
            items.push({
                ...prod,
                categoryId: cat.id,
                categoryName: cat.name
            });
        });
    });

    // 2. Distribute into pages
    // Standard A4 printable height ~ 250mm
    const PAGE_HEIGHT = 1100; // Abstract units
    const pages: MenuItem[][] = [];
    let currentPage: MenuItem[] = [];
    let currentHeight = 0;

    // Header height (Restaurant Name)
    const headerHeight = 150 * spacingScale;
    currentHeight += headerHeight;

    items.forEach(item => {
        let itemHeight = 0;

        if (item.isCategoryHeader) {
            itemHeight = 80 * spacingScale;
        } else {
            // Product Base
            itemHeight = 35 * spacingScale;

            // Description
            if (item.description) {
                itemHeight += 25 * spacingScale;
            }

            // Image
            if (showImages && item.imageUrl && template.layout.imagePosition) {
                if (template.layout.imagePosition === 'top') {
                    itemHeight += 120 * spacingScale;
                } else {
                    // Left/Right doesn't add much height, maybe a bit min-height
                    itemHeight = Math.max(itemHeight, 80 * spacingScale);
                }
            }

            // Highlight Extra Height
            if (item.isHighlighted) {
                itemHeight += 20 * spacingScale; // Extra padding
            }
        }

        // Check overflow
        // If it's a category header, we prefer not to start it at the very bottom
        if (currentHeight + itemHeight > PAGE_HEIGHT) {
            // New Page
            pages.push(currentPage);
            currentPage = [];
            currentHeight = 100 * spacingScale; // Padding top for next page
        }

        currentPage.push(item);
        currentHeight += itemHeight;
    });

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    return pages;
}
