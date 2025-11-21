import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

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

axios.interceptors.request.use(config => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
}, error => Promise.reject(error));

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:8000';

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/user/`);
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            await axios.post(`${API_URL}/api/auth/login/`, {
                email,
                password,
            });
            await fetchUser();
            return { success: true };
        } catch (error) {
            console.error("Login error details:", error.response?.data);
            return { success: false, error: error.response?.data || "Login failed" };
        }
    };

    const register = async (email, password, username) => {
        try {
            await axios.post(`${API_URL}/api/auth/registration/`, {
                email,
                password1: password,
                password2: password,
                username,
            });
            return await login(email, password);
        } catch (error) {
            console.error("Registration error details:", error.response?.data);
            return { success: false, error: error.response?.data || "Registration failed" };
        }
    };

    const logout = async () => {
        try {
            console.log("Logging out...");
            await axios.post(`${API_URL}/api/auth/logout/`);
            console.log("Logout successful");
        } catch (e) {
            console.error("Logout error", e);
        }
        setUser(null);
    };

    const socialLogin = (provider, process = 'login') => {
        let url = `${API_URL}/accounts/${provider}/login/`;
        let params = new URLSearchParams();

        if (process === 'connect') {
            params.append('process', 'connect');
        }

        params.append('next', 'http://localhost:3000');

        window.location.href = `${url}?${params.toString()}`;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        socialLogin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
