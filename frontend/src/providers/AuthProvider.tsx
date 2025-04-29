import React, {useEffect, useState} from "react";
import {getMe} from "@/services/manageData.ts";
import {User} from "@/interfaces/User";
import AuthContext from "@/contexts/AuthContext.tsx";

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await getMe();
            setUser(res.data);
        } catch (err) {
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }

    const logOut = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, setUser, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}