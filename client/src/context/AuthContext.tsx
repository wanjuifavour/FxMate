'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '@/lib/types/auth';

interface AuthContextType extends AuthState {
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            setAuthState({
                token,
                user: JSON.parse(user),
                isAuthenticated: true,
            });
        }
    }, []);

    const login = (token: string, user: User) => {
        document.cookie = `token=${token}; path=/`;
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            token,
            user,
            isAuthenticated: true,
        });
    };

    const logout = () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        localStorage.removeItem('user');
        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};