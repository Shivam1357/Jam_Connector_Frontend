'use client'
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";


export default function AppProvider({ children }){
    return (
        <AuthProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </AuthProvider>
    )
}