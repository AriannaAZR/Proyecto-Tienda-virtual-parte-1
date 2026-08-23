// Capturar elementos del HTML por ID

let tablaUsuarios = document.getElementById("tabla-usuarios");
let formUsuario = document.getElementById("formulario-usuario");
let selectRol = document.getElementById("rol");
let inputUsuario = document.getElementById("usuario");
let inputContrasena = document.getElementById("contrasena");
let inputConfirmar = document.getElementById("confirmar_contrasena");

document.addEventListener("DOMContentLoaded", () => {

    // Si estamos en la página de lista de usuarios

    if (tablaUsuarios) {
        obtenerUsuarios();
    }

    // Si estamos en la página de crear usuario

    if (formUsuario) {
        formUsuario.addEventListener("submit", (e) => {
            e.preventDefault(); // Prevenir recarga
            crearUsuario();
        });
    }
});

// Función para Obtener todos los usuarios

async function obtenerUsuarios() {
    try {
        let url = "http://localhost:3000/api/usuarios";
        let respuesta = await fetch(url);
        let usuarios = await respuesta.json();

        // Limpiar la tabla
        tablaUsuarios.innerHTML = "";

        // Recorrer los usuarios y agregarlos a la tabla

        usuarios.forEach((user, i) => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${user.usuario}</td>
                <td><span class="badge badge-info">${user.rol}</span></td>
                <td>${user.created_at ? user.created_at.substring(0, 10) : 'N/A'}</td>
                <td>
                    <button class="btn btn-warning btn-sm">🖊️</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" onclick="eliminarUsuario(${user.id})">✖️</button>
                </td>
            `;
            tablaUsuarios.appendChild(fila);
        });

    } catch (error) {
        console.log("Error al cargar usuarios:", error);
    }
}

// Función para Crear un nuevo usuario

async function crearUsuario() {
    // Validar el rol
    if (!selectRol.value || selectRol.value === "Seleccionar Rol") {
        alert("Por favor selecciona un rol válido.");
        return;
    }

    // Validar que las contraseñas coincidan
    if (inputContrasena.value !== inputConfirmar.value) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Objeto con los datos del nuevo usuario
    let nuevoUsuario = {
        rol: selectRol.value,
        usuario: inputUsuario.value,
        contrasena: inputContrasena.value
    };

    try {
        let url = "http://localhost:3000/api/usuarios";
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoUsuario)
        });

        if (respuesta.status === 201 || respuesta.ok) {
            alert("¡Usuario creado con éxito!");
            window.location.href = "listado-usuarios.html";
        } else {
            let resData = await respuesta.json();
            alert("Error al crear usuario: " + (resData.message || "Inténtalo de nuevo."));
        }
    } catch (error) {
        console.log("Error al crear usuario:", error);
    }
}

// Función para Eliminar un usuario

async function eliminarUsuario(id) {
    let confirmar = confirm("¿Deseas eliminar este usuario?");
    if (!confirmar) return;

    try {
        let url = `http://localhost:3000/api/usuarios/${id}`;
        let respuesta = await fetch(url, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Usuario eliminado con éxito.");
            obtenerUsuarios(); // Recargar la tabla
        } else {
            alert("No se pudo eliminar el usuario.");
        }
    } catch (error) {
        console.log("Error al eliminar usuario:", error);
    }
}
