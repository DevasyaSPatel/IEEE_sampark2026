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
    login: (userData: User) => void;
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
                const storedSession = localStorage.getItem("sampark_session");
                if (storedSession) {
                    const parsedUser = JSON.parse(storedSession);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Failed to parse session", error);
                localStorage.removeItem("sampark_session");
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("sampark_session", JSON.stringify(userData));
        // Maintain backward compatibility for pages checking user_id directly
        if (userData.email) {
            localStorage.setItem("user_id", userData.email);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("sampark_session");
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
