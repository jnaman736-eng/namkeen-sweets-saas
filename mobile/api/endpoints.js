import apiClient from './client';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  verify: () => apiClient.get('/auth/verify'),
  refresh: () => apiClient.post('/auth/refresh')
};

export const ordersAPI = {
  getAll: (params) => apiClient.get('/orders', { params }),
  getById: (id) => apiClient.get(`/orders/${id}`),
  create: (data) => apiClient.post('/orders', data),
  updateStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status })
};

export const inventoryAPI = {
  getByLocation: (locationId) => apiClient.get(`/inventory/location/${locationId}`),
  getLowStock: () => apiClient.get('/inventory/alerts/low-stock'),
  updateStock: (id, data) => apiClient.put(`/inventory/${id}/update-stock`, data),
  transfer: (data) => apiClient.post('/inventory/transfer', data)
};

export const locationsAPI = {
  getAll: () => apiClient.get('/locations'),
  getById: (id) => apiClient.get(`/locations/${id}`),
  create: (data) => apiClient.post('/locations', data),
  update: (id, data) => apiClient.put(`/locations/${id}`, data)
};

export const customersAPI = {
  getAll: (params) => apiClient.get('/customers', { params }),
  create: (data) => apiClient.post('/customers', data),
  update: (id, data) => apiClient.put(`/customers/${id}`, data)
};

export const analyticsAPI = {
  getSales: (params) => apiClient.get('/analytics/sales', { params }),
  getInventory: () => apiClient.get('/analytics/inventory')
};

export const reportsAPI = {
  getDailySales: (date) => apiClient.get('/reports/daily-sales', { params: { date } }),
  getMonthlySales: () => apiClient.get('/reports/monthly-sales')
};
