
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, UserPlus, Users, MessageCircle, Clock, Check, X,
    Settings, LogOut, Bell, Volume2, Moon, User, Lock, Ban,
    Loader2, UserMinus, BellOff, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { socialApi } from '../../services/socialApi';
import ProfileModal from './ProfileModal';
import PrivacyModal from './PrivacyModal';

const FriendsList = ({ onSelectFriend, onFriendsUpdate }) => {
    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showBlockedModal, setShowBlockedModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [settings, setSettings] = useState({
        notifications: true,
        sound: true,
        onlineStatus: true,
        allowFriendRequests: true
    });
    const [currentUserData, setCurrentUserData] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [longPressTimer, setLongPressTimer] = useState(null);
    const contextMenuRef = useRef(null);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3 && activeTab === 'search') {
                handleSearch();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, activeTab]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [friendsData, requestsData, settingsData, currentUser] = await Promise.all([
                socialApi.getFriends(),
                socialApi.getFriendRequests(),
                socialApi.getProfileSettings(),
                socialApi.getCurrentUser()
            ]);
            setFriends(friendsData.data);
            setCurrentUserData(currentUser.data);
            if (onFriendsUpdate) {
                onFriendsUpdate(friendsData.data);
            }

            if (settingsData.data) {
                setSettings(prev => ({
                    ...prev,
                    onlineStatus: !settingsData.data.is_online_hidden,
                    allowFriendRequests: settingsData.data.allow_friend_requests
                }));
            }

            const received = requestsData.data.filter(req => req.to_user.id === user.id && req.status === 'pending');
            const sent = requestsData.data.filter(req => req.from_user.id === user.id && req.status === 'pending');

            setRequests(received);
            setSentRequests(sent);
        } catch (error) {
            console.error("Error loading social data:", error);
            addToast("Не удалось загрузить данные", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.length < 3) return;
        try {
            setLoading(true);
            const response = await socialApi.searchUsers(searchQuery);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
            addToast("Ошибка поиска", "error");
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async (userId) => {
        if (userId === user.id) {
            addToast("Нельзя отправить заявку самому себе", "error");
            return;
        }
        try {
            await socialApi.sendFriendRequest(userId);
            addToast("Заявка отправлена", "success");
            loadData();
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error("Error sending request:", error);
            addToast(error.response?.data?.error || "Ошибка отправки заявки", "error");
        }
    };

    const respondToRequest = async (requestId, status) => {
        try {
            setRequests(prev => prev.filter(req => req.id !== requestId));
            await socialApi.respondFriendRequest(requestId, status);
            addToast(status === 'accepted' ? "Заявка принята" : "Заявка отклонена", "success");
            loadData();
        } catch (error) {
            console.error("Error responding:", error);
            addToast("Ошибка при обработке заявки", "error");
            loadData();
        }
    };

    const cancelRequest = async (requestId) => {
        try {
            setSentRequests(prev => prev.filter(req => req.id !== requestId));
            await socialApi.cancelFriendRequest(requestId);
            addToast("Заявка отменена", "success");
            loadData();
        } catch (error) {
            console.error("Error canceling request:", error);
            addToast("Не удалось отменить заявку", "error");
            loadData();
        }
    };

    const toggleSetting = async (key) => {
        const newValue = !settings[key];
        setSettings(prev => ({ ...prev, [key]: newValue }));

        try {
            if (key === 'onlineStatus') {
                await socialApi.updateProfileSettings({ is_online_hidden: !newValue });
            } else if (key === 'allowFriendRequests') {
                await socialApi.updateProfileSettings({ allow_friend_requests: newValue });
            }
            addToast("Настройки обновлены", "success");
        } catch (error) {
            console.error("Error updating settings:", error);
            setSettings(prev => ({ ...prev, [key]: !newValue }));
            addToast("Не удалось обновить настройки", "error");
        }
    };

    const handleLogout = () => {
        if (window.confirm("Вы уверены, что хотите выйти?")) {
            logout();
        }
    };


    const loadBlockedUsers = async () => {
        try {
            const response = await socialApi.getBlockedUsers();
            setBlockedUsers(response.data);
        } catch (error) {
            console.error("Error loading blocked users:", error);
            addToast("Не удалось загрузить список", "error");
        }
    };

    const handleUnblock = async (userId) => {
        if (!window.confirm("Разблокировать этого пользователя?")) return;

        try {
            await socialApi.unblockUser(userId);
            addToast("Пользователь разблокирован", "success");

            await loadBlockedUsers();
            await loadData();

            const updatedList = await socialApi.getBlockedUsers();
            if (updatedList.data.length === 0) {
                setShowBlockedModal(false);
            }
        } catch (error) {
            console.error("Error unblocking user:", error);
            addToast("Не удалось разблокировать", "error");
        }
    };

    const handleShowBlocked = () => {
        loadBlockedUsers();
        setShowBlockedModal(true);
        setShowSettings(false);
    };

    const handleShowProfile = () => {
        setShowProfileModal(true);
        setShowSettings(false);
    };

    const handleShowPrivacy = () => {
        setShowPrivacyModal(true);
        setShowSettings(false);
    };

    // Context menu handlers
    const handleContextMenu = (e, friend) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            friend
        });
    };

    const handleTouchStart = (e, friend) => {
        const timer = setTimeout(() => {
            const touch = e.touches[0];
            setContextMenu({
                x: touch.clientX,
                y: touch.clientY,
                friend
            });
        }, 500);
        setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const handleRemoveFriend = async (friendId) => {
        if (!window.confirm('Удалить из друзей?')) return;
        try {
            await socialApi.removeFriend(friendId);
            addToast('Друг удален', 'success');
            setContextMenu(null);
            await loadData();
        } catch (error) {
            console.error('Error removing friend:', error);
            addToast('Не удалось удалить', 'error');
        }
    };

    const handleMuteFriend = async (friendId) => {
        const friend = friends.find(f => f.id === friendId);
        if (!friend) return;

        const isMuted = friend.is_muted;
        try {
            if (isMuted) {
                await socialApi.unmuteUser(friendId);
                addToast("Уведомления включены", "success");
            } else {
                await socialApi.muteUser(friendId);
                addToast("Пользователь заглушен", "success");
            }
            setContextMenu(null);
            loadData();
        } catch (error) {
            console.error("Error muting/unmuting user:", error);
            addToast("Не удалось изменить настройки уведомлений", "error");
        }
    };

    const handleBlockFriend = async (friendId) => {
        const friend = friends.find(f => f.id === friendId);
        if (!friend) return;

        const isBlocked = friend.is_blocked;
        const action = isBlocked ? "Разблокировать" : "Заблокировать";

        if (window.confirm(`${action} пользователя ${friend.username}?`)) {
            try {
                if (isBlocked) {
                    await socialApi.unblockUser(friendId);
                    addToast("Пользователь разблокирован", "success");
                } else {
                    await socialApi.blockUser(friendId);
                    addToast("Пользователь заблокирован", "success");
                }
                setContextMenu(null);
                loadData();
            } catch (error) {
                console.error(`Error ${action.toLowerCase()} user:`, error);
                addToast(`Не удалось ${action.toLowerCase()} пользователя`, "error");
            }
        }
    };

    // Close context menu on click outside
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [contextMenu]);

    const allRequests = [...requests, ...sentRequests];

    return (
        <div className="h-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden shadow-sm transition-all duration-300">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Друзья</h2>
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-2 rounded-full transition-all duration-200 ${showSettings ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}
                    >
                        <Settings size={20} />
                    </motion.button>

                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden z-50"
                            >
                                <div className="p-3 border-b border-neutral-100 dark:border-neutral-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                user?.username ? user.username[0].toUpperCase() : 'U'
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900 dark:text-white">{user?.username || 'Пользователь'}</p>
                                            <p className="text-xs text-green-500 flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                В сети
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Настройки</div>

                                    <div className="px-2 space-y-1">
                                        <motion.button
                                            whileHover={{ x: 2 }}
                                            onClick={() => toggleSetting('notifications')}
                                            className="w-full px-3 py-2 flex items-center justify-between rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                                                <Bell size={18} />
                                                <span className="text-sm">Уведомления</span>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${settings.notifications ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                                <motion.div
                                                    layout
                                                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                                    style={{ left: settings.notifications ? '20px' : '4px' }}
                                                />
                                            </div>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ x: 2 }}
                                            onClick={() => toggleSetting('sound')}
                                            className="w-full px-3 py-2 flex items-center justify-between rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                                                <Volume2 size={18} />
                                                <span className="text-sm">Звуки</span>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${settings.sound ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                                <motion.div
                                                    layout
                                                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                                    style={{ left: settings.sound ? '20px' : '4px' }}
                                                />
                                            </div>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ x: 2 }}
                                            onClick={() => toggleSetting('onlineStatus')}
                                            className="w-full px-3 py-2 flex items-center justify-between rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                                                <Moon size={18} />
                                                <span className="text-sm">Невидимка</span>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${!settings.onlineStatus ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                                <motion.div
                                                    layout
                                                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                                    style={{ left: !settings.onlineStatus ? '20px' : '4px' }}
                                                />
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="border-t border-neutral-100 dark:border-neutral-700 py-2">
                                    <div className="px-2 space-y-1">
                                        <motion.button onClick={handleShowProfile} whileHover={{ x: 2 }} className="w-full px-3 py-2 flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left">
                                            <User size={18} />
                                            <span className="text-sm">Профиль</span>
                                        </motion.button>
                                        <motion.button onClick={handleShowPrivacy} whileHover={{ x: 2 }} className="w-full px-3 py-2 flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left">
                                            <Lock size={18} />
                                            <span className="text-sm">Конфиденциальность</span>
                                        </motion.button>
                                        <motion.button onClick={handleShowBlocked} whileHover={{ x: 2 }} className="w-full px-3 py-2 flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-lg transition-colors text-left">
                                            <Ban size={18} />
                                            <span className="text-sm">Заблокированные</span>
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="border-t border-neutral-100 dark:border-neutral-700 p-2">
                                    <motion.button
                                        whileHover={{ x: 2 }}
                                        onClick={handleLogout}
                                        className="w-full px-3 py-2 flex items-center gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-sm font-medium">Выйти</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="px-3 pt-3">
                <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                    {[
                        { id: 'friends', icon: Users, label: 'Друзья' },
                        { id: 'requests', icon: UserPlus, label: 'Заявки', count: allRequests.length },
                        { id: 'search', icon: Search, label: 'Поиск' }
                    ].map(tab => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                : 'text-neutral-500 dark:text-neutral-400'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {tab.count > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-semibold"
                                >
                                    {tab.count}
                                </motion.span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {activeTab === 'search' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                placeholder="Найти пользователя..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-purple-500 rounded-xl pl-10 pr-12 py-3 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none transition-all duration-200"
                                autoFocus
                            />
                            {loading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Loader2 className="animate-spin text-purple-600" size={18} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                <div className="space-y-2">
                    {activeTab === 'friends' && friends.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 text-neutral-400"
                        >
                            <Users size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="mb-2">У вас пока нет друзей</p>
                            <button onClick={() => setActiveTab('search')} className="text-purple-600 hover:underline text-sm font-medium">Найти друзей</button>
                        </motion.div>
                    )}

                    {activeTab === 'friends' && friends.map((friend, index) => (
                        <motion.div
                            key={friend.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            onClick={() => onSelectFriend(friend)}
                            onContextMenu={(e) => handleContextMenu(e, friend)}
                            onTouchStart={(e) => handleTouchStart(e, friend)}
                            onTouchEnd={handleTouchEnd}
                            className="p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-200 flex items-center space-x-3"
                        >
                            <div className="relative">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                    {friend.avatar ? (
                                        <img src={friend.avatar} alt={friend.username} className="w-full h-full object-cover" />
                                    ) : (
                                        friend.username[0].toUpperCase()
                                    )}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900 ${friend.is_online ? 'bg-green-500' : 'bg-neutral-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-neutral-900 dark:text-white truncate">{friend.username}</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{friend.is_online ? 'В сети' : 'Не в сети'}</p>
                            </div>
                            {friend.unread_count > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full min-w-[20px] text-center font-bold"
                                >
                                    {friend.unread_count > 99 ? '99+' : friend.unread_count}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}

                    {activeTab === 'search' && searchResults.map((user, index) => {
                        const isFriend = friends.some(f => f.id === user.id);
                        const isPendingSent = sentRequests.some(req => req.to_user.id === user.id);
                        const isPendingReceived = requests.some(req => req.from_user.id === user.id);

                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            user.username[0].toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-neutral-900 dark:text-white block">{user.username}</span>
                                        {isFriend && <span className="text-xs text-green-600 dark:text-green-400">Уже в друзьях</span>}
                                        {isPendingSent && <span className="text-xs text-yellow-600 dark:text-yellow-400">Заявка отправлена</span>}
                                        {isPendingReceived && <span className="text-xs text-blue-600 dark:text-blue-400">Входящая заявка</span>}
                                    </div>
                                </div>

                                {isFriend ? (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            onSelectFriend(user);
                                            setSearchQuery('');
                                            setActiveTab('friends');
                                        }}
                                        className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                                        title="Написать сообщение"
                                    >
                                        <MessageCircle size={18} />
                                    </motion.button>
                                ) : isPendingSent || isPendingReceived ? (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setActiveTab('requests')}
                                        className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-lg transition-colors"
                                        title="Перейти к заявкам"
                                    >
                                        <Clock size={18} />
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => sendRequest(user.id)}
                                        className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
                                        title="Добавить в друзья"
                                    >
                                        <UserPlus size={18} />
                                    </motion.button>
                                )}
                            </motion.div>
                        );
                    })}

                    {activeTab === 'requests' && allRequests.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 text-neutral-400"
                        >
                            <UserPlus size={48} className="mx-auto mb-3 opacity-20" />
                            <p>Нет заявок в друзья</p>
                        </motion.div>
                    )}

                    {activeTab === 'requests' && requests.map((req, index) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30"
                        >
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                    {req.from_user.avatar ? (
                                        <img src={req.from_user.avatar} alt={req.from_user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        req.from_user.username[0].toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium text-neutral-900 dark:text-white block">{req.from_user.username}</span>
                                    <span className="text-xs text-purple-600 dark:text-purple-400">Хочет добавить вас</span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => respondToRequest(req.id, 'accepted')}
                                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <Check size={16} /> Принять
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => respondToRequest(req.id, 'rejected')}
                                    className="flex-1 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <X size={16} /> Отклонить
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}

                    {activeTab === 'requests' && sentRequests.map((req, index) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (requests.length + index) * 0.05 }}
                            whileHover={{ x: 4 }}
                            className="p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between group transition-all duration-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                    {req.to_user.avatar ? (
                                        <img src={req.to_user.avatar} alt={req.to_user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        req.to_user.username[0].toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium text-neutral-900 dark:text-white block">{req.to_user.username}</span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">Заявка отправлена</span>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => cancelRequest(req.id)}
                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Отменить заявку"
                            >
                                <X size={18} />
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {showBlockedModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowBlockedModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
                        >
                            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Заблокированные пользователи</h3>
                                <button
                                    onClick={() => setShowBlockedModal(false)}
                                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-neutral-500" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                                {blockedUsers.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-500">
                                        <Ban size={48} className="mx-auto mb-2 opacity-50" />
                                        <p>Нет заблокированных пользователей</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {blockedUsers.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                                        {item.blocked.avatar ? (
                                                            <img src={item.blocked.avatar} alt={item.blocked.username} className="w-full h-full object-cover" />
                                                        ) : (
                                                            item.blocked.username[0].toUpperCase()
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-neutral-900 dark:text-white">{item.blocked.username}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleUnblock(item.blocked.id)}
                                                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                                >
                                                    Разблокировать
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={currentUserData || user}
                friendsCount={friends.length}
                isOwnProfile={true}
                onProfileUpdate={loadData}
            />

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setContextMenu(null)}
                        />
                        <motion.div
                            ref={contextMenuRef}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{
                                position: 'fixed',
                                top: contextMenu.y,
                                left: contextMenu.x,
                                zIndex: 50
                            }}
                            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden min-w-[180px]"
                        >
                            <button
                                onClick={() => handleRemoveFriend(contextMenu.friend.id)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                            >
                                <UserMinus size={16} /> Удалить из друзей
                            </button>
                            <button
                                onClick={() => handleMuteFriend(contextMenu.friend.id)}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                            >
                                {contextMenu.friend.is_muted ? (
                                    <>
                                        <Bell size={16} /> Включить уведомления
                                    </>
                                ) : (
                                    <>
                                        <BellOff size={16} /> Заглушить
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleBlockFriend(contextMenu.friend.id)}
                                className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                            >
                                {contextMenu.friend.is_blocked ? (
                                    <>
                                        <ShieldCheck size={16} /> Разблокировать
                                    </>
                                ) : (
                                    <>
                                        <Ban size={16} /> Заблокировать
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <PrivacyModal
                isOpen={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
                settings={settings}
                onToggleSetting={toggleSetting}
                blockedCount={blockedUsers.length}
            />
        </div>
    );
};

export default FriendsList;
