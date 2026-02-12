'use client';

import { Bell, Search } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function AppHeader({ businessLogo, businessName }: { businessLogo?: string; businessName: string }) {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 z-50 px-4 flex items-center justify-between safe-top">
            <div className="flex items-center gap-3">
                {businessLogo ? (
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border/50">
                        <Image src={businessLogo} alt={businessName} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {businessName[0]}
                    </div>
                )}
                <h1 className="font-semibold text-lg tracking-tight">{businessName}</h1>
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" className="rounded-full active-scale">
                    <Search className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="rounded-full active-scale relative">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </Button>
            </div>
        </header>
    );
}
