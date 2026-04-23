"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Menu as MenuIcon, Palette, Bell, MoreHorizontal, QrCode, Megaphone, Settings, Printer } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions"

export function MobileBottomNav() {
    const pathname = usePathname()
    const [openMore, setOpenMore] = useState(false)

    const mainRoutes = [
        {
            href: "/dashboard",
            label: "Özet",
            icon: LayoutDashboard,
            active: pathname === "/dashboard",
        },
        {
            href: "/dashboard/menu",
            label: "Menü",
            icon: MenuIcon,
            active: pathname.includes("/dashboard/menu"),
        },
        {
            href: "/dashboard/calls",
            label: "Çağrılar",
            icon: Bell,
            active: pathname.includes("/dashboard/calls"),
        },
        {
            href: "/dashboard/design",
            label: "Tasarım",
            icon: Palette,
            active: pathname.includes("/dashboard/design"),
        },
    ]

    const moreRoutes = [
        {
            href: "/dashboard/qr",
            label: "QR Kod İşlemleri",
            icon: QrCode,
        },
        {
            href: "/dashboard/campaigns",
            label: "Kampanya Yönetimi",
            icon: Megaphone,
        },
        {
            href: "/dashboard/restaurant-info",
            label: "Restoran Bilgileri",
            icon: Settings,
        },
        {
            href: "/dashboard/profile",
            label: "Hesap Ayarları",
            icon: Settings,
        },
    ]

    return (
        <>
            {/* Spacer to prevent content overlap */}
            <div className="h-16 md:hidden" />

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 z-50 md:hidden pb-safe">
                {mainRoutes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform",
                            route.active ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <route.icon className={cn("w-6 h-6", route.active && "fill-current")} strokeWidth={route.active ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{route.label}</span>
                    </Link>
                ))}

                {/* More Button */}
                <Sheet open={openMore} onOpenChange={setOpenMore}>
                    <SheetTrigger asChild>
                        <button
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform text-slate-400 hover:text-slate-600",
                                openMore && "text-indigo-600"
                            )}
                        >
                            <MoreHorizontal className="w-6 h-6" />
                            <span className="text-[10px] font-medium">Diğer</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-[20px] p-0 pb-6">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>Diğer İşlemler</SheetTitle>
                        </SheetHeader>
                        <div className="grid grid-cols-3 gap-4 p-4">
                            {moreRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setOpenMore(false)}
                                    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 active:bg-slate-100"
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <route.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-center text-slate-700 leading-tight">
                                        {route.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                        <div className="px-4">
                            <Button
                                variant="destructive"
                                className="w-full py-6 rounded-xl"
                                onClick={() => logout()}
                            >
                                Çıkış Yap
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}
