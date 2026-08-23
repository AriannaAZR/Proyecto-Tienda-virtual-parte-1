// Capturar elementos del HTML por ID

let listadoPro = document.getElementById("listado-producto");
let selectNombre = document.getElementById("productos-select");
let inputPrecio = document.getElementById("precio-pro");
let inputStock = document.getElementById("stock-pro");
let inputDescripcion = document.getElementById("descripcion-pro");
let imgPro = document.getElementById("imagen-pro");
let btnCrear = document.getElementById("btn-crear-producto");


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
});

// Función para Obtener todos los productos (GET)

async function obtenerProductos() {
    try {
        let url = "http://localhost:3000/api/productos";
        let respuesta = await fetch(url);
        let productos = await respuesta.json();

        // Limpiar la tabla 
        listadoPro.innerHTML = "";

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
                    <button class="btn btn-danger btn-sm btn-eliminar" onclick="eliminarProducto(${pro.id})">✖️</button>
                </td>
            `;
            listadoPro.appendChild(fila);
        });

    } catch (error) {
        console.log("Error al cargar productos:", error);
    }
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
    let confirmar = confirm("¿Deseas eliminar este producto?");
    if (!confirmar) return;

    try {
        let url = `http://localhost:3000/api/productos/${id}`;
        let respuesta = await fetch(url, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Producto eliminado con éxito.");
            obtenerProductos(); // Recargar la lista
        } else {
            alert("No se pudo eliminar el producto.");
        }
    } catch (error) {
        console.log("Error al eliminar producto:", error);
    }
}
