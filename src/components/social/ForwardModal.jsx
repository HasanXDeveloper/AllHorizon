import React, { useState, useEffect } from 'react';
import { X, Search, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialApi } from '../../services/socialApi';

const ForwardModal = ({ isOpen, onClose, onSend, currentChatId }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadFriends();
            setSelectedFriends([]);
            setSearchQuery('');
        }
    }, [isOpen]);

    const loadFriends = async () => {
        try {
            setLoading(true);
            const response = await socialApi.getFriends();
            setFriends(response.data);
        } catch (error) {
            console.error("Error loading friends:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFriend = (friendId) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleSend = () => {
        onSend(selectedFriends);
        onClose();
    };

    const filteredFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        friend.id !== currentChatId
    );

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-200 dark:border-neutral-800"
                >
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Переслать сообщение</h3>
                        <button onClick={onClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                            <X size={20} className="text-neutral-500" />
                        </button>
                    </div>

                    <div className="p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                placeholder="Поиск..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-none focus:ring-2 focus:ring-purple-500 text-neutral-900 dark:text-white placeholder-neutral-500"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                            {loading ? (
                                <div className="text-center py-4 text-neutral-500">Загрузка...</div>
                            ) : filteredFriends.length === 0 ? (
                                <div className="text-center py-4 text-neutral-500">
                                    {friends.length === 0 ? "У вас нет друзей, которым можно переслать" : "Ничего не найдено"}
                                </div>
                            ) : (
                                filteredFriends.map(friend => (
                                    <div
                                        key={friend.id}
                                        onClick={() => toggleFriend(friend.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${selectedFriends.includes(friend.id)
                                                ? 'bg-purple-50 dark:bg-purple-900/20'
                                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {friend.avatar ? (
                                                    <img src={friend.avatar} alt={friend.username} className="w-full h-full object-cover rounded-full" />
                                                ) : (
                                                    friend.username[0].toUpperCase()
                                                )}
                                            </div>
                                            <span className="font-medium text-neutral-900 dark:text-white">{friend.username}</span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedFriends.includes(friend.id)
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-neutral-300 dark:border-neutral-600'
                                            }`}>
                                            {selectedFriends.includes(friend.id) && <Check size={14} className="text-white" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={selectedFriends.length === 0}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send size={18} />
                            Отправить
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ForwardModal;
