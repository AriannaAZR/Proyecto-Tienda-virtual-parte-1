// Capturar elementos del HTML por ID

let tablaClientes = document.getElementById("tabla-clientes");
let formCliente = document.getElementById("formulario-cliente");
let inputNombre = document.getElementById("nombre-cli");
let inputApellido = document.getElementById("apellido-cli");
let inputEmail = document.getElementById("email-cli");
let inputCelular = document.getElementById("celular-cli");
let inputDireccion = document.getElementById("direccion-cli");
let inputDireccion2 = document.getElementById("direccion2-cli");
let inputDescripcion = document.getElementById("descripcion-cli");

// 2. Ejecutar al cargar la página

document.addEventListener("DOMContentLoaded", () => {
    // Si estamos en la página del listado de clientes
    if (tablaClientes) {
        obtenerClientes();
    }

    // Si estamos en la página de crear cliente (existe el formulario)
    if (formCliente) {
        formCliente.addEventListener("submit", (e) => {
            e.preventDefault();
            crearCliente();
        });
    }
});

// Función para Obtener todos los clientes

async function obtenerClientes() {
    try {
        let url = "http://localhost:3000/api/clientes";
        let respuesta = await fetch(url);
        let clientes = await respuesta.json();

        // Limpiar la tabla
        tablaClientes.innerHTML = "";

        // Recorrer los clientes 

        clientes.forEach((cli, i) => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${cli.nombre}</td>
                <td>${cli.apellido}</td>
                <td>${cli.email}</td>
                <td>${cli.celular}</td>
                <td>${cli.direccion}</td>
                <td>
                    <button class="btn btn-warning btn-sm">🖊️</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" onclick="eliminarCliente(${cli.id})">✖️</button>
                </td>
            `;
            tablaClientes.appendChild(fila);
        });

    } catch (error) {
        console.log("Error al cargar clientes:", error);
    }
}

// Función para Crear un nuevo cliente

async function crearCliente() {

    // Validar campos obligatorios

    if (!inputNombre.value || !inputApellido.value || !inputEmail.value || !inputCelular.value || !inputDireccion.value) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
    }

    // Armar el objeto con los datos introducidos
    
    let nuevoCliente = {
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        email: inputEmail.value,
        celular: inputCelular.value,
        direccion: inputDireccion.value,
        direccion2: inputDireccion2 ? inputDireccion2.value : "",
        descripcion: inputDescripcion ? inputDescripcion.value : ""
    };

    try {
        let url = "http://localhost:3000/api/clientes";
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoCliente)
        });

        if (respuesta.ok) {
            alert("¡Cliente creado con éxito!");
            window.location.href = "listado-clientes.html";
        } else {
            alert("Error al guardar el cliente.");
        }
    } catch (error) {
        console.log("Error al crear cliente:", error);
    }
}

// Función para Eliminar un cliente

async function eliminarCliente(id) {
    let confirmar = confirm("¿Deseas eliminar este cliente?");
    if (!confirmar) return;

    try {
        let url = `http://localhost:3000/api/clientes/${id}`;
        let respuesta = await fetch(url, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Cliente eliminado con éxito.");
            obtenerClientes(); // Recargar la tabla
        } else {
            alert("No se pudo eliminar el cliente.");
        }
    } catch (error) {
        console.log("Error al eliminar cliente:", error);
    }
}
