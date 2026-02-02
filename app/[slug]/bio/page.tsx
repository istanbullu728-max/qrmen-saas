import { getBioLinks, getMenuData } from "@/app/actions"
import { Instagram, Globe, MapPin, MessageCircle, Menu as MenuIcon, Video, Twitter, Facebook, Calendar } from "lucide-react"
import Link from "next/link"

export default async function BioLinkPage({ params }: { params: { slug: string } }) {
    const links = await getBioLinks()
    const { restaurantInfo } = await getMenuData()

    const activeLinks = links
        .filter(l => l.isActive)
        .sort((a, b) => a.order - b.order)

    return (
        <div className="min-h-screen w-full bg-slate-900 relative flex flex-col items-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
                style={{ backgroundImage: restaurantInfo?.coverImage ? `url(${restaurantInfo.coverImage})` : 'none' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 backdrop-blur-[2px]" />

            {/* Content Wrapper */}
            <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col p-6 animate-in fade-in duration-700">

                {/* Header / Profile */}
                <div className="mt-12 flex flex-col items-center text-center space-y-4">
                    <div className="w-28 h-28 rounded-full p-1 bg-white/20 backdrop-blur-md shadow-2xl ring-1 ring-white/30">
                        {restaurantInfo?.logo ? (
                            <img
                                src={restaurantInfo.logo}
                                alt={restaurantInfo.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                                🏪
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white drop-shadow-md tracking-tight">
                            {restaurantInfo?.name || "Restoran İsmi"}
                        </h1>
                        <p className="text-white/80 text-sm font-medium mt-1">
                            Mutluluğun adresi 🍝
                        </p>
                    </div>
                </div>

                {/* Links Container */}
                {/* Links Container */}
                <div className="mt-10 space-y-4 flex-1">

                    {/* 1. Menu Link (Always First) */}
                    <Link
                        href={`/${params.slug}`}
                        className="block w-full"
                    >
                        <div className="bg-white hover:bg-slate-50 text-slate-900 py-4 px-6 rounded-xl text-center font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group border-b-4 border-slate-200">
                            <MenuIcon className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
                            <span>Menüyü İncele</span>
                        </div>
                    </Link>

                    {/* 2. Review Link (If exists) */}
                    {restaurantInfo?.reviewUrl ? (
                        <a
                            href={restaurantInfo.reviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                        >
                            <div className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 py-4 px-6 rounded-xl text-center font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <span>Bizi Değerlendir</span>
                            </div>
                        </a>
                    ) : (
                        <div className="block w-full opacity-50 cursor-not-allowed">
                            <div className="bg-white/50 backdrop-blur-md text-slate-900/50 py-4 px-6 rounded-xl text-center font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                <span>Bizi Değerlendir</span>
                            </div>
                        </div>
                    )}

                    {/* 3. Reservation Link (If exists) */}
                    {restaurantInfo?.reservationUrl ? (
                        <a
                            href={restaurantInfo.reservationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                        >
                            <div className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 py-4 px-6 rounded-xl text-center font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                <span>Rezervasyon Yap</span>
                            </div>
                        </a>
                    ) : (
                        <div className="block w-full opacity-50 cursor-not-allowed">
                            <div className="bg-white/50 backdrop-blur-md text-slate-900/50 py-4 px-6 rounded-xl text-center font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>Rezervasyon Yap</span>
                            </div>
                        </div>
                    )}

                    {/* 4. Location Link (If exists) */}
                    {restaurantInfo?.googleMapsUrl ? (
                        <a
                            href={restaurantInfo.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                        >
                            <div className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-900 py-4 px-6 rounded-xl text-center font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <MapPin className="w-5 h-5 text-red-600" />
                                <span>Konum</span>
                            </div>
                        </a>
                    ) : (
                        <div className="block w-full opacity-50 cursor-not-allowed">
                            <div className="bg-white/50 backdrop-blur-md text-slate-900/50 py-4 px-6 rounded-xl text-center font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span>Konum</span>
                            </div>
                        </div>
                    )}

                    {/* Custom Links (Below fixed ones) */}
                    {activeLinks.map(link => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                        >
                            <div className="bg-white/40 backdrop-blur-md hover:bg-white/60 text-white hover:text-white border border-white/20 py-4 px-6 rounded-xl text-center font-semibold text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                                {link.title}
                            </div>
                        </a>
                    ))}
                </div>

                {/* Footer / Socials */}
                <div className="mt-auto pt-8 pb-4">
                    <div className="flex justify-center gap-6">
                        {restaurantInfo?.instagramUrl && (
                            <a href={restaurantInfo.instagramUrl} target="_blank" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-pink-600 transition-all hover:scale-110">
                                <Instagram size={20} />
                            </a>
                        )}
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-blue-500 transition-all hover:scale-110">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all hover:scale-110">
                            <Video size={20} />
                        </a>
                    </div>
                    <div className="text-center mt-6">
                        <Link href="/" className="text-white/40 text-[10px] font-medium tracking-widest uppercase hover:text-white/80 transition-colors">
                            Powered by QR Menu SaaS
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
