// Middleware - Proceso 3
// Bloquea las eliminaciones (DELETE) cuando quien hace la petición no es administrador.
//
// El proyecto no maneja tokens/sesión en el backend, así que el rol viaja en el
// header "x-user-rol" (lo envía el frontend en cada fetch de eliminación).
// No es tan seguro como un JWT, pero evita que el vendedor elimine registros
// aunque manipule el frontend, ya que ahora también se valida en el servidor.

const soloAdministrador = (req, res, next) => {
  const rol = req.headers["x-user-rol"]

  if (rol !== "administrador") {
    return res.status(403).json({
      message: "No tienes permisos para realizar esta acción. Solo el administrador puede eliminar registros.",
    })
  }

  next()
}

module.exports = { soloAdministrador }
