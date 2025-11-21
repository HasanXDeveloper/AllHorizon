import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Plus, Check } from 'lucide-react';

const UserMenu = () => {
    const { user, logout, socialLogin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : 'U';
    };

    const getAvatarColor = (name) => {
        const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
        const index = name ? name.length % colors.length : 0;
        return colors[index];
    };

    const hasDiscord = user.social_accounts?.includes('discord');
    const hasGoogle = user.social_accounts?.includes('google');

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 focus:outline-none group"
            >
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-neutral-700 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {user.username || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[150px]">
                        {user.email}
                    </p>
                </div>

                <div className={`h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-primary-500 transition-all ${!user.avatar ? getAvatarColor(user.username || user.email) : ''}`}>
                    {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-white font-bold text-sm">{getInitials(user.username || user.email)}</span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                        <p className="text-sm text-neutral-900 dark:text-white font-medium">Мой аккаунт</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{user.email}</p>
                    </div>

                    <div className="py-2">
                        <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">Привязанные аккаунты</p>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-3" alt="Google" />
                                        <span className="text-sm text-neutral-700 dark:text-neutral-200">Google</span>
                                    </div>
                                    {hasGoogle ? (
                                        <span className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-2 py-1 rounded-full">
                                            <Check size={12} className="mr-1" />
                                            Привязан
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => socialLogin('google', 'connect')}
                                            className="flex items-center text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 px-2 py-1 rounded-full transition-colors"
                                        >
                                            <Plus size={12} className="mr-1" />
                                            Привязать
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center">
                                        <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" className="h-5 w-5 mr-3" alt="Discord" />
                                        <span className="text-sm text-neutral-700 dark:text-neutral-200">Discord</span>
                                    </div>
                                    {hasDiscord ? (
                                        <span className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-2 py-1 rounded-full">
                                            <Check size={12} className="mr-1" />
                                            Привязан
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => socialLogin('discord', 'connect')}
                                            className="flex items-center text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 px-2 py-1 rounded-full transition-colors"
                                        >
                                            <Plus size={12} className="mr-1" />
                                            Привязать
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-800 mt-2 pt-2">
                        <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center transition-colors"
                        >
                            <LogOut size={16} className="mr-2" />
                            Выйти из аккаунта
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
