import { MobileNav } from "@/components/mobile-nav"
import { AdminNav } from "@/components/admin-nav"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { InstallPWA } from "@/components/pwa/install-button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50/50">
            <MobileNav />
            <div className="flex-1 w-full md:container grid gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] md:py-8">
                <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px] sticky top-8 h-[calc(100vh-4rem)]">
                    <div className="h-full rounded-2xl bg-[#0f172a] text-slate-300 shadow-xl overflow-hidden relative border border-slate-800">
                        {/* Sidebar Gradient Glow */}
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
                        <div className="p-4 h-full relative z-10">
                            <AdminNav />
                        </div>
                    </div>
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-x-hidden animate-in fade-in-50 slide-in-from-bottom-5 duration-500 md:pb-0 pb-20 px-4 md:px-0">
                    <div className="md:px-4 lg:px-6 h-full pb-safe">
                        {children}
                    </div>
                </main>
            </div>
            <MobileBottomNav />
            <InstallPWA />
        </div>
    )
}
