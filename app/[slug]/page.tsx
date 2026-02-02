import { getMenuData } from "@/app/actions"
import PublicMenuClient from "@/components/PublicMenuClient"

export const dynamic = "force-dynamic"

export default async function PublicMenuPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ table?: string }> }) {
    // Fetch data on the server
    const { categories, restaurantInfo, campaigns } = await getMenuData()

    // Await params if needed (though not used here) and searchParams
    const resolvedSearchParams = await searchParams
    const tableId = resolvedSearchParams?.table

    // Pass to client component for interactivity
    return <PublicMenuClient data={categories} restaurantInfo={restaurantInfo} campaigns={campaigns} tableId={tableId} />
}
