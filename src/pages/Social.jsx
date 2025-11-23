import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FriendsList from '../components/social/FriendsList';
import ChatWindow from '../components/social/ChatWindow';
import Header from '../components/Header';
import AuthModal from '../components/AuthModal';

const Social = () => {
    const { user, loading } = useAuth();
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme || 'system';
        }
        return 'system';
    });

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = (newTheme) => {
            if (newTheme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.remove('light', 'dark');
                root.classList.add(systemTheme);
            } else {
                root.classList.remove('light', 'dark');
                root.classList.add(newTheme);
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    if (loading) return null;

    if (!user) {
        return (
            <div className="min-h-screen overflow-hidden bg-neutral-50 dark:bg-[#0a0a0f] text-neutral-900 dark:text-white flex flex-col transition-colors duration-300">
                <Header theme={theme} setTheme={setTheme} />
                <main className="flex-1 container mx-auto px-4 flex items-center justify-center pt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md"
                    >
                        <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600 dark:text-purple-400">
                            <MessageCircle size={48} />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Присоединяйтесь к сообществу</h1>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                            Общайтесь с друзьями, делитесь файлами и находите новых знакомых на сервере Horizon.
                            Для доступа к социальным функциям необходимо войти в аккаунт.
                        </p>
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
                        >
                            Войти или создать аккаунт
                        </button>
                    </motion.div>
                </main>
                <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            </div>
        );
    }

    return (
        <div className=" bg-neutral-50 dark:bg-[#0a0a0f] text-neutral-900 dark:text-white transition-colors duration-300">
            <Header theme={theme} setTheme={setTheme} />

            <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-80px)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-140px)] max-h-[calc(100vh-140px)]"
                >
                    {/* Sidebar - Friends List */}
                    <div className={`md:col-span-1 ${selectedFriend ? 'hidden md:block' : 'block'} h-full overflow-hidden`}>
                        <FriendsList onSelectFriend={setSelectedFriend} onFriendsUpdate={setFriends} />
                    </div>

                    {/* Main Content - Chat Window */}
                    <div className={`md:col-span-3 ${!selectedFriend ? 'hidden md:block' : 'block'} h-full overflow-hidden`}>
                        {selectedFriend ? (
                            <ChatWindow
                                friend={selectedFriend}
                                onClose={() => setSelectedFriend(null)}
                                totalUnreadCount={friends
                                    .filter(f => f.id !== selectedFriend.id)
                                    .reduce((sum, f) => sum + (f.unread_count || 0), 0)
                                }
                            />
                        ) : (
                            <div className="h-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 flex-col shadow-sm">
                                <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle size={40} />
                                </div>
                                <p className="text-lg font-medium">Выберите друга для начала общения</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Social;
