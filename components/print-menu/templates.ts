
// Defines the structure of a template
export interface MenuTemplate {
    id: string;
    name: string;
    description: string;
    primaryColor: string; // Used for QR code
    // CSS Classes
    fonts: {
        header: string; // Restaurant Name
        category: string;
        product: string;
        description: string;
        price: string;
        highlight?: string; // Wrapper class for highlighted items
    };
    layout: {
        columns: number; // 1 or 2
        imagePosition?: "left" | "right" | "top";
        imageStyle?: "circle" | "rounded" | "square";
        displayDivider: boolean;
        sectionStyle: string; // Additional styling for sections
    };
    background?: string; // CSS class for background pattern/color
}

export const templates: Record<string, MenuTemplate> = {
    // 1. MODERN
    modern: {
        id: "modern",
        name: "Modern Magazine",
        description: "Büyük görseller, net tipografi, dergi havası.",
        primaryColor: "#0f172a", // Slate-900
        fonts: {
            header: "text-6xl font-black uppercase tracking-tighter text-slate-900 mb-2 leading-none font-[family-name:var(--font-oswald)]",
            category: "text-3xl font-bold text-slate-900 mb-6 uppercase border-b-4 border-slate-900 pb-2 inline-block font-[family-name:var(--font-oswald)]",
            product: "font-bold text-slate-900 text-lg uppercase font-[family-name:var(--font-oswald)]",
            description: "text-slate-500 text-sm mt-1 font-[family-name:var(--font-inter)] leading-relaxed",
            price: "font-bold text-slate-900 text-lg font-[family-name:var(--font-inter)]",
            highlight: "bg-slate-50 p-4 border-l-4 border-slate-900",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid", imagePosition: "top" },
    },
    // 2. CLASSIC
    classic: {
        id: "classic",
        name: "Parisian Classic",
        description: "Zarif serif fontlar, ortalı düzen, beyaz alan.",
        primaryColor: "#4a4a4a",
        fonts: {
            header: "text-5xl font-medium text-center text-slate-800 mb-12 italic tracking-wide font-[family-name:var(--font-playfair)]",
            category: "text-2xl font-serif text-center text-slate-700 mb-8 italic relative after:content-[''] after:block after:w-8 after:h-[1px] after:bg-slate-300 after:mx-auto after:mt-2 font-[family-name:var(--font-playfair)]",
            product: "font-semibold text-slate-900 text-lg font-[family-name:var(--font-playfair)]",
            description: "text-slate-500 text-xs italic mt-0.5 font-[family-name:var(--font-lato)] tracking-wide",
            price: "font-medium text-slate-900 font-[family-name:var(--font-lato)]",
            highlight: "border border-double border-slate-200 p-4 mx-4",
        },
        layout: { columns: 1, displayDivider: true, sectionStyle: "mb-10 break-inside-avoid px-8", imagePosition: "left", imageStyle: "rounded" },
    },
    // 3. MINIMALIST
    minimalist: {
        id: "minimalist",
        name: "Swiss Minimal",
        description: "Katı grid, helvetica tarzı, yüksek kontrast.",
        primaryColor: "#000000",
        fonts: {
            header: "text-4xl font-bold text-left text-black mb-16 tracking-tighter uppercase font-[family-name:var(--font-inter)] border-t-8 border-black pt-4",
            category: "text-xs font-bold text-black mb-4 uppercase tracking-[0.2em] bg-black text-white inline-block px-2 py-1 font-[family-name:var(--font-inter)]",
            product: "font-bold text-black text-base uppercase tracking-tight font-[family-name:var(--font-inter)]",
            description: "text-gray-500 text-xs mt-1 font-medium font-[family-name:var(--font-inter)]",
            price: "font-bold text-black text-base font-[family-name:var(--font-inter)]",
            highlight: "ring-2 ring-black p-4",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid", imagePosition: "top", imageStyle: "square" },
        background: "bg-white",
    },
    // 4. COASTAL
    coastal: {
        id: "coastal",
        name: "Coastal Breeze",
        description: "Deniz, balık ve dalgalar.",
        primaryColor: "#0ea5e9", // Sky-500
        fonts: {
            header: "text-5xl font-bold text-center text-sky-900 mb-8 font-[family-name:var(--font-amatic)] tracking-widest",
            category: "text-3xl font-bold text-center text-sky-700 mb-6 font-[family-name:var(--font-amatic)] border-b-2 border-sky-200 pb-1 w-1/3 mx-auto",
            product: "font-bold text-slate-800 text-lg font-[family-name:var(--font-quicksand)]",
            description: "text-slate-500 text-sm mt-0 font-[family-name:var(--font-quicksand)]",
            price: "font-bold text-sky-600 text-lg font-[family-name:var(--font-amatic)]",
            highlight: "bg-sky-50 rounded-xl p-4 border border-sky-200",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid" },
        background: "bg-[#fffbeb]", // Very light yellow/sand
    },
    // 5. RETRO
    retro: {
        id: "retro",
        name: "Retro Diner",
        description: "50'ler stili, Amerikan Diner havası.",
        primaryColor: "#e11d48", // Rose-600
        fonts: {
            header: "text-6xl font-bold text-center text-rose-600 mb-8 font-[family-name:var(--font-bebas)] tracking-wide transform -rotate-1 drop-shadow-sm",
            category: "text-3xl font-bold text-center text-slate-800 mb-6 font-[family-name:var(--font-bebas)] bg-rose-100 inline-block px-8 py-1 rounded-full border-2 border-rose-200",
            product: "font-bold text-slate-900 text-xl font-[family-name:var(--font-bebas)] tracking-wide",
            description: "text-slate-500 text-sm font-medium mt-1 font-[family-name:var(--font-quicksand)]",
            price: "font-bold text-rose-600 text-xl font-[family-name:var(--font-bebas)]",
            highlight: "border-4 border-dashed border-rose-300 p-4 rounded-xl bg-white",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid text-center", imageStyle: "circle" },
        background: "bg-rose-50/30",
    },
    // 6. SKETCH
    sketch: {
        id: "sketch",
        name: "Artisan Sketch",
        description: "El çizimi, kağıt dokusu, samimi.",
        primaryColor: "#2563eb", // Blue-600
        fonts: {
            header: "text-6xl font-bold text-center text-blue-600 mb-10 font-[family-name:var(--font-dancing)] transform rotate-[-2deg]",
            category: "text-4xl font-bold text-left text-blue-500 mb-6 font-[family-name:var(--font-dancing)] decoration-wavy underline decoration-blue-200 underline-offset-4",
            product: "font-bold text-slate-800 text-base font-[family-name:var(--font-amatic)] text-2xl tracking-wide",
            description: "text-slate-500 text-sm mt-0 font-[family-name:var(--font-quicksand)]",
            price: "font-bold text-blue-600 text-xl font-[family-name:var(--font-amatic)]",
            highlight: "border-2 border-blue-400/50 rounded-lg p-3 rotate-1",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid" },
        // Background texture handled in A4Page
        background: "bg-[#fcfbf9]",
    },
    // 7. BOLD
    bold: {
        id: "bold",
        name: "Bold Feast",
        description: "Devasa fontlar, yüksek iştah.",
        primaryColor: "#dc2626", // Red-600
        fonts: {
            header: "text-[5rem] font-black text-left text-red-600 mb-8 leading-[0.8] font-[family-name:var(--font-impact)] uppercase",
            category: "text-4xl font-black text-left text-slate-900 mb-6 uppercase italic font-[family-name:var(--font-impact)]",
            product: "font-black text-slate-900 text-xl uppercase font-[family-name:var(--font-oswald)]",
            description: "text-slate-600 text-sm font-bold mt-1 max-w-[90%] font-[family-name:var(--font-raleway)]",
            price: "font-black text-red-600 text-2xl font-[family-name:var(--font-oswald)]",
            highlight: "bg-red-600 text-white p-4 rounded-lg [&_h3]:text-white [&_span]:text-white [&_p]:text-red-100",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-10 break-inside-avoid", imagePosition: "right", imageStyle: "circle" },
        background: "bg-white",
    },
    // 8. TRATTORIA (Italian)
    trattoria: {
        id: "trattoria",
        name: "Trattoria",
        description: "Geleneksel kırmızı/beyaz restoran.",
        primaryColor: "#991b1b",
        fonts: {
            header: "text-5xl font-bold text-center text-white bg-red-900 py-4 mb-8 rounded-t-3xl border-b-4 border-yellow-600 font-[family-name:var(--font-oswald)] uppercase tracking-wide",
            category: "text-3xl font-bold text-center text-red-900 mb-6 font-[family-name:var(--font-oswald)] uppercase border-b border-red-200 pb-2 w-2/3 mx-auto",
            product: "font-bold text-slate-900 text-xl font-[family-name:var(--font-playfair)]",
            description: "text-slate-500 text-sm italic mt-1 font-[family-name:var(--font-playfair)]",
            price: "font-bold text-red-800 text-lg font-[family-name:var(--font-playfair)]",
            highlight: "border-2 border-red-100 bg-red-50/30 p-4 rounded-xl",
        },
        layout: { columns: 1, displayDivider: true, sectionStyle: "mb-10 break-inside-avoid" },
        background: "bg-white border-x-8 border-red-900/10 min-h-full",
    },
    // 9. STEAKHOUSE
    steakhouse: {
        id: "steakhouse",
        name: "Steakhouse",
        description: "Et restoranları için güçlü karakter.",
        primaryColor: "#7f1d1d",
        fonts: {
            header: "text-4xl font-bold text-center text-red-900 uppercase border-y-4 border-double border-red-900 py-3 mb-10 font-[family-name:var(--font-crimson)] tracking-widest",
            category: "text-2xl font-bold text-left text-slate-900 mb-4 uppercase font-[family-name:var(--font-crimson)] border-b border-slate-400 pb-1",
            product: "font-bold text-slate-900 text-lg font-[family-name:var(--font-crimson)] uppercase",
            description: "text-slate-500 text-sm mt-1 font-[family-name:var(--font-crimson)]",
            price: "font-bold text-red-900 font-[family-name:var(--font-crimson)]",
            highlight: "outline outline-2 outline-offset-4 outline-red-900/20 bg-slate-100 p-4",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid" },
        background: "bg-stone-50",
    },
    // 10. ORGANIC
    organic: {
        id: "organic",
        name: "Fresh Organic",
        description: "Doğal tonlar, serif fontlar.",
        primaryColor: "#3f6212",
        fonts: {
            header: "text-5xl font-bold text-center text-lime-900 mb-10 font-[family-name:var(--font-merriweather)]",
            category: "text-2xl font-bold text-center text-stone-600 mb-6 font-[family-name:var(--font-merriweather)] italic",
            product: "font-bold text-stone-800 text-lg font-[family-name:var(--font-merriweather)]",
            description: "text-stone-500 text-sm mt-1 font-[family-name:var(--font-lato)]",
            price: "font-bold text-lime-700 font-[family-name:var(--font-lato)]",
            highlight: "bg-[#e7e5e4] p-4 rounded-lg shadow-sm",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid" },
        background: "bg-[#f5f5f4]",
    },
    // 11. FESTIVAL
    festival: {
        id: "festival",
        name: "Festival",
        description: "Renkli, büyük başlıklar, enerjik.",
        primaryColor: "#9333ea", // Purple
        fonts: {
            header: "text-6xl font-bold text-center text-purple-600 mb-8 font-[family-name:var(--font-abril)] tracking-tight",
            category: "text-3xl font-bold text-center text-yellow-500 mb-4 font-[family-name:var(--font-abril)] drop-shadow-sm",
            product: "font-bold text-slate-900 text-xl font-[family-name:var(--font-raleway)]",
            description: "text-slate-500 text-sm font-medium mt-1 font-[family-name:var(--font-raleway)]",
            price: "font-black text-purple-600 text-lg font-[family-name:var(--font-raleway)]",
            highlight: "bg-gradient-to-r from-purple-50 to-yellow-50 p-4 rounded-xl border border-purple-100",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-6 break-inside-avoid" },
        background: "bg-white",
    },
    // 12. COFFEE
    coffee: {
        id: "coffee",
        name: "Coffee House",
        description: "Sıcak kahve tonları, minimal.",
        primaryColor: "#78350f",
        fonts: {
            header: "text-4xl font-bold text-left text-amber-900 tracking-tight lowercase font-[family-name:var(--font-lato)] mb-6",
            category: "text-xl font-bold text-amber-800 mb-3 uppercase tracking-widest font-[family-name:var(--font-lato)]",
            product: "font-medium text-slate-800 text-base font-[family-name:var(--font-lato)]",
            description: "text-slate-500 text-xs mt-0.5 font-[family-name:var(--font-lato)]",
            price: "font-bold text-amber-900 font-[family-name:var(--font-lato)]",
            highlight: "bg-amber-50 rounded-lg p-3 border border-amber-100",
        },
        layout: { columns: 2, displayDivider: false, sectionStyle: "mb-8 break-inside-avoid" },
        background: "bg-[#fffbeb]",
    },
};
