import axios from "axios";


const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5050/api",

  headers: {
    "Content-Type": "application/json",
  },
});
// --------------------------------
// Dashboard API
// --------------------------------

export const dashboardApi = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  getBookingsOverTime: async () => {
    const response = await api.get("/dashboard/bookings-over-time");
    return response.data;
  },

  getRevenueOverTime: async () => {
    const response = await api.get("/dashboard/revenue-over-time");
    return response.data;
  },

  getBookingStatus: async () => {
    const response = await api.get("/dashboard/booking-status");
    return response.data;
  },

  getServiceBreakdown: async () => {
    const response = await api.get("/dashboard/service-breakdown");
    return response.data;
  },
};

// --------------------------------
// Bookings API
// --------------------------------

export const bookingsApi = {
  getBookings: async (params?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/bookings", { params });
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
};

// --------------------------------
// Mechanics API
// --------------------------------

export const mechanicsApi = {
  getMechanics: async (params?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/mechanics", { params });
    return response.data;
  },

  getMechanicById: async (id: string) => {
    const response = await api.get(`/mechanics/${id}`);
    return response.data;
  },
};

// --------------------------------
// Customers API
// --------------------------------

export const customersApi = {
  getCustomers: async (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/customers", { params });
    return response.data;
  },

  getCustomerById: async (id: string) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
};

export default api;