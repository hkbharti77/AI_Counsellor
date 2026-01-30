"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { setCookie, deleteCookie, getCookie, hasCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/api';

interface User {
    id: number;
    email: string;
    full_name: string;
    onboarding_completed: boolean;
    current_stage: number;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            const token = getCookie('token');

            if (token) {
                try {
                    // Verify token validity locally
                    const decoded: any = jwtDecode(token as string);
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                        return;
                    }

                    // Fetch user data
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth initialization error:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        setCookie('token', token, { maxAge: 60 * 60 * 24 }); // 1 day
        setUser(userData);

        // Redirect logic
        if (!userData.onboarding_completed) {
            router.push('/onboarding');
        } else {
            router.push('/dashboard');
        }
    };

    const logout = () => {
        deleteCookie('token');
        setUser(null);
        if (!pathname.includes('/login') && !pathname.includes('/signup')) {
            router.push('/login');
        }
    };

    const refreshUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
