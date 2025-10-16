import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth state
      localStorage.removeItem('token');
      // Optionally redirect to login or refresh page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (username: string, password: string) => {
    const response = await api.post("/api/auth/register", {
      username,
      password,
    });
    return response.data;
  },
  login: async (username: string, password: string) => {
    const response = await api.post("/api/auth/login", { username, password });
    return response.data;
  },
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      // Still return success to clear local state
      return { success: true };
    }
  },
};

export const treeApi = {
  getAll: async () => {
    const response = await api.get("/api/trees");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/trees/${id}`);
    return response.data;
  },
  create: async (startNumber: number) => {
    const response = await api.post("/api/trees", { startNumber });
    return response.data;
  },
};

export const operationApi = {
  create: async (data: {
    treeId: string;
    parentId?: string;
    operationType: string;
    operand: number;
  }) => {
    const response = await api.post("/api/operations", data);
    return response.data;
  },
};

export default api;
