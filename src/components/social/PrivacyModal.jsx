import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Ban } from 'lucide-react';

const PrivacyModal = ({ isOpen, onClose, settings, onToggleSetting, blockedCount }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Конфиденциальность</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
                            >
                                <X size={20} className="text-neutral-500" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div
                                className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                onClick={() => onToggleSetting('onlineStatus')}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <Lock size={18} className="text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-neutral-900 dark:text-white">Невидимка</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${!settings.onlineStatus ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                        <motion.div
                                            layout
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                            style={{ left: !settings.onlineStatus ? '20px' : '4px' }}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Другие пользователи не будут видеть когда вы онлайн</p>
                            </div>

                            <div
                                className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                onClick={() => onToggleSetting('allowFriendRequests')}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <User size={18} className="text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-neutral-900 dark:text-white">Кто может добавить в друзья</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full transition-all duration-300 relative ${settings.allowFriendRequests ? 'bg-purple-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                                        <motion.div
                                            layout
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                            style={{ left: settings.allowFriendRequests ? '20px' : '4px' }}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                    {settings.allowFriendRequests ? 'Все пользователи' : 'Никто'}
                                </p>
                            </div>

                            <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Ban size={18} className="text-purple-600 dark:text-purple-400" />
                                    <span className="font-medium text-neutral-900 dark:text-white">Заблокировано</span>
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300">{blockedCount} пользователей</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PrivacyModal;
