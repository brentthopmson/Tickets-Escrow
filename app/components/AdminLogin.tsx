"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';
import { User } from '../types';

interface AdminLoginProps {
    setLoggedInAdmin: React.Dispatch<React.SetStateAction<string | null>>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setLoggedInAdmin, setUsers }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [redirecting, setRedirecting] = useState(false);
    const { fetchAdminData, loading, setLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("adminToken")) {
            setRedirecting(true);
            setLoading(false);
            router.push('/secure/myaccount/tickets');
            return;
        }
        setLoading(false);
    }, [router, setLoading]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);

        if (!username || !password) {
            setErrorMessage("Please enter both username and password.");
            return;
        }

        setLoading(true);
        try {
            const success = await fetchAdminData(username, password);

            if (success) {
                setRedirecting(true);
                setLoggedInAdmin(username);
                router.push('/secure/myaccount/tickets');
            } else {
                setErrorMessage("Invalid username or password. Please try again.");
                setPassword("");
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage("An unexpected error occurred. Please try again.");
            setPassword("");
        } finally {
            setLoading(false);
        }
    };

    if (redirecting) return null;

    return (
        <div className="min-h-full flex flex-col antialiased bg-white">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <a href="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                    <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
                                </svg>
                            </div>
                            <span className="font-bold text-slate-900 tracking-tight text-lg">TicketsEscrow</span>
                        </a>
                        <span className="text-sm text-slate-400 font-medium">Admin</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
                        <p className="text-sm text-slate-500 mt-1">Sign in to manage your tickets and events.</p>
                    </div>

                    {loading && (
                        <div className="bg-slate-50 text-slate-700 p-4 rounded-xl mb-5 border border-slate-200 flex items-center justify-center gap-2.5 text-sm font-medium">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-slate-900"></div>
                            Signing in...
                        </div>
                    )}

                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-5 border border-red-200 font-medium">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-0 outline-none transition-colors text-sm text-slate-900"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-0 outline-none transition-colors text-sm text-slate-900"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 text-center mt-8">
                        Authorized administrators only.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AdminLogin;
