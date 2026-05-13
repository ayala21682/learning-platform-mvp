import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const login = (phone, password) => {
  const form = new URLSearchParams();
  form.append('username', phone);
  form.append('password', password);
  return api.post('/auth/token', form);
};

export const getMe = () => api.get('/auth/me');
export const register = (data) => api.post('/users/', data);

export const getCategories = () => api.get('/categories/');
export const getSubcategoriesByCategory = (categoryId) => api.get(`/subcategories/category/${categoryId}`);

export const getPrompts = () => api.get('/prompts/');
export const getAllPrompts = () => api.get('/prompts/all');
export const createPrompt = (data) => api.post('/prompts/', data);
export const deletePrompt = (id) => api.delete(`/prompts/${id}`);

export const getUsers = () => api.get('/users/');
export const createCategory = (data) => api.post('/categories/', data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const createSubcategory = (data) => api.post('/subcategories/', data);
export const deleteSubcategory = (id) => api.delete(`/subcategories/${id}`);

export default api;
