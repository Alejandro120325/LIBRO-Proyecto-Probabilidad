export function adminMiddleware(request, response, next) {
  if (request.user?.role !== "admin") {
    return response.status(403).json({ message: "No tienes permisos para acceder a esta sección." });
  }
  return next();
}
