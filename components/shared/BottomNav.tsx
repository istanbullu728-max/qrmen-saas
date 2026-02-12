'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, Bell, User, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Ana Sayfa', icon: Home, href: '/' },
    { label: 'Menü', icon: UtensilsCrossed, href: '/menu' },
    { label: 'Duyurular', icon: Bell, href: '/announcements' },
    { label: 'Profil', icon: User, href: '/profile' },
];

export function BottomNav({ slug }: { slug: string }) {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-border/40 z-50 flex items-center justify-around px-6 pb-safe">
            {navItems.map((item) => {
                const fullHref = `/${slug}${item.href}`;
                const isActive = pathname === fullHref || (item.href === '/' && pathname === `/${slug}`);

                return (
                    <Link
                        key={item.label}
                        href={fullHref}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-200 active-scale",
                            isActive ? "text-primary scale-110" : "text-muted-foreground"
                        )}
                    >
                        <item.icon
                            className={cn("w-6 h-6", isActive && "fill-primary/10")}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span className={cn("text-[10px] font-semibold", isActive ? "opacity-100" : "opacity-60")}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
