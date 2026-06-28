import axios from "axios";

export const API_CONNECTION_ERROR =
  "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en el puerto 4000.";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("probabilidad_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getApiErrorMessage(error) {
  if (!error.response) return API_CONNECTION_ERROR;
  return error.response.data?.message || "No fue posible completar la solicitud.";
}

export default api;
