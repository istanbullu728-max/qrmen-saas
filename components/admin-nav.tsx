"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Menu, Package, QrCode, Settings, Bell, Megaphone, Palette, Printer, Link2 } from "lucide-react"
import { logout } from "@/app/actions"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function AdminNav({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname()

    const routes = [
        {
            href: "/dashboard",
            label: "Panel Özeti",
            icon: LayoutDashboard,
            active: pathname === "/dashboard",
        },
        {
            href: "/dashboard/menu",
            label: "Dijital Menü İçeriği",
            icon: Menu,
            active: pathname.includes("/dashboard/menu"),
        },
        {
            href: "/dashboard/design",
            label: "QR Menü Tasarımı",
            icon: Palette,
            active: pathname.includes("/dashboard/design"),
        },
        {
            href: "/dashboard/biolink",
            label: "Bio Link Sayfası",
            icon: Link2,
            active: pathname.includes("/dashboard/biolink"),
        },

        {
            href: "/dashboard/calls",
            label: "Garson Çağrı Sistemi",
            icon: Bell,
            active: pathname.includes("/dashboard/calls"),
        },
        {
            href: "/dashboard/qr",
            label: "QR Kod & Çıktı Al",
            icon: QrCode,
            active: pathname.includes("/dashboard/qr"),
        },
    ]

    return (
        <nav className="space-y-2 group flex flex-col gap-4 h-full">
            <div className="flex-1 py-2">
                <h2 className="mb-6 px-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Yönetim
                </h2>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Button
                            key={route.href}
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-slate-400 hover:text-white hover:bg-white/10 transition-all",
                                route.active && "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 hover:bg-indigo-700"
                            )}
                            asChild
                            onClick={onLinkClick}
                        >
                            <Link href={route.href as any}>
                                <route.icon className="mr-3 h-4 w-4 opacity-70" />
                                {route.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="mt-auto px-3 py-2 border-t border-white/10">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        className={cn("w-full justify-start text-slate-400 hover:text-white hover:bg-white/10", pathname.includes("/dashboard/profile") && "bg-white/10 text-white")}
                        asChild
                        onClick={onLinkClick}
                    >
                        <Link href="/dashboard/profile">
                            <Settings className="mr-3 h-4 w-4 opacity-70" />
                            Hesap Ayarları
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => logout()}
                    >
                        <div className="flex items-center">
                            <span className="mr-3">🚪</span>
                            Çıkış Yap
                        </div>
                    </Button>
                </div>
            </div>
        </nav >
    )
}
