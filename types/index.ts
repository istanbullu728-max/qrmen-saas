/**
 * Global Types for QR Menu SaaS
 */

export interface Business {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    theme?: BusinessTheme;
}

export interface BusinessTheme {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    categoryId: string;
    isAvailable: boolean;
}

export interface Category {
    id: string;
    name: string;
    order: number;
}
