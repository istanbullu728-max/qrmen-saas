'use client';

import { usePWA } from '@/hooks/usePWA';
import { Smartphone, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PWAInstallButton({ className }: { className?: string }) {
    const { isInstallable, installPWA } = usePWA();

    if (!isInstallable) return null;

    return (
        <div className={cn(
            "p-4 rounded-[24px] bg-gradient-to-br from-indigo-500 to-primary text-white shadow-lg active-scale",
            className
        )}>
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Smartphone className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                        Uygulamayı Yükle <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                    </h3>
                    <p className="text-[10px] text-white/80 leading-tight mt-1">
                        Panelinizi ana ekrana ekleyerek anında erişim sağlayın.
                    </p>
                </div>
            </div>

            <Button
                onClick={installPWA}
                variant="secondary"
                size="sm"
                className="w-full rounded-xl bg-white text-primary font-bold hover:bg-white/90"
            >
                <Download className="w-4 h-4 mr-2" /> Şimdi Yükle
            </Button>
        </div>
    );
}
