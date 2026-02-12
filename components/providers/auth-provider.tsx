"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
// Mock onAuthStateChanged if it's not exported from @/lib/firebase
const onAuthStateChanged = auth.onAuthStateChanged;
import Cookies from "js-cookie"
import { Loader2 } from "lucide-react"

type AuthContextType = {
    user: any | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            setUser(user)
            if (user) {
                Cookies.set("auth_session", "true", { expires: 7 })
            } else {
                Cookies.remove("auth_session")
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
