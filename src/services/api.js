import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const getServerUrl = (path) => {
    if (!path) return 'https://github.com/shadcn.png';
    if (path.startsWith('http')) return path;
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${path}`;
};

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
    getAll: (page = 0, size = 10, sort = 'id,desc') => api.get(`/stories?page=${page}&size=${size}&sort=${sort}`),
    getPopular: (size = 10) => api.get(`/stories?page=0&size=${size}&sort=viewCount,desc`),
    getLatest: (size = 10) => api.get(`/stories?page=0&size=${size}&sort=createdAt,desc`),
    getById: (id) => api.get(`/stories/${id}`),
    search: (query, page = 0, size = 20) => api.get(`/stories/search?q=${query}&page=${page}&size=${size}`),
    getByGenre: (genreSlug, page = 0, size = 20) => api.get(`/stories/genre/${genreSlug}?page=${page}&size=${size}`),
    getByStatus: (status, page = 0, size = 20) => api.get(`/stories/status/${status}?page=${page}&size=${size}`),
    getPremium: (page = 0, size = 20) => api.get(`/stories/premium?page=${page}&size=${size}`),
    getNewest: (page = 0, size = 20) => api.get(`/stories/new?page=${page}&size=${size}`),
    create: (story) => api.post('/stories', story),
    update: (id, story) => api.put(`/stories/${id}`, story),
    delete: (id) => api.delete(`/stories/${id}`),
};

export const chapterService = {
    getByStory: (storyId, page = 0, size = 100) => api.get(`/chapters/story/${storyId}?page=${page}&size=${size}&sort=chapterNumber,asc`),
    getById: (id) => api.get(`/chapters/${id}`),
    getByNumber: (storyId, number) => api.get(`/chapters/story/${storyId}/number/${number}`),
    create: (chapter) => api.post('/chapters', chapter),
    update: (id, chapter) => api.put(`/chapters/${id}`, chapter),
    delete: (id) => api.delete(`/chapters/${id}`),
};

export const genreService = {
    getAll: () => api.get('/genres'),
    getById: (slug) => api.get(`/genres/slug/${slug}`),
    create: (genre) => api.post('/genres', genre),
    update: (id, genre) => api.put(`/genres/${id}`, genre),
    delete: (id) => api.delete(`/genres/${id}`),
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
    getProfile: () => api.get('/users/me'),
    updateProfile: (profileData) => {
        const formData = new FormData();
        formData.append('fullName', profileData.fullName);
        formData.append('email', profileData.email);
        if (profileData.avatar) {
            formData.append('avatar', profileData.avatar);
        }
        if (profileData.newPassword) {
            formData.append('newPassword', profileData.newPassword);
        }
        return api.put('/users/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    create: (user) => api.post('/admin/users', user),
    update: (id, user) => api.put(`/admin/users/${id}`, user),
    delete: (id) => api.delete(`/admin/users/${id}`),
    toggleStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
    getRoles: () => api.get('/admin/roles'),
    updateRole: (userId, roleIds) => api.post(`/admin/users/${userId}/roles`, roleIds)
};

export const otruyenService = {
    search: (keyword) => axios.get(`https://otruyenapi.com/v1/api/tim-kiem?keyword=${keyword}`),
    getDetail: (slug) => axios.get(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`),
    importStory: (storyData) => api.post('/stories/import', storyData)
};

export default api;
