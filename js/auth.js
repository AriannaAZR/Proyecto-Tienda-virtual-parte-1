// Helper de sesión y roles - usado por productos.js, clientes.js y pedidos.js
// para el Proceso 3 (restringir al vendedor de eliminar registros)

// Obtiene el usuario que quedó guardado en localStorage tras el login
function obtenerUsuarioLogueado() {
    let data = localStorage.getItem("userLogin");
    return data ? JSON.parse(data) : null;
}

// true si el usuario logueado tiene rol administrador
function esAdministrador() {
    let user = obtenerUsuarioLogueado();
    return !!(user && user.rol === "administrador");
}
