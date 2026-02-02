"use server"

import { db } from "@/lib/memory-db"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function simulateLogin() {
    (await cookies()).set("auth_session", "valid_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    })
    return { success: true }
}

export async function logout() {
    (await cookies()).delete("auth_session")
    redirect("/login")
}

export async function getSession() {
    const session = (await cookies()).get("auth_session")
    return !!session
}

type Product = {
    id: string
    name: string
    price: number
    description?: string
    isActive: boolean
    imageUrl?: string
    viewCount?: number
    sectionName?: string
    suggestedProductIds?: string[]
    isFeatured?: boolean
    name_en?: string
    description_en?: string
    sectionName_en?: string
}

type Category = {
    id: string
    name: string
    isActive: boolean
    imageUrl?: string
    products: Product[]
    sections?: string[]
    name_en?: string
}

import { translateText } from "@/lib/translator"

type RestaurantInfo = {
    name: string
    coverImage: string
    logo?: string
    instagramUrl?: string
    googleMapsUrl?: string
    template?: string
    typography?: string
    texture?: string
    textureOpacity?: number
    baseFontWeight?: number
    reviewUrl?: string
    reservationUrl?: string
}

export async function getMenuData() {
    // Ensure campaigns exist
    if (!(db as any).campaigns) (db as any).campaigns = []

    return {
        categories: db.categories,
        restaurantInfo: (db as any).restaurantInfo || {
            name: "Restoran Adı",
            coverImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
            instagramUrl: "",
            googleMapsUrl: "",
            template: "modern"
        },
        campaigns: (db as any).campaigns as any[] || []
    }
}

export async function saveMenuData(data: { categories: Category[], restaurantInfo: RestaurantInfo }) {
    // Verify payload size
    try {
        const size = JSON.stringify(data).length
        console.log(`[Server] Saving Data. Size: ${(size / 1024).toFixed(2)} KB`)
    } catch (e) {
        console.log("Error calculating size")
    }

    // Process translations
    const categoriesWithTranslations = await Promise.all(data.categories.map(async (cat) => {
        const catEn = cat.name_en || await translateText(cat.name)

        const productsWithTranslations = await Promise.all(cat.products.map(async (prod) => {
            const nameEn = prod.name_en || await translateText(prod.name)
            const descEn = prod.description_en || (prod.description ? await translateText(prod.description) : "")

            return {
                ...prod,
                name_en: nameEn,
                description_en: descEn
            }
        }))

        return {
            ...cat,
            name_en: catEn,
            products: productsWithTranslations
        }
    }))

    db.categories = categoriesWithTranslations
    // @ts-ignore
    db.restaurantInfo = data.restaurantInfo

    revalidatePath("/[slug]")
    revalidatePath("/dashboard/menu")
    return { success: true }
}

// --- Analytics Actions ---

export async function incrementProductView(productId: string) {
    // Find product across all categories
    for (const cat of db.categories) {
        const product = cat.products.find(p => p.id === productId)
        if (product) {
            product.viewCount = (product.viewCount || 0) + 1
            break
        }
    }
    // No revalidate needed for every click to avoid thrashing, data is fetched on dashboard load
    return { success: true }
}

export async function getDashboardStats() {
    let totalProducts = 0
    let totalViews = 0
    const allProducts: Product[] = []

    db.categories.forEach(cat => {
        cat.products.forEach(p => {
            if (p.isActive) {
                totalProducts++
                totalViews += (p.viewCount || 0)
                allProducts.push(p)
            }
        })
    })

    // Get top 5 sorted by viewCount
    const topProducts = allProducts
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5)
        .map(p => ({
            name: p.name,
            views: p.viewCount || 0
        }))

    // Calculate category distribution
    const categoryStats = db.categories.map(cat => ({
        name: cat.name,
        count: cat.products.filter(p => p.isActive).length
    }))

    return {
        totalProducts,
        totalViews,
        activeCampaigns: (db as any).campaigns?.filter((c: any) => c.isActive).length || 0,
        pendingCalls: (db as any).calls?.filter((c: any) => c.status === 'pending').length || 0,
        topProducts,
        categoryStats
    }
}

