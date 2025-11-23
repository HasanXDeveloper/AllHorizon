import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, UserMinus, Ban, Calendar, Users, UserCheck, Edit2, Save, XCircle, Gamepad2, Award } from 'lucide-react';
import { socialApi } from '../../services/socialApi';
import { useToast } from '../../context/ToastContext';

const ProfileModal = ({
    isOpen,
    onClose,
    user,
    friendsCount = 0,
    isOwnProfile = false,
    mutualFriendsCount = 0,
    onMessage,
    onRemoveFriend,
    onBlock,
    onUnblock,
    isBlocked = false,
    onProfileUpdate
}) => {
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editedBio, setEditedBio] = useState(user?.bio || '');
    const [editedBannerColor, setEditedBannerColor] = useState(user?.banner_color || 'purple');
    const [editedFavoriteGame, setEditedFavoriteGame] = useState(user?.favorite_game || '');

    // Update edited values when user prop changes
    React.useEffect(() => {
        setEditedBio(user?.bio || '');
        setEditedBannerColor(user?.banner_color || 'purple');
        setEditedFavoriteGame(user?.favorite_game || '');
        setIsEditing(false);
    }, [user?.bio, user?.banner_color, user?.favorite_game]);

    const bannerGradients = {
        purple: 'from-purple-500 via-purple-600 to-blue-600',
        blue: 'from-blue-500 via-blue-600 to-cyan-600',
        green: 'from-green-500 via-emerald-600 to-teal-600',
        red: 'from-red-500 via-rose-600 to-pink-600',
        orange: 'from-orange-500 via-amber-600 to-yellow-600',
        pink: 'from-pink-500 via-fuchsia-600 to-purple-600'
    };

    const colorPreview = {
        purple: 'bg-gradient-to-r from-purple-500 to-blue-600',
        blue: 'bg-gradient-to-r from-blue-500 to-cyan-600',
        green: 'bg-gradient-to-r from-green-500 to-teal-600',
        red: 'bg-gradient-to-r from-red-500 to-pink-600',
        orange: 'bg-gradient-to-r from-orange-500 to-yellow-600',
        pink: 'bg-gradient-to-r from-pink-500 to-purple-600'
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Неизвестно';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getBadges = () => {
        const badges = [];

        // Early Supporter (joined before 2025)
        if (user?.date_joined && new Date(user.date_joined).getFullYear() < 2025) {
            badges.push({ icon: '🌟', name: 'Ранний участник', color: 'text-yellow-500' });
        }

        // Social Butterfly (10+ friends)
        if (friendsCount >= 10) {
            badges.push({ icon: '👥', name: 'Социальная бабочка', color: 'text-blue-500' });
        }

        // Legend (50+ friends)
        if (friendsCount >= 50) {
            badges.push({ icon: '🏆', name: 'Легенда', color: 'text-purple-500' });
        }

        // Gamer (has favorite game)
        if (user?.favorite_game) {
            badges.push({ icon: '🎮', name: 'Геймер', color: 'text-green-500' });
        }

        return badges;
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await socialApi.updateProfileSettings({
                bio: editedBio,
                banner_color: editedBannerColor,
                favorite_game: editedFavoriteGame
            });
            addToast('Профиль обновлен!', 'success');
            setIsEditing(false);
            if (onProfileUpdate) {
                await onProfileUpdate();
            }
            // Close modal to force refresh on next open
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Error updating profile:', error);
            addToast('Не удалось обновить профиль', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedBio(user?.bio || '');
        setEditedBannerColor(user?.banner_color || 'purple');
        setEditedFavoriteGame(user?.favorite_game || '');
        setIsEditing(false);
    };

    const badges = getBadges();
    const currentBannerColor = isEditing ? editedBannerColor : (user?.banner_color || 'purple');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        {/* Banner */}
                        <div className={`h-24 bg-gradient-to-br ${bannerGradients[currentBannerColor]} relative`}>
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X size={20} className="text-white" />
                            </button>
                            {isOwnProfile && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="absolute top-3 left-3 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm"
                                >
                                    <Edit2 size={20} className="text-white" />
                                </button>
                            )}
                        </div>

                        {/* Avatar Section */}
                        <div className="px-6 pb-6">
                            <div className="flex items-end justify-between -mt-16 mb-4">
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl overflow-hidden border-[6px] border-white dark:border-neutral-900 shadow-xl">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            user?.username?.[0]?.toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full border-[4px] border-white dark:border-neutral-900 ${user?.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                                    {user?.username || 'Пользователь'}
                                </h2>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono mb-2">
                                    #{user?.id || '0000'}
                                </p>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${user?.is_online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    <span className={`text-sm font-medium ${user?.is_online ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        {user?.is_online ? 'В сети' : 'Не в сети'}
                                    </span>
                                </div>

                                {/* Badges */}
                                {badges.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {badges.map((badge, index) => (
                                            <div
                                                key={index}
                                                className="group relative px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center gap-1.5 cursor-help"
                                                title={badge.name}
                                            >
                                                <span className="text-sm">{badge.icon}</span>
                                                <span className={`text-xs font-semibold ${badge.color}`}>{badge.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bio Section */}
                            <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                                    О пользователе
                                </h3>
                                {isEditing ? (
                                    <div>
                                        <textarea
                                            value={editedBio}
                                            onChange={(e) => setEditedBio(e.target.value.slice(0, 500))}
                                            placeholder="Расскажите о себе..."
                                            className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            rows={3}
                                        />
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 text-right">
                                            {editedBio.length}/500
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                        {user?.bio || user?.email || 'Информация не указана'}
                                    </p>
                                )}
                            </div>

                            {/* Favorite Game */}
                            {(isEditing || user?.favorite_game) && (
                                <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gamepad2 size={16} className="text-purple-500" />
                                        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                            Любимая игра
                                        </h3>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedFavoriteGame}
                                            onChange={(e) => setEditedFavoriteGame(e.target.value.slice(0, 100))}
                                            placeholder="Minecraft, CS:GO, Dota 2..."
                                            className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                            {user?.favorite_game}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Banner Color Picker */}
                            {isEditing && (
                                <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                    <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                                        Цвет баннера
                                    </h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Object.keys(bannerGradients).map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setEditedBannerColor(color)}
                                                className={`w-full h-10 rounded-lg ${colorPreview[color]} transition-all ${editedBannerColor === color
                                                    ? 'ring-4 ring-purple-500 scale-110'
                                                    : 'hover:scale-105'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={16} className="text-purple-500" />
                                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                                            Участник с
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                        {formatDate(user?.date_joined)}
                                    </p>
                                </div>

                                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users size={16} className="text-purple-500" />
                                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                                            Друзей
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        {friendsCount}
                                    </p>
                                </div>

                                {!isOwnProfile && mutualFriendsCount > 0 && (
                                    <div className="col-span-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <UserCheck size={16} className="text-purple-600 dark:text-purple-400" />
                                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
                                                Общих друзей
                                            </p>
                                        </div>
                                        <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                            {mutualFriendsCount}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} />
                                        Отмена
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Сохранение...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Сохранить
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            ) : !isOwnProfile && (
                                <div className="space-y-2">
                                    {onMessage && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                onMessage();
                                                onClose();
                                            }}
                                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25"
                                        >
                                            <MessageCircle size={18} />
                                            Написать сообщение
                                        </motion.button>
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                        {onRemoveFriend && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    onRemoveFriend();
                                                    onClose();
                                                }}
                                                className="py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                                            >
                                                <UserMinus size={16} />
                                                Удалить
                                            </motion.button>
                                        )}

                                        {(onBlock || onUnblock) && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    if (isBlocked && onUnblock) {
                                                        onUnblock();
                                                    } else if (!isBlocked && onBlock) {
                                                        onBlock();
                                                    }
                                                    onClose();
                                                }}
                                                className={`py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isBlocked
                                                        ? 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400'
                                                    }`}
                                            >
                                                <Ban size={16} />
                                                {isBlocked ? 'Разблокировать' : 'Блок'}
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
