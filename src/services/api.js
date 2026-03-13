import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const storyService = {
    getAll: (page = 0, size = 10) => api.get(`/stories?page=${page}&size=${size}`),
    getById: (id) => api.get(`/stories/${id}`),
    search: (query) => api.get(`/stories/search?q=${query}`),
    create: (story) => api.post('/stories', story),
    update: (id, story) => api.put(`/stories/${id}`, story),
    delete: (id) => api.delete(`/stories/${id}`),
};

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => {
        const formData = new FormData();
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('fullName', userData.fullName);
        if (userData.avatar) {
            formData.append('avatar', userData.avatar);
        }
        return api.post('/auth/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
};

export const userService = {
    getAll: (username = '') => api.get(`/admin/users${username ? `?username=${username}` : ''}`),
    create: (user) => api.post('/admin/users', user),
    update: (id, user) => api.put(`/admin/users/${id}`, user),
    delete: (id) => api.delete(`/admin/users/${id}`),
    toggleStatus: (id) => api.post(`/admin/users/${id}/toggle-status`),
    getRoles: () => api.get('/admin/roles'),
    updateRole: (userId, roleIds) => api.post(`/admin/users/${userId}/roles`, roleIds)
};

export const chatbotService = {
    ask: (message, history = []) => api.post('/chatbot/ask', { message, history }),
};

export const mangaSearchService = {
    search: (query, limit = 10) => api.get(`/manga/search?q=${encodeURIComponent(query)}&limit=${limit}`),
    recommend: (storyId, limit = 10) => api.get(`/manga/${storyId}/recommend?limit=${limit}`),
};

export const supportService = {
    openConversation: (userId) => {
        const body = typeof userId === 'number' ? { userId } : {};
        return api.post('/support/conversations', body);
    },
    getMessages: (conversationId) => api.get(`/support/conversations/${conversationId}/messages`),
    // Admin
    listConversations: (status) => api.get(`/admin/support/conversations${status ? '?status=' + status : ''}`),
    assignAdmin: (convId, adminId) => api.post(`/admin/support/conversations/${convId}/assign`, { adminId }),
    closeConversation: (convId) => api.post(`/admin/support/conversations/${convId}/close`),
    adminReply: (convId, adminId, content) => api.post(`/admin/support/conversations/${convId}/reply`, { adminId, content }),
    // FAQ
    listFaq: () => api.get('/admin/support/faq'),
    createFaq: (faq) => api.post('/admin/support/faq', faq),
    updateFaq: (id, faq) => api.put(`/admin/support/faq/${id}`, faq),
    deleteFaq: (id) => api.delete(`/admin/support/faq/${id}`),
};

export const otruyenService = {
    search: (keyword) => axios.get(`https://otruyenapi.com/v1/api/tim-kiem?keyword=${keyword}`),
    getDetail: (slug) => axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`),
    importStory: (storyData) => api.post('/stories/import', storyData)
};

export default api;
