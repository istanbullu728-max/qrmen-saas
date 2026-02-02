import { getMenuData } from "@/app/actions";
import { PrintMenuBuilder } from "@/components/print-menu/print-menu-builder";

export const metadata = {
    title: "Baskı Menü Tasarımı - QR Menü SaaS",
    description: "Restoranınız için A4 baskı menü tasarlayın.",
};

export default async function PrintMenuPage() {
    const data = await getMenuData();

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] overflow-hidden">
            <div className="flex-none p-6 pb-2 border-b bg-white z-10">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Baskı Menü Stüdyosu</h1>
                <p className="text-slate-500">Menünüzü kağıt baskıya uygun, yüksek çözünürlüklü formatta tasarlayın.</p>
            </div>
            <div className="flex-1 overflow-hidden">
                <PrintMenuBuilder
                    categories={data.categories}
                    restaurantInfo={data.restaurantInfo}
                />
            </div>
        </div>
    );
}
