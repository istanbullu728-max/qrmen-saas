import { AppHeader } from "@/components/shared/AppHeader";
import { BottomNav } from "@/components/shared/BottomNav";
import { getMenuData } from "@/app/actions";

export default async function TenantLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { restaurantInfo } = await getMenuData();

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            {/* App Header */}
            <AppHeader
                businessName={restaurantInfo?.name || slug}
                businessLogo={restaurantInfo?.logo}
            />

            {/* Main Scrollable Content */}
            <main className="flex-1 pt-16 pb-20 scroll-container px-4 overflow-x-hidden">
                {children}
            </main>

            {/* Bottom Navigation */}
            <BottomNav slug={slug} />
        </div>
    );
}
