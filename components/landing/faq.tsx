"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "Baskı menü için matbaa gerekiyor mu?",
        answer: "Hayır. MenüMaster ile tasarladığınız menüleri herhangi bir ofis veya ev yazıcısından (A4/A5) profesyonel kalitede çıktı alabilir veya dijital ortamda PDF olarak paylaşabilirsiniz."
    },
    {
        question: "2026 Restoran Yönetmeliği nedir ve buraya uyumlu mu?",
        answer: "Yeni yönetmelik, restoranların kapıda ve masada fiyat listesi bulundurmasını zorunlu kılıyor. MenüMaster'ın 'Baskı Modu' bu yasal gerekliliği %100 karşılar, QR menü ise ek hizmet olarak misafir deneyimini artırır."
    },
    {
        question: "Ücretsiz deneme süresi bittikten sonra ne olur?",
        answer: "14 günlük deneme süresi sonunda memnun kalmazsanız 'Başlangıç' paketine geçiş yapılır. Verileriniz silinmez, ancak bazı Pro özellikler (Garson Çağır, Upsell) devre dışı kalır."
    },
    {
        question: "Garson çağırma sistemi nasıl çalışır?",
        answer: "Müşteriler QR menü üzerinden 'Garson', 'Hesap' veya 'Su' gibi butonlara tıklar. Bu bildirimler anında yönetici panelinize ve (varsa) garsonların telefonuna sesli bildirim olarak düşer."
    }
];

export function FAQ() {
    return (
        <section className="py-24 bg-[#0B1120] border-t border-slate-900">
            <div className="container max-w-3xl">
                <h2 className="text-3xl font-bold font-serif text-white text-center mb-12">Sıkça Sorulan Sorular</h2>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-slate-800">
                            <AccordionTrigger className="text-slate-200 hover:text-white hover:no-underline text-left text-lg">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-400 text-base leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
