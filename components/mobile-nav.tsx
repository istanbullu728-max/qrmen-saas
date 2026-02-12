"use client"

import { ChefHat, User, LogOut } from "lucide-react"
import { logout } from "@/app/actions"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function MobileNav() {
    return (
        <header className="sticky top-0 z-40 w-full bg-[#0B1120] border-b border-slate-800 md:hidden pb-safe-top">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-tr from-amber-400 to-amber-600 p-1.5 rounded-lg shadow-lg">
                        <ChefHat className="h-5 w-5 text-[#0B1120]" />
                    </div>
                    <span className="font-serif font-bold text-white tracking-wide">MenüMaster</span>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="relative h-9 w-9 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center justify-center overflow-hidden active:scale-95 transition-transform">
                                <Avatar className="h-9 w-9 rounded-xl">
                                    <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">AD</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-slate-200 shadow-2xl">
                            <DropdownMenuLabel className="font-normal p-4">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold leading-none">Admin Hesabı</p>
                                    <p className="text-xs leading-none text-slate-500">Ömür Boyu Paket</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-3 cursor-pointer rounded-xl focus:bg-slate-50">
                                <User className="mr-3 h-4 w-4 text-slate-400" />
                                <span>Profil Bilgileri</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="p-3 cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 rounded-xl font-bold"
                                onClick={() => logout()}
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                <span>Çıkış Yap</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
