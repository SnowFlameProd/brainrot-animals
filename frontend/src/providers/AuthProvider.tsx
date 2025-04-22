import React, {useEffect, useState} from "react";
import {getMe} from "@/services/manageData.ts";
import {User} from "@/interfaces/User";
import AuthContext from "@/contexts/AuthContext.tsx";

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await getMe();
            setUser(res.data);
        } catch (err) {
            localStorage.removeItem('authToken');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}