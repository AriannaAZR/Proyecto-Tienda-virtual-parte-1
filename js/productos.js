// Capturar elementos del HTML por ID

let listadoPro = document.getElementById("listado-producto");
let selectNombre = document.getElementById("productos-select");
let inputPrecio = document.getElementById("precio-pro");
let inputStock = document.getElementById("stock-pro");
let inputDescripcion = document.getElementById("descripcion-pro");
let imgPro = document.getElementById("imagen-pro");
let btnCrear = document.getElementById("btn-crear-producto");
let buscadorProducto = document.getElementById("buscador-producto");

// Guardamos aquí el último listado que trajo el backend, para poder
// filtrarlo en el navegador sin volver a pedirlo cada vez que se escribe
let listaProductosGlobal = [];


document.addEventListener("DOMContentLoaded", () => {
    // Si estamos en la página del listado (existe la tabla)
    if (listadoPro) {
        obtenerProductos();
    }

    // Si estamos en la página de crear (existe el botón)
    if (btnCrear) {
        btnCrear.addEventListener("click", () => {
            crearProducto();
        });
    }

    // Buscador del listado (Proceso 3)
    if (buscadorProducto) {
        buscadorProducto.addEventListener("input", () => {
            filtrarProductos(buscadorProducto.value);
        });
    }
});

// Función para Obtener todos los productos (GET)

async function obtenerProductos() {
    try {
        let url = "http://localhost:3000/api/productos";
        let respuesta = await fetch(url);
        let productos = await respuesta.json();

        listaProductosGlobal = productos;
        renderizarProductos(productos);

    } catch (error) {
        console.log("Error al cargar productos:", error);
    }
}

// Pinta las filas de la tabla a partir del arreglo que se le pase
// (se separó de obtenerProductos para poder reutilizarla con el buscador)

function renderizarProductos(productos) {
    // Limpiar la tabla
    listadoPro.innerHTML = "";

    // Solo el administrador puede ver el botón de eliminar (Proceso 3)
    let permitirEliminar = esAdministrador();

    // Recorrer cada producto y crear su fila <tr> en la tabla

    productos.forEach((pro, i) => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${pro.nombre}</td>
            <td>${pro.descripcion || ''}</td>
            <td>$${pro.precio}</td>
            <td>${pro.stock}</td>
            <td>
                <img src="${pro.imagen}" width="80" alt="${pro.nombre}">
            </td>
            <td>
                <button class="btn btn-warning btn-sm">🖊️</button>
                ${permitirEliminar
                    ? `<button class="btn btn-danger btn-sm btn-eliminar" onclick="eliminarProducto(${pro.id})">✖️</button>`
                    : ``
                }
            </td>
        `;
        listadoPro.appendChild(fila);
    });
}

// Filtra el listado local por nombre o descripción (Proceso 3 - buscador)

function filtrarProductos(texto) {
    let filtro = texto.trim().toLowerCase();

    if (!filtro) {
        renderizarProductos(listaProductosGlobal);
        return;
    }

    let resultado = listaProductosGlobal.filter(pro =>
        pro.nombre.toLowerCase().includes(filtro) ||
        (pro.descripcion && pro.descripcion.toLowerCase().includes(filtro))
    );

    renderizarProductos(resultado);
}

// Función para Crear un producto (POST)

async function crearProducto() {

    // Validar que se haya seleccionado un producto y escrito precio y stock

    if (!selectNombre.value || selectNombre.value === "Seleccionar un producto") {
        alert("Por favor selecciona un producto.");
        return;
    }
    if (!inputPrecio.value || !inputStock.value) {
        alert("El precio y el stock son obligatorios.");
        return;
    }

    // Crear el objeto con los datos introducidos

    let nuevoProducto = {
        nombre: selectNombre.value,
        descripcion: inputDescripcion.value,
        precio: parseFloat(inputPrecio.value),
        stock: parseInt(inputStock.value),
        imagen: imgPro.src
    };

    try {
        let url = "http://localhost:3000/api/productos";
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoProducto)
        });

        if (respuesta.ok) {
            alert("¡Producto creado con éxito!");
            // Redireccionar al listado de productos
            window.location.href = "listado-pro.html";
        } else {
            alert("Ocurrió un error al crear el producto.");
        }
    } catch (error) {
        console.log("Error al guardar producto:", error);
    }
}

// Función para Eliminar un producto

async function eliminarProducto(id) {
    // Proceso 3: segunda barrera aunque el botón esté oculto,
    // por si alguien llama a la función desde la consola
    if (!esAdministrador()) {
        alert("No tienes permisos para eliminar productos.");
        return;
    }

    let confirmar = confirm("¿Deseas eliminar este producto?");
    if (!confirmar) return;

    try {
        let url = `http://localhost:3000/api/productos/${id}`;
        let usuario = obtenerUsuarioLogueado();
        let respuesta = await fetch(url, {
            method: "DELETE",
            headers: {
                // El backend también valida este header (ver productosController.js)
                "x-user-rol": usuario ? usuario.rol : ""
            }
        });

        if (respuesta.ok) {
            alert("Producto eliminado con éxito.");
            obtenerProductos(); // Recargar la lista
        } else if (respuesta.status === 403) {
            alert("No tienes permisos para eliminar productos.");
        } else {
            alert("No se pudo eliminar el producto.");
        }
    } catch (error) {
        console.log("Error al eliminar producto:", error);
    }
}
