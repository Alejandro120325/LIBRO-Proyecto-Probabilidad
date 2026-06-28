import api from "./api.js";

export const authService = {
  register: async (payload) => (await api.post("/auth/register", payload)).data,
  login: async (payload) => (await api.post("/auth/login", payload)).data,
  me: async () => (await api.get("/auth/me")).data,
  logout: async () => (await api.post("/auth/logout")).data,
};
