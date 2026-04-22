"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false })
import { Eye, ShoppingBag, Utensils, Megaphone, Bell, ArrowUpRight, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDashboardStats().then(data => {
            setStats(data)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return <div className="p-8 flex items-center justify-center text-muted-foreground animate-pulse">Yükleniyor...</div>
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="flex-1 space-y-4 md:space-y-8 p-4 md:p-8 pt-4 md:pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">Genel Bakış</h2>
                    <p className="text-xs md:text-sm text-slate-500">İşletmenizin anlık performansı.</p>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
                <motion.div variants={item}>
                    <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white overflow-hidden group">

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-600">Toplam Görüntülenme</CardTitle>
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                                <Eye className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{stats.totalViews}</div>
                            <p className="text-xs text-indigo-600/80 mt-1 flex items-center font-medium bg-indigo-50 w-fit px-2 py-1 rounded-full">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +20.1% artış
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white overflow-hidden group">

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">Aktif Ürünler</CardTitle>
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                <Utensils className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{stats.totalProducts}</div>
                            <p className="text-xs text-slate-500 mt-1">4 farklı kategoride</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white overflow-hidden group">

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-600">Aktif Kampanyalar</CardTitle>
                            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                                <Megaphone className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{stats.activeCampaigns}</div>
                            <p className="text-xs text-slate-500 mt-1">Dönüşüm oranı yüksek</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-white overflow-hidden group">

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-rose-600">Bekleyen Çağrılar</CardTitle>
                            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm relative">
                                <Bell className="h-5 w-5" />
                                {stats.pendingCalls > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{stats.pendingCalls}</div>
                            <p className="text-xs text-rose-600/80 mt-1 font-medium">⚠️ Acil müdahale gerekir</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-1 md:col-span-2 lg:col-span-4"
                >
                    <Card className="h-full shadow-md border-none bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-800">En Çok İlgilenilen Ürünler</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="w-[150%] sm:w-full overflow-x-auto pb-4">
                                <ResponsiveContainer width="100%" height={350} className="min-w-[500px]">
                                    <BarChart data={stats.topProducts}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                                        />
                                        <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                                            {stats.topProducts.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? "#4f46e5" : "#e2e8f0"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="col-span-1 md:col-span-2 lg:col-span-3"
                >
                    <Card className="h-full shadow-md border-none bg-white">
                        <CardHeader>
                            <CardTitle className="text-slate-800">Kategori Dağılımı</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {stats.categoryStats.map((cat: any, i: number) => (
                                    <div key={i} className="flex items-center">
                                        <div className="w-full space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                    <p className="text-sm font-medium leading-none text-slate-700">{cat.name}</p>
                                                </div>
                                                <span className="text-sm text-slate-500">{cat.count} Ürün</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(cat.count / stats.totalProducts) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                                                    className="h-full bg-indigo-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
