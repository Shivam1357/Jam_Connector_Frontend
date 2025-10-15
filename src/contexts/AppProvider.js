'use client'
import { Suspense } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";


export default function AppProvider({ children }){
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
                <div className="text-center text-white">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading...</p>
                </div>
            </div>
            }>
            <AuthProvider>
                <UserProvider>
                        {children}
                </UserProvider>
            </AuthProvider>
        </Suspense>
    )
}