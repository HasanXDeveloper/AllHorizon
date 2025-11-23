import axios from 'axios';

const API_URL = 'http://localhost:8000/api/social';

const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    return token ? { Authorization: `Token ${token}` } : {};
};

// Or if using cookies with credentials: true
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for session/cookie auth
});

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

api.interceptors.request.use(config => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
}, error => Promise.reject(error));

export const socialApi = {
    searchUsers: (query) => api.get(`/users/search/?q=${query}`),

    getFriendRequests: () => api.get('/friends/requests/'),

    respondFriendRequest: (requestId, status) =>
        api.patch(`/friends/requests/${requestId}/`, { status }),

    cancelFriendRequest: (requestId) =>
        api.delete(`/friends/requests/${requestId}/`),

    sendFriendRequest: (toUserId) =>
        api.post('/friends/requests/', { to_user_id: toUserId }),

    getFriends: () => api.get('/friends/'),

    getMessages: (userId) => api.get(`/messages/?user_id=${userId}`),

    sendMessage: (receiverId, content, files = [], replyToId = null, forwardedFromId = null) => {
        const formData = new FormData();
        formData.append('receiver_id', receiverId);
        formData.append('content', content);
        if (replyToId) {
            formData.append('reply_to_id', replyToId);
        }
        if (forwardedFromId) {
            formData.append('forwarded_from_id', forwardedFromId);
        }
        files.forEach(file => {
            formData.append('uploaded_files', file);
        });

        return api.post('/messages/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    blockUser: (userId) => api.post(`/users/${userId}/block/`),
    unblockUser: (userId) => api.delete(`/users/${userId}/block/`),
    getBlockedUsers: () => api.get('/blocked/'),

    // Mute
    muteUser: (userId) => api.post(`/users/${userId}/mute/`),
    unmuteUser: (userId) => api.delete(`/users/${userId}/unmute/`),

    clearChat: (userId) => api.delete(`/users/${userId}/clear-chat/`),
    removeFriend: (userId) => api.delete(`/users/${userId}/remove-friend/`),
    deleteMessage: (messageId) => api.delete(`/messages/${messageId}/`),
    getProfileSettings: () => api.get('/profile/settings/'),
    updateProfileSettings: (settings) => api.post('/profile/settings/', settings),
    getCurrentUser: () => api.get('/me/'),
};
