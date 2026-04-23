// This is a temporary in-memory store.
// In a real production app, this would be a proper Database (Prisma/Postgres).
// We use globalThis to persist data across hot-reloads in development.

type Product = {
    id: string
    name: string
    price: number
    description?: string
    isActive: boolean
    imageUrl?: string
    viewCount?: number
    suggestedProductIds?: string[]
    isFeatured?: boolean

    // Multi-language
    name_en?: string
    description_en?: string
}

type Category = {
    id: string
    name: string
    isActive: boolean
    imageUrl?: string
    products: Product[]

    // Multi-language
    name_en?: string
}

const globalForDb = globalThis as unknown as {
    mockDb: { categories: Category[] }
}

type RestaurantInfo = {
    name: string
    coverImage: string
    instagramUrl?: string
    googleMapsUrl?: string
    template?: string
    typography?: string
    texture?: string
    textureOpacity?: number
    baseFontWeight?: number
    logo?: string
    reviewUrl?: string
    reservationUrl?: string
}

export type WaiterCall = {
    id: string
    tableNo: string
    timestamp: number
    status: 'pending' | 'completed'
}

export type Campaign = {
    id: string
    title: string
    description?: string
    price?: number
    isActive: boolean
}



export const db = globalForDb.mockDb || {
    calls: [] as WaiterCall[],
    campaigns: [] as Campaign[],
    restaurantInfo: {
        name: "Restoran Adı",
        coverImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
        instagramUrl: "https://instagram.com",
        googleMapsUrl: "https://maps.google.com"
    },
    categories: [
        {
            id: "default-cat",
            name: "Popüler",
            name_en: "Popular",
            isActive: true,
            products: [
                {
                    id: "default-prod-1",
                    name: "Hamburger Menü",
                    name_en: "Hamburger Menu",
                    price: 250,
                    description: "Özel soslu hamburger ve patates.",
                    description_en: "Hamburger with special sauce and fries.",
                    isActive: true,
                    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60",
                    viewCount: 154
                },
                {
                    id: "default-prod-2",
                    name: "Cheesecake",
                    name_en: "Cheesecake",
                    price: 120,
                    description: "Frambuaz soslu new york cheesecake.",
                    description_en: "New York cheesecake with raspberry sauce.",
                    isActive: true,
                    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=60",
                    viewCount: 89
                }
            ]
        },
        {
            id: "drink-cat",
            name: "İçecekler",
            name_en: "Beverages",
            isActive: true,
            products: [
                {
                    id: "drink-1",
                    name: "Ev Yapımı Limonata",
                    name_en: "Homemade Lemonade",
                    price: 60,
                    isActive: true,
                    viewCount: 245
                }
            ]
        }
    ]
}

if (process.env.NODE_ENV !== 'production') globalForDb.mockDb = db
