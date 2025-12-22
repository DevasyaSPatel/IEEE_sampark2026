'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    email: string;
    phone: string;
    // Add other fields as necessary from google-sheets user object
    role?: string;
    theme?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Run once on mount to check for existing session
        const initAuth = async () => {
            try {
                const storedSession = localStorage.getItem("SAMPARK_USER_SESSION");
                if (storedSession) {
                    const parsedUser = JSON.parse(storedSession);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Failed to parse session", error);
                localStorage.removeItem("SAMPARK_USER_SESSION");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            setLoading(true);
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password: pass }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.success && data.user) {
                const userObj = data.user;
                setUser(userObj);
                localStorage.setItem("SAMPARK_USER_SESSION", JSON.stringify(userObj));
                // Legacy support
                localStorage.setItem("user_id", userObj.email);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("SAMPARK_USER_SESSION");
        localStorage.removeItem("user_id");
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