// --- Campaign Actions ---

export async function getCampaigns() {
    return (db as any).campaigns as any[] || []
}

export async function saveCampaign(campaign: any) {
    const campaigns = (db as any).campaigns as any[] || []

    if (campaign.id) {
        // Update
        const index = campaigns.findIndex(c => c.id === campaign.id)
        if (index !== -1) {
            campaigns[index] = { ...campaigns[index], ...campaign }
        }
    } else {
        // Create
        const newCampaign = {
            ...campaign,
            id: Math.random().toString(36).substring(7),
            isActive: true // active by default
        }
        if (!(db as any).campaigns) (db as any).campaigns = []
            ; (db as any).campaigns.push(newCampaign)
    }

    revalidatePath("/dashboard/campaigns")
    revalidatePath("/[slug]")
    return { success: true }
}

export async function toggleCampaign(id: string) {
    const campaigns = (db as any).campaigns as any[] || []
    const campaign = campaigns.find(c => c.id === id)
    if (campaign) {
        campaign.isActive = !campaign.isActive
    }
    revalidatePath("/dashboard/campaigns")
    revalidatePath("/[slug]")
    return { success: true }
}

export async function deleteCampaign(id: string) {
    let campaigns = (db as any).campaigns as any[] || []
    campaigns = campaigns.filter(c => c.id !== id)
        ; (db as any).campaigns = campaigns

    revalidatePath("/dashboard/campaigns")
    revalidatePath("/[slug]")
    return { success: true }
}


// --- Waiter Call Actions ---

export async function callWaiter(tableNo: string) {
    const calls = (db as any).calls as any[] || []
    const existingCall = calls.find((c: any) => c.tableNo === tableNo && c.status === 'pending')
    if (existingCall) {
        return { success: false, message: "Zaten açık bir talebiniz var." }
    }

    const newCall = {
        id: Math.random().toString(36).substring(7),
        tableNo,
        timestamp: Date.now(),
        status: 'pending' as const
    }

    const dbAny = db as any
    if (!dbAny.calls) dbAny.calls = []
    dbAny.calls.push(newCall)
    return { success: true, message: "Garson çağrıldı!" }
}

export async function createWaiterCall(data: { tableId: string, type: string, note?: string }) {
    const calls = (db as any).calls as any[] || []

    // Limits: 1 pending call per type per table
    const existingCall = calls.find((c: any) =>
        c.tableNo === data.tableId &&
        c.type === data.type &&
        c.status === 'pending'
    )

    if (existingCall) {
        return { success: false, message: "Bu talep zaten iletildi." }
    }

    const newCall = {
        id: Math.random().toString(36).substring(7),
        tableNo: data.tableId,
        type: data.type,
        note: data.note,
        timestamp: Date.now(),
        status: 'pending' as const
    }

    const dbAny = db as any
    if (!dbAny.calls) dbAny.calls = []
    dbAny.calls.push(newCall)

    revalidatePath("/dashboard/calls")
    return { success: true, message: "Talep iletildi." }
}

export async function getWaiterCalls() {
    // Returns pending calls sorted by newest
    const calls = (db as any).calls as any[] || []
    return calls
        .filter((c: any) => c.status === 'pending')
        .sort((a: any, b: any) => b.timestamp - a.timestamp)
}

export async function completeCall(id: string) {
    const calls = (db as any).calls as any[] || []
    const call = calls.find((c: any) => c.id === id)
    if (call) {
        call.status = 'completed'
        return { success: true }
    }
    return { success: false }
}

// --- Bio Link Actions ---

import { BioLink } from "@/lib/memory-db"

export async function getBioLinks() {
    return (db as any).bioLinks as BioLink[] || []
}

export async function saveBioLinks(links: BioLink[]) {
    (db as any).bioLinks = links
    revalidatePath("/dashboard/biolink")
    revalidatePath("/[slug]/bio")
    return { success: true }
}

