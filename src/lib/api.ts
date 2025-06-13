import { FilterOptions } from "@/components/FilterPanel";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
  }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (userData: { username: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

// Properties API
export const propertiesAPI = {
  getAll: async (searchTerm: string, filters: FilterOptions) => {
    let url = `${API_URL}/properties?`;
    
    if (searchTerm) {
      url += `search=${encodeURIComponent(searchTerm)}&`;
    }
    
    if (filters.priceRange) {
      url += `min_price=${filters.priceRange[0]}&max_price=${filters.priceRange[1]}&`;
    }
    
    if (filters.propertyTypes.length > 0) {
      url += `property_types=${filters.propertyTypes.join(",")}&`;
    }
    
    const response = await fetch(url);
    return response.json();
  },

  getOne: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  create: async (propertyData: any, token: string) => {
    const response = await fetch(`${API_URL}/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });
    return response.json();
  },

  update: async (id: string, propertyData: any, token: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });
    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

// Local storage utilities for token management
export const tokenStorage = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  removeToken: () => {
    localStorage.removeItem("token");
  },
  setUser: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => {
    localStorage.removeItem("user");
  },
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },
}; 