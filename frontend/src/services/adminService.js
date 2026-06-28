import api from "./api.js";

export const adminService = {
  getDashboard: async () => (await api.get("/admin/dashboard")).data,
  getUsers: async (params = {}) => (await api.get("/admin/users", { params })).data,
  getUserById: async (id) => (await api.get(`/admin/users/${id}`)).data,
  updateUser: async (id, payload) => (await api.put(`/admin/users/${id}`, payload)).data,
  suspendUser: async (id) => (await api.patch(`/admin/users/${id}/suspend`)).data,
  activateUser: async (id) => (await api.patch(`/admin/users/${id}/activate`)).data,
  deleteUser: async (id) => (await api.delete(`/admin/users/${id}`)).data,
  getAllResults: async (params = {}) => (await api.get("/admin/results", { params })).data,
  deleteResult: async (id) => (await api.delete(`/admin/results/${id}`)).data,
  getAdminLeaderboard: async () => (await api.get("/admin/leaderboard")).data,
  getAuditLogs: async (params = {}) => (await api.get("/admin/audit-logs", { params })).data,
};
