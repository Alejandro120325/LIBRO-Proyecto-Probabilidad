export function notFoundMiddleware(request, response) {
  response.status(404).json({ message: "Ruta no encontrada." });
}

export function errorMiddleware(error, request, response, next) {
  if (response.headersSent) return next(error);

  console.error(error);
  const status = error.status || 500;
  const message = status === 500
    ? "Ocurrió un error interno en el servidor."
    : error.message;
  return response.status(status).json({ message });
}
