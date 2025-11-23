import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, Trash2, Ban, User, Image as ImageIcon, X, Loader2, ShieldOff, UserMinus, Reply, Forward, Copy, FileText, ChevronLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { socialApi } from '../../services/socialApi';
import ForwardModal from './ForwardModal';
import ProfileModal from './ProfileModal';

const ChatWindow = ({ friend, onClose, totalUnreadCount = 0 }) => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedByMe, setBlockedByMe] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    const [contextMenu, setContextMenu] = useState(null);

    const [showForwardModal, setShowForwardModal] = useState(false);
    const [messageToForward, setMessageToForward] = useState(null);
    const [showFriendProfile, setShowFriendProfile] = useState(false);

    const [isUserAtBottom, setIsUserAtBottom] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        loadMessages();
        checkBlockStatus();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [friend.id]);

    useEffect(() => {
        if (isUserAtBottom) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
            setIsUserAtBottom(isBottom);
        }
    };

    const loadMessages = async () => {
        try {
            const response = await socialApi.getMessages(friend.id);
            setMessages(prev => {
                if (response.data.length !== prev.length ||
                    (response.data.length > 0 && prev.length > 0 && response.data[response.data.length - 1].id !== prev[prev.length - 1].id)) {
                    return response.data;
                }
                return prev;
            });
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    const checkBlockStatus = async () => {
        try {
            const response = await socialApi.getBlockedUsers();
            const blocked = response.data.some(b => b.blocked.id === friend.id);
            setBlockedByMe(blocked);
        } catch (error) {
            console.error("Error checking block status:", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const scrollToMessage = (messageId) => {
        const element = document.getElementById(`message-${messageId}`);
        if (element && chatContainerRef.current) {
            const container = chatContainerRef.current;
            const elementTop = element.offsetTop;
            const containerHeight = container.clientHeight;
            const elementHeight = element.clientHeight;

            container.scrollTo({
                top: elementTop - (containerHeight / 2) + (elementHeight / 2),
                behavior: 'smooth'
            });

            element.classList.add('bg-purple-50', 'dark:bg-purple-900/20', 'transition-colors', 'duration-500');
            setTimeout(() => {
                element.classList.remove('bg-purple-50', 'dark:bg-purple-900/20');
            }, 1000);
        } else {
            addToast("Сообщение не найдено (возможно, оно слишком старое)", "info");
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && files.length === 0) || loading || blockedByMe || isBlocked) return;

        try {
            setLoading(true);
            await socialApi.sendMessage(friend.id, newMessage, files, replyingTo?.id);
            setNewMessage('');
            setFiles([]);
            setReplyingTo(null);
            setIsUserAtBottom(true);
            if (textareaRef.current) {
                textareaRef.current.style.height = '42px';
            }
            await loadMessages();
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error("Error sending message:", error);
            addToast("Не удалось отправить сообщение", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleTextareaChange = (e) => {
        setNewMessage(e.target.value);
        const textarea = e.target;

        if (!e.target.value) {
            textarea.style.height = '42px';
            return;
        }

        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxLines = 5;
        const lineHeight = 21;
        const maxHeight = lineHeight * maxLines + 21;

        textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes

        // Check each file size
        const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);

        if (oversizedFiles.length > 0) {
            const fileNames = oversizedFiles.map(f => f.name).join(', ');
            addToast(`Файл(ы) превышают лимит 15MB: ${fileNames}`, "error");

            // Only add files that are under the limit
            const validFiles = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE);
            if (validFiles.length > 0) {
                setFiles(prev => [...prev, ...validFiles]);
            }
        } else {
            setFiles(prev => [...prev, ...selectedFiles]);
        }

        // Reset input
        e.target.value = '';
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleContextMenu = (e, msg) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            message: msg
        });
    };

    const handleTouchStart = (e, msg) => {
        const touch = e.touches[0];
        const timer = setTimeout(() => {
            setContextMenu({
                x: touch.clientX,
                y: touch.clientY,
                message: msg
            });
        }, 500);

        e.target.setAttribute('data-long-press-timer', timer);
    };

    const handleTouchEnd = (e) => {
        const timer = e.target.getAttribute('data-long-press-timer');
        if (timer) clearTimeout(timer);
    };

    const handleDeleteMessage = async (messageId) => {
        if (window.confirm("Удалить это сообщение?")) {
            try {
                await socialApi.deleteMessage(messageId);
                setMessages(prev => prev.filter(m => m.id !== messageId));
                addToast("Сообщение удалено", "success");
            } catch (error) {
                console.error("Error deleting message:", error);
                addToast("Не удалось удалить сообщение", "error");
            }
        }
    };

    const handleForward = async (friendsIds) => {
        if (!messageToForward) return;

        let filesToForward = [];
        if (messageToForward.attachments && messageToForward.attachments.length > 0) {
            try {
                const filePromises = messageToForward.attachments.map(async (att) => {
                    const response = await fetch(att.file);
                    const blob = await response.blob();
                    const filename = att.file.split('/').pop() || 'attachment';
                    return new File([blob], filename, { type: blob.type });
                });
                filesToForward = await Promise.all(filePromises);
            } catch (error) {
                console.error("Error preparing files for forward:", error);
                addToast("Не удалось подготовить файлы для пересылки", "error");
            }
        }

        const originalSenderId = messageToForward.forwarded_from
            ? messageToForward.forwarded_from.id
            : messageToForward.sender.id;

        friendsIds.forEach(async (friendId) => {
            try {
                await socialApi.sendMessage(
                    friendId,
                    messageToForward.content,
                    filesToForward,
                    null,
                    originalSenderId
                );
            } catch (error) {
                console.error(`Failed to forward to ${friendId} `, error);
            }
        });
        addToast("Сообщение переслано", "success");
        setMessageToForward(null);
    };

    const Avatar = ({ user }) => (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
            {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
                user.username[0].toUpperCase()
            )}
        </div>
    );

    const handleClearChat = async () => {
        if (window.confirm("Вы уверены, что хотите очистить историю чата?")) {
            try {
                await socialApi.clearChat(friend.id);
                setMessages([]);
                addToast("Чат очищен", "success");
                setShowMenu(false);
            } catch (error) {
                console.error("Error clearing chat:", error);
                addToast("Не удалось очистить чат", "error");
            }
        }
    };

    const handleBlockUser = async () => {
        if (window.confirm(`Заблокировать пользователя ${friend.username}?`)) {
            try {
                await socialApi.blockUser(friend.id);
                setBlockedByMe(true);
                addToast("Пользователь заблокирован", "success");
                setShowMenu(false);
            } catch (error) {
                console.error("Error blocking user:", error);
                addToast("Не удалось заблокировать пользователя", "error");
            }
        }
    };

    const handleUnblockUser = async () => {
        if (window.confirm(`Разблокировать пользователя ${friend.username}?`)) {
            try {
                await socialApi.unblockUser(friend.id);
                setBlockedByMe(false);
                addToast("Пользователь разблокирован", "success");
                setShowMenu(false);
            } catch (error) {
                console.error("Error unblocking user:", error);
                addToast("Не удалось разблокировать пользователя", "error");
            }
        }
    };

    const handleRemoveFriend = async () => {
        if (window.confirm(`Удалить ${friend.username} из друзей ? `)) {
            try {
                await socialApi.removeFriend(friend.id);
                addToast("Пользователь удален из друзей", "success");
                setShowMenu(false);
                onClose();
            } catch (error) {
                console.error("Error removing friend:", error);
                addToast("Не удалось удалить из друзей", "error");
            }
        }
    };

    // Search functionality
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            setCurrentSearchIndex(0);
            return;
        }

        const results = messages.filter(msg =>
            msg.content && msg.content.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setCurrentSearchIndex(0);

        if (results.length > 0) {
            scrollToMessage(results[0].id);
        }
    };

    const navigateSearch = (direction) => {
        if (searchResults.length === 0) return;

        let newIndex = currentSearchIndex + direction;
        if (newIndex < 0) newIndex = searchResults.length - 1;
        if (newIndex >= searchResults.length) newIndex = 0;

        setCurrentSearchIndex(newIndex);
        scrollToMessage(searchResults[newIndex].id);
    };

    const closeSearch = () => {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        setCurrentSearchIndex(0);
    };

    // Get last seen text
    const getLastSeenText = () => {
        if (friend.is_online) return 'В сети';

        // Assuming friend has last_activity field from backend
        if (!friend.last_activity) return 'Не в сети';

        const lastActivity = new Date(friend.last_activity);
        const now = new Date();
        const diffMs = now - lastActivity;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Был(а) только что';
        if (diffMins < 5) return 'Был(а) недавно';
        if (diffMins < 60) return `Был(а) ${diffMins} мин. назад`;
        if (diffHours < 24) return `Был(а) ${diffHours} ч. назад`;
        if (diffDays === 1) return 'Был(а) вчера';
        if (diffDays < 7) return `Был(а) ${diffDays} дн. назад`;

        return `Был(а) ${lastActivity.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`;
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm relative transition-colors duration-300">
            <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 -ml-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                            aria-label="Назад к списку друзей"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        {totalUnreadCount > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="md:hidden absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full min-w-[16px] text-center font-bold"
                            >
                                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                            </motion.div>
                        )}
                    </div>
                    <Avatar user={friend} />
                    <div>
                        <h3 className="text-neutral-900 dark:text-white font-bold text-lg">{friend.username}</h3>
                        <span className={`text-xs flex items-center font-medium ${friend.is_online ? 'text-green-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                            <span className={`w-2 h-2 rounded-full mr-1 ${friend.is_online ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'}`}></span>
                            {getLastSeenText()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                        <MoreVertical size={20} />
                    </button>
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-12 w-56 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden z-50"
                            >
                                <button onClick={() => { setShowSearch(true); setShowMenu(false); setTimeout(() => searchInputRef.current?.focus(), 100); }} className="w-full px-4 py-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                                    <Search size={16} /> Поиск по сообщениям
                                </button>
                                <button onClick={() => { setShowFriendProfile(true); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                                    <User size={16} /> Профиль
                                </button>
                                <button onClick={handleClearChat} className="w-full px-4 py-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                                    <Trash2 size={16} /> Очистить чат
                                </button>
                                <button onClick={handleRemoveFriend} className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                                    <UserMinus size={16} /> Удалить из друзей
                                </button>
                                {blockedByMe ? (
                                    <button onClick={handleUnblockUser} className="w-full px-4 py-3 text-left text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center gap-2 transition-colors">
                                        <ShieldOff size={16} /> Разблокировать
                                    </button>
                                ) : (
                                    <button onClick={handleBlockUser} className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                                        <ShieldOff size={16} /> Заблокировать
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Search Panel */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 shrink-0"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Поиск сообщений..."
                                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            {searchResults.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium px-2">
                                        {currentSearchIndex + 1}/{searchResults.length}
                                    </span>
                                    <button
                                        onClick={() => navigateSearch(-1)}
                                        className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-700 rounded transition-colors"
                                        title="Предыдущее"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => navigateSearch(1)}
                                        className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-700 rounded transition-colors"
                                        title="Следующее"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={closeSearch}
                                className="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-700 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 custom-scrollbar bg-white dark:bg-neutral-900 scroll-smooth"
            >
                {messages.map((msg, index) => {
                    const isMe = msg.sender.username === user.username;
                    const isNextSame = messages[index + 1]?.sender.username === msg.sender.username;
                    const isSearchResult = searchResults.some(result => result.id === msg.id);
                    const isCurrentSearchResult = searchResults[currentSearchIndex]?.id === msg.id;

                    // Date separator logic
                    const currentDate = new Date(msg.timestamp);
                    const previousDate = index > 0 ? new Date(messages[index - 1].timestamp) : null;

                    const isSameDay = previousDate &&
                        currentDate.getDate() === previousDate.getDate() &&
                        currentDate.getMonth() === previousDate.getMonth() &&
                        currentDate.getFullYear() === previousDate.getFullYear();

                    const getDateLabel = (date) => {
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);

                        // Reset time to compare only dates
                        today.setHours(0, 0, 0, 0);
                        yesterday.setHours(0, 0, 0, 0);
                        const compareDate = new Date(date);
                        compareDate.setHours(0, 0, 0, 0);

                        if (compareDate.getTime() === today.getTime()) {
                            return 'Сегодня';
                        } else if (compareDate.getTime() === yesterday.getTime()) {
                            return 'Вчера';
                        } else {
                            return date.toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
                            });
                        }
                    };

                    return (
                        <React.Fragment key={msg.id}>
                            {!isSameDay && (
                                <div className="flex items-center justify-center my-4">
                                    <div className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                                        {getDateLabel(currentDate)}
                                    </div>
                                </div>
                            )}

                            <div
                                id={`message-${msg.id}`}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isNextSame ? 'mb-0.5' : 'mb-2'}`}
                            >
                                <div
                                    className={`group relative select-none max-w-[85%] sm:max-w-[70%] md:max-w-[60%] ${isCurrentSearchResult ? 'ring-2 ring-yellow-400 rounded-lg' : ''}`}
                                    onContextMenu={(e) => handleContextMenu(e, msg)}
                                    onTouchStart={(e) => handleTouchStart(e, msg)}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {msg.forwarded_from && (
                                        <div className={`text-xs mb-1 ml-1 flex items-center gap-1.5 ${isMe ? 'text-purple-200' : 'text-neutral-500 dark:text-neutral-400'} italic`}>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            <span>Переслано</span>
                                        </div>
                                    )}

                                    <div className={`px-2 py-1 shadow-sm rounded-lg ${isSearchResult && !isCurrentSearchResult ? 'ring-1 ring-yellow-300' : ''} ${isMe
                                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-sm'
                                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-tl-sm border border-neutral-100 dark:border-neutral-700'
                                        }`}>

                                        {msg.reply_to && (
                                            <div
                                                className={`mb-1.5 pl-2 py-1 border-l-2 ${isMe ? 'border-purple-500' : 'border-purple-500'} cursor-pointer hover:opacity-80 transition-opacity bg-black/10 dark:bg-black/20 rounded`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    scrollToMessage(msg.reply_to.id);
                                                }}
                                            >
                                                <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 truncate">
                                                    {msg.reply_to.sender.username}
                                                </div>
                                                <div className="text-[11px] text-neutral-500 dark:text-gray-300 truncate max-w-[200px]">
                                                    {msg.reply_to.content || 'Вложение'}
                                                </div>
                                            </div>
                                        )}

                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mb-1 space-y-1">
                                                {msg.attachments.map(att => {
                                                    const isImage = att.file.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                                    return (
                                                        <div key={att.id} className="rounded-md overflow-hidden">
                                                            {isImage ? (
                                                                <img
                                                                    src={att.file}
                                                                    alt="attachment"
                                                                    className="max-w-full h-auto max-h-80 object-cover cursor-pointer rounded-md"
                                                                    onClick={() => window.open(att.file, '_blank')}
                                                                />
                                                            ) : (
                                                                <a
                                                                    href={att.file}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 p-2 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                                                                >
                                                                    <FileText size={18} className="text-purple-500" />
                                                                    <span className="text-xs truncate max-w-[150px]">{att.file.split('/').pop()}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="text-[14.5px] leading-[1.31]">
                                            {msg.content && (
                                                <span className="whitespace-pre-wrap break-words">
                                                    {msg.content}
                                                </span>
                                            )}
                                            <span className="inline-block ml-1 text-[11px] text-gray-400 dark:text-gray-500 select-none whitespace-nowrap align-bottom">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {isMe && (
                                                    <span className="ml-0.5 text-purple-400">
                                                        {msg.is_read ? '✓✓' : '✓'}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
                {blockedByMe ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center text-sm text-red-600 dark:text-red-400">
                        <Ban size={16} className="inline mr-2" />
                        Разблокируйте пользователя, чтобы отправлять сообщения
                    </div>
                ) : (
                    <>
                        <AnimatePresence>
                            {replyingTo && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="mb-2 p-2 bg-neutral-50 dark:bg-neutral-800/50 border-l-4 border-purple-500 rounded-r-lg flex justify-between items-center"
                                >
                                    <div className="overflow-hidden">
                                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                                            <Reply size={12} />
                                            Ответ пользователю {replyingTo.sender.username}
                                        </div>
                                        <div className="text-sm text-neutral-600 dark:text-neutral-300 truncate mt-0.5">
                                            {replyingTo.content || 'Вложение'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setReplyingTo(null)}
                                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-neutral-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {files.length > 0 && (
                            <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
                                {files.map((file, index) => (
                                    <div key={index} className="relative group flex-shrink-0">
                                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                                            {file.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Paperclip className="text-neutral-400" size={20} />
                                                    <span className="text-[8px] text-neutral-400 mt-1 truncate max-w-[50px]">{file.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSend} className="flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-neutral-800 rounded-full transition-colors"
                            >
                                <ImageIcon size={24} />
                            </button>
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            <textarea
                                ref={textareaRef}
                                value={newMessage}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Напишите сообщение... (Shift+Enter для новой строки)"
                                rows={1}
                                className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 border-none rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                                style={{
                                    minHeight: '42px',
                                    height: '42px',
                                    overflow: newMessage.length > 0 ? 'auto' : 'hidden'
                                }}
                            />

                            <button
                                type="submit"
                                disabled={(!newMessage.trim() && files.length === 0) || loading}
                                className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-600/20"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            </button>
                        </form>
                    </>
                )}
            </div>

            <AnimatePresence>
                {contextMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setContextMenu(null)}
                        ></div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ top: contextMenu.y, left: contextMenu.x }}
                            className="fixed z-50 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden min-w-[160px]"
                        >
                            <button
                                onClick={() => { setReplyingTo(contextMenu.message); setContextMenu(null); }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                                <Reply size={16} /> Ответить
                            </button>
                            <button
                                onClick={() => { setMessageToForward(contextMenu.message); setShowForwardModal(true); setContextMenu(null); }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                                <Forward size={16} /> Переслать
                            </button>
                            <button
                                onClick={() => { navigator.clipboard.writeText(contextMenu.message.content); setContextMenu(null); addToast("Скопировано", "success"); }}
                                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2"
                            >
                                <Copy size={16} /> Копировать
                            </button>
                            {contextMenu.message.sender.username === user.username && (
                                <button
                                    onClick={() => { handleDeleteMessage(contextMenu.message.id); setContextMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Удалить
                                </button>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ForwardModal
                isOpen={showForwardModal}
                onClose={() => setShowForwardModal(false)}
                onSend={handleForward}
                currentChatId={friend.id}
            />

            <ProfileModal
                isOpen={showFriendProfile}
                onClose={() => setShowFriendProfile(false)}
                user={friend}
                friendsCount={0}
                isOwnProfile={false}
                mutualFriendsCount={0}
                onMessage={null}
                onRemoveFriend={async () => {
                    await handleRemoveFriend();
                    setShowFriendProfile(false);
                }}
                onBlock={blockedByMe ? null : async () => {
                    await handleBlockUser();
                    setShowFriendProfile(false);
                }}
                onUnblock={blockedByMe ? async () => {
                    await handleUnblockUser();
                    setShowFriendProfile(false);
                } : null}
                isBlocked={blockedByMe}
            />
        </div>
    );
};

export default ChatWindow;
