import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, History, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';

const Bank = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transferData, setTransferData] = useState({ to_username: '', amount: '' });
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [activeTab, setActiveTab] = useState('transfer');
    const [toast, setToast] = useState(null);

    const hasDiscord = user?.social_accounts?.includes('discord');

    const fetchBankData = async () => {
        try {
            setLoading(true);
            const [balanceRes, historyRes] = await Promise.all([
                axios.get('http://localhost:8000/api/bank/balance/'),
                axios.get('http://localhost:8000/api/bank/transactions/')
            ]);
            setBalance(balanceRes.data.balance);
            setTransactions(historyRes.data);
            setError(null);
        } catch (err) {
            console.error("Bank fetch error:", err);
            setError("Не удалось загрузить данные банка.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && hasDiscord) {
            fetchBankData();
        }
    }, [user, hasDiscord]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/bank/transfer/', {
                to_username: transferData.to_username,
                amount: parseInt(transferData.amount)
            });

            setToast({
                message: `Успешно переведено ${transferData.amount} HZN игроку ${transferData.to_username}!`,
                type: 'success'
            });
            setTransferData({ to_username: '', amount: '' });
            fetchBankData();
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Ошибка при выполнении перевода";
            setToast({
                message: errorMessage,
                type: 'error'
            });
        }
    };


    const handleWithdraw = async (e) => {
        e.preventDefault();
        alert("Вывод средств пока доступен только через администрацию или в игре.");
    };

    if (!user) {
        return (
            <div className="min-h-screen  flex items-center justify-center bg-white dark:bg-neutral-950 relative overflow-hidden px-4">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

                <div className="max-w-2xl w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800 relative z-10 animate-fadeInUp">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Wallet className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4 font-display">Банк Horizon</h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed max-w-lg mx-auto">
                        Управляйте своими финансами, совершайте мгновенные переводы и отслеживайте историю операций в удобном интерфейсе.
                    </p>
                    <button
                        onClick={() => document.querySelector('[data-auth-trigger]')?.click()}
                        className="inline-flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Войти в банк</span>
                        <ArrowUpRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    if (!hasDiscord) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-white dark:bg-neutral-950 relative overflow-hidden px-4">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#5865F2]/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

                <div className="max-w-2xl w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800 relative z-10 animate-fadeInUp">
                    <div className="w-24 h-24 bg-[#5865F2]/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" className="w-12 h-12" alt="Discord" />
                    </div>
                    <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4 font-display">Требуется Discord</h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed max-w-lg mx-auto">
                        Для обеспечения безопасности ваших средств и синхронизации с игровым сервером необходимо привязать аккаунт Discord.
                    </p>
                    <button
                        onClick={() => window.location.href = 'http://localhost:8000/api/auth/social/login/discord/?process=connect&next=http://localhost:3000/bank'}
                        className="inline-flex items-center justify-center gap-3 py-4 px-8 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#5865F2]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" className="w-6 h-6 brightness-0 invert" alt="" />
                        <span>Привязать Discord</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="min-h-screen pt-24 pb-12 bg-white dark:bg-neutral-950 transition-colors relative overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-12 animate-fadeInUp">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-3 font-display">
                            <span className="gradient-text">Банк</span> Horizon
                        </h1>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">Управляйте своими финансами в одном месте</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-900 rounded-3xl p-8 shadow-2xl shadow-primary-500/20 relative overflow-hidden group hover-lift animate-fadeInUp">
                                {/* Decorative circles */}
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">Текущий баланс</p>
                                        <Wallet className="w-8 h-8 text-white/40" />
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-extrabold text-white tracking-tight">
                                                {balance.toLocaleString()}
                                            </span>
                                            <span className="text-2xl font-bold text-white/80">HZN</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/60 text-sm">
                                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                        <span>Обновлено только что</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <div className="flex">
                                    <button
                                        onClick={() => setActiveTab('transfer')}
                                        className={`flex-1 py-5 text-sm font-semibold text-center transition-all duration-200 ${activeTab === 'transfer' ? 'bg-primary-500 text-white shadow-lg' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                                    >
                                        <ArrowUpRight className="w-5 h-5 mx-auto mb-1" />
                                        Перевод
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('history')}
                                        className={`flex-1 py-5 text-sm font-semibold text-center transition-all duration-200 ${activeTab === 'history' ? 'bg-primary-500 text-white shadow-lg' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                                    >
                                        <History className="w-5 h-5 mx-auto mb-1" />
                                        История
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">

                            {activeTab === 'transfer' && (
                                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-fadeInUp hover-lift-subtle">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                            <ArrowUpRight className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Перевод игроку</h3>
                                    </div>
                                    <form onSubmit={handleTransfer} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                                                Никнейм получателя
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={transferData.to_username}
                                                onChange={(e) => setTransferData({ ...transferData, to_username: e.target.value })}
                                                className="w-full px-5 py-4 rounded-xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-base"
                                                placeholder="Введите никнейм..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                                                Сумма перевода
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    value={transferData.amount}
                                                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-base pr-16"
                                                    placeholder="0"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                                                    <span className="text-neutral-500 dark:text-neutral-400 font-bold text-sm">HZN</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                            Перевести средства
                                        </button>
                                    </form>
                                </div>
                            )}
                            {activeTab === 'history' && (
                                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeInUp">
                                    <div className="p-6 md:p-8 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                                                <History className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">История операций</h3>
                                        </div>
                                        <button onClick={fetchBankData} className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                                            <RefreshCw size={20} className={`text-neutral-500 dark:text-neutral-400 ${loading ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-neutral-50/50 dark:bg-neutral-800/50 backdrop-blur-sm">
                                                <tr>
                                                    <th className="px-6 py-5 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Тип</th>
                                                    <th className="px-6 py-5 text-left text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Описание</th>
                                                    <th className="px-6 py-5 text-right text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Сумма</th>
                                                    <th className="px-6 py-5 text-right text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Дата</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700/50">
                                                {transactions.length > 0 ? (
                                                    transactions.map((tx) => (
                                                        <tr key={tx.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                                            <td className="px-6 py-5 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${tx.transaction_type === 'DEPOSIT' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                                                                    tx.transaction_type === 'WITHDRAW' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                                                        tx.amount > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                                                                            'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                                                                    }`}>
                                                                    {tx.transaction_type === 'DEPOSIT' && 'Пополнение'}
                                                                    {tx.transaction_type === 'WITHDRAW' && 'Вывод'}
                                                                    {tx.transaction_type === 'TRANSFER' && 'Перевод'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-5 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                                {tx.description}
                                                            </td>
                                                            <td className={`px-6 py-5 whitespace-nowrap text-base font-bold text-right ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-neutral-900 dark:text-white'
                                                                }`}>
                                                                {tx.amount > 0 ? '+' : ''}{tx.amount} HZN
                                                            </td>
                                                            <td className="px-6 py-5 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 text-right font-medium">
                                                                {new Date(tx.created_at).toLocaleDateString('ru-RU')}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-16 text-center">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                                                                    <History className="w-8 h-8 text-neutral-400" />
                                                                </div>
                                                                <p className="text-neutral-500 dark:text-neutral-400 font-medium">История операций пуста</p>
                                                                <p className="text-sm text-neutral-400 dark:text-neutral-500">Здесь появятся ваши переводы и операции</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Bank;
