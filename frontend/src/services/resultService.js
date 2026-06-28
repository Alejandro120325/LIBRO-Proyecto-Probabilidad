import api from "./api.js";

export const resultService = {
  save: async (payload) => (await api.post("/results", payload)).data,
  saveResult: async (payload) => (await api.post("/results", payload)).data,
  getMine: async () => (await api.get("/results/my-results")).data,
  getMyResults: async () => (await api.get("/results/my-results")).data,
  getSummary: async () => (await api.get("/results/summary")).data,
  getLeaderboard: async () => (await api.get("/results/leaderboard")).data,
};
