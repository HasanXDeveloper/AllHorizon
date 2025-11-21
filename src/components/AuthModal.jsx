import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { X, AlertCircle } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({ username: '', email: '', password: '', general: '' });
    const { login, register, socialLogin } = useAuth();

    if (!isOpen) return null;

    const translateError = (errorMsg) => {
        const translations = {
            'A user is already registered with this e-mail address.': 'Пользователь с таким email уже зарегистрирован',
            'A user with that username already exists.': 'Пользователь с таким именем уже существует',
            'Enter a valid email address.': 'Введите корректный email адрес',
            'This field may not be blank.': 'Это поле не может быть пустым',
            'This password is too short. It must contain at least 8 characters.': 'Пароль слишком короткий. Минимум 8 символов',
            'This password is too common.': 'Этот пароль слишком простой',
            'This password is entirely numeric.': 'Пароль не может состоять только из цифр',
            'The password is too similar to the username.': 'Пароль слишком похож на имя пользователя',
            'Unable to log in with provided credentials.': 'Неверный email или пароль',
            'Login failed': 'Ошибка входа',
            'Registration failed': 'Ошибка регистрации'
        };
        return translations[errorMsg] || errorMsg;
    };

    const validateUsername = (username) => {
        if (username.length < 3) {
            return 'Имя пользователя должно содержать минимум 3 символа';
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return 'Имя пользователя может содержать только английские буквы, цифры, дефис и подчеркивание';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ username: '', email: '', password: '', general: '' });

        // Client-side username validation for registration
        if (!isLogin) {
            const usernameError = validateUsername(username);
            if (usernameError) {
                setErrors({ username: usernameError, email: '', password: '', general: '' });
                return;
            }
        }

        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register(email, password, username);
        }

        if (result.success) {
            onClose();
            setEmail('');
            setPassword('');
            setUsername('');
        } else {
            const newErrors = { username: '', email: '', password: '', general: '' };

            if (typeof result.error === 'object') {
                if (result.error.username) {
                    newErrors.username = translateError(result.error.username[0]);
                }
                if (result.error.email) {
                    newErrors.email = translateError(result.error.email[0]);
                }
                if (result.error.password || result.error.password1 || result.error.password2) {
                    const pwdError = result.error.password || result.error.password1 || result.error.password2;
                    newErrors.password = translateError(pwdError[0]);
                }
                if (result.error.non_field_errors) {
                    newErrors.general = translateError(result.error.non_field_errors[0]);
                }
            } else {
                newErrors.general = translateError(result.error);
            }

            setErrors(newErrors);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setErrors({ username: '', email: '', password: '', general: '' });
        setEmail('');
        setPassword('');
        setUsername('');
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
                                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-colors ${errors.username
                                        ? 'border-red-500 focus:border-red-600'
                                        : 'border-gray-200 dark:border-white/10 focus:border-purple-500'
                                        }`}
                                    placeholder="Username"
                                />
                                {errors.username && (
                                    <div className="mt-1 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.username}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-colors ${errors.email
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-gray-200 dark:border-white/10 focus:border-purple-500'
                                    }`}
                                placeholder="name@example.com"
                                required
                            />
                            {errors.email && (
                                <div className="mt-1 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle size={14} />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1">Пароль</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border rounded-xl text-gray-900 dark:text-white focus:outline-none transition-colors ${errors.password
                                    ? 'border-red-500 focus:border-red-600'
                                    : 'border-gray-200 dark:border-white/10 focus:border-purple-500'
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && (
                                <div className="mt-1 flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle size={14} />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {errors.general && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-600 dark:text-red-200 text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {errors.general}
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
                            onClick={switchMode}
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
