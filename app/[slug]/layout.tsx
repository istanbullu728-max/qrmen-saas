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
            {/* Main Scrollable Content */}
            <main className="flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
