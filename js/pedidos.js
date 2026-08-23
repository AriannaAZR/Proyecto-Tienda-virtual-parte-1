// Capturar elementos del HTML por ID

let tablaPedidos = document.getElementById("tabla-pedidos");
let formPedido = document.getElementById("formulario-pedido");
let selectCliente = document.getElementById("id_cliente");
let selectMetodo = document.getElementById("metodo_pago");
let selectProducto = document.getElementById("select-producto-pedido");
let inputCantidad = document.getElementById("cantidad-producto-pedido");
let btnAgregarProducto = document.getElementById("btn-agregar-producto-pedido");
let bodyCarrito = document.getElementById("body-carrito");
let inputDescuento = document.getElementById("descuento");
let inputAumento = document.getElementById("aumento");
let totalDisplay = document.getElementById("total-pedido");

// Arreglo almacena los productos agregados al pedido actual

let productosCarrito = [];
let listaProductosDisponibles = [];

document.addEventListener("DOMContentLoaded", () => {
    // Si estamos en el listado de pedidos
    if (tablaPedidos) {
        obtenerPedidos();
    }

    // Si estamos en la página de crear pedido
    if (formPedido) {
        cargarClientes();
        cargarProductosSelector();

        if (btnAgregarProducto) {
            btnAgregarProducto.addEventListener("click", () => {
                agregarProductoAlCarrito();
            });
        }

        if (inputDescuento) inputDescuento.addEventListener("input", actualizarTotal);
        if (inputAumento) inputAumento.addEventListener("input", actualizarTotal);

        formPedido.addEventListener("submit", (e) => {
            e.preventDefault();
            crearPedido();
        });
    }
});

// Obtener listado de pedidos

async function obtenerPedidos() {
    try {
        let url = "http://localhost:3000/api/pedidos";
        let respuesta = await fetch(url);
        let pedidos = await respuesta.json();

        tablaPedidos.innerHTML = "";

        pedidos.forEach((ped, i) => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${ped.cliente_nombre ? (ped.cliente_nombre + ' ' + (ped.cliente_apellido || '')) : ('Cliente #' + ped.id_cliente)}</td>
                <td>${ped.cliente_email || 'N/A'}</td>
                <td>${ped.fecha ? ped.fecha.substring(0, 10) : 'Hoy'}</td>
                <td>$${ped.total || 0}</td>
                <td><span class="badge badge-success">${ped.estado || 'Completado'}</span></td>
                <td>
                    <button class="btn btn-warning btn-sm">🖊️</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" onclick="eliminarPedido(${ped.id})">✖️</button>
                </td>
            `;
            tablaPedidos.appendChild(fila);
        });

    } catch (error) {
        console.log("Error al cargar pedidos:", error);
    }
}

// ----------------------------------------------------
// Cargar Clientes en el select
// ----------------------------------------------------
async function cargarClientes() {
    try {
        let url = "http://localhost:3000/api/clientes";
        let respuesta = await fetch(url);
        let clientes = await respuesta.json();

        selectCliente.innerHTML = '<option value="">Seleccionar Cliente</option>';
        clientes.forEach((cli) => {
            let opcion = document.createElement("option");
            opcion.value = cli.id;
            opcion.textContent = `${cli.nombre} ${cli.apellido}`;
            selectCliente.appendChild(opcion);
        });
    } catch (error) {
        console.log("Error al cargar selector de clientes:", error);
    }
}

// ----------------------------------------------------
// Cargar Productos en el select
// ----------------------------------------------------
async function cargarProductosSelector() {
    try {
        let url = "http://localhost:3000/api/productos";
        let respuesta = await fetch(url);
        listaProductosDisponibles = await respuesta.json();

        selectProducto.innerHTML = '<option value="">Seleccionar Producto</option>';
        listaProductosDisponibles.forEach((pro) => {
            let opcion = document.createElement("option");
            opcion.value = pro.id;
            opcion.textContent = `${pro.nombre} - $${pro.precio}`;
            selectProducto.appendChild(opcion);
        });
    } catch (error) {
        console.log("Error al cargar productos selector:", error);
    }
}

// ----------------------------------------------------
// Agregar Producto al Carrito local
// ----------------------------------------------------
function agregarProductoAlCarrito() {
    let idProd = selectProducto.value;
    let cant = parseInt(inputCantidad.value);

    if (!idProd) {
        alert("Selecciona un producto de la lista.");
        return;
    }
    if (!cant || cant <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    let productoEncontrado = listaProductosDisponibles.find(p => p.id == idProd);
    if (!productoEncontrado) return;

    // Verificar si ya existe en el carrito
    let existente = productosCarrito.find(p => p.id_producto == idProd);
    if (existente) {
        existente.cantidad += cant;
    } else {
        productosCarrito.push({
            id_producto: productoEncontrado.id,
            nombre: productoEncontrado.nombre,
            precio: parseFloat(productoEncontrado.precio),
            cantidad: cant
        });
    }

    renderizarCarrito();
}

// ----------------------------------------------------
// Renderizar Carrito y Calcular Total
// ----------------------------------------------------
function renderizarCarrito() {
    bodyCarrito.innerHTML = "";

    productosCarrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td>$${item.precio}</td>
            <td>${item.cantidad}</td>
            <td>$${subtotal}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="quitarDelCarrito(${index})">✖️</button>
            </td>
        `;
        bodyCarrito.appendChild(fila);
    });

    actualizarTotal();
}

function quitarDelCarrito(index) {
    productosCarrito.splice(index, 1);
    renderizarCarrito();
}

function actualizarTotal() {
    let sumaProductos = productosCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    let desc = parseFloat(inputDescuento.value) || 0;
    let aum = parseFloat(inputAumento.value) || 0;

    let total = sumaProductos - desc + aum;
    if (total < 0) total = 0;

    totalDisplay.textContent = "$" + total;
}

// Crear el Pedido 

async function crearPedido() {
    if (!selectCliente.value || selectCliente.value === "Seleccionar Cliente") {
        alert("Por favor selecciona un cliente.");
        return;
    }
    if (!selectMetodo.value || selectMetodo.value === "Seleccionar Método de Pago") {
        alert("Por favor selecciona un método de pago.");
        return;
    }
    if (productosCarrito.length === 0) {
        alert("Debes agregar al menos un producto al pedido.");
        return;
    }

    let nuevoPedido = {
        id_cliente: parseInt(selectCliente.value),
        metodo_pago: selectMetodo.value,
        descuento: parseFloat(inputDescuento.value) || 0,
        aumento: parseFloat(inputAumento.value) || 0,
        productos: productosCarrito
    };

    try {
        let url = "http://localhost:3000/api/pedidos";
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoPedido)
        });

        if (respuesta.ok || respuesta.status === 201) {
            alert("¡Pedido creado con éxito!");
            window.location.href = "listado-pedidos.html";
        } else {
            alert("Error al crear el pedido.");
        }
    } catch (error) {
        console.log("Error al crear pedido:", error);
    }
}

// Eliminar Pedido

async function eliminarPedido(id) {
    let confirmar = confirm("¿Deseas eliminar este pedido?");
    if (!confirmar) return;

    try {
        let url = `http://localhost:3000/api/pedidos/${id}`;
        let respuesta = await fetch(url, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Pedido eliminado con éxito.");
            obtenerPedidos(); // Recargar la tabla
        } else {
            alert("No se pudo eliminar el pedido.");
        }
    } catch (error) {
        console.log("Error al eliminar pedido:", error);
    }
}
