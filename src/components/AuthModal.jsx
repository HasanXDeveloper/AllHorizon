import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { login, register, socialLogin } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register(email, password, username);
        }

        if (result.success) {
            onClose();
        } else {
            if (typeof result.error === 'object') {
                setError(Object.values(result.error).flat().join(', '));
            } else {
                setError(result.error);
            }
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-sm">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative w-full max-w-md p-8 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl my-8 transition-colors duration-200">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        {isLogin ? 'Вход' : 'Регистрация'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">Имя пользователя</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="Username"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-600 dark:text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02]"
                        >
                            {isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-[#1a1a1a] text-gray-500 dark:text-white/50">Или через</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => socialLogin('google')}
                                className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-900 dark:text-white"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
                                Google
                            </button>
                            <button
                                onClick={() => socialLogin('discord')}
                                className="flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-[#5865F2]/10 dark:hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 transition-colors text-gray-900 dark:text-white"
                            >
                                <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" className="h-5 w-5 mr-2" alt="Discord" />
                                Discord
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-white/50">
                        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                        >
                            {isLogin ? 'Создать' : 'Войти'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AuthModal;
