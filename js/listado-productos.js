//Variables globales
let listadoPro = document.getElementById("listado-producto");

document.addEventListener("DOMContentLoaded",()=> {
    //alert("Hola");
    getProducts();
});

//funcion para obtener los datos de la base de datos
async function getProducts (){
    try {
        let url = "http://localhost:3000/api/productos";
        let data= await fetch(url, {
            method: "GET",
            headers: {
                "content-type": "json/application"
            }
        })
        let products = await data.json();
        console.log("Productos: ", products);
        //Mostrar los datos al usuario
        products.forEach((pro, i)=> {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${pro.nombre}</td>
                <td>${pro.descripcion}</td>
                <td>${pro.precio}</td>
                <td>${pro.stock}</td>
                <td>
                <img src="${pro.imagen}" width="180px">
                </td>
                <td>
                <button class="btn btn-warning">🖊️</button>
                <button class="btn btn-danger">✖️</button>

                </td>
            `;
            listadoPro.appendChild(fila);
        });


    } catch (error) {
        console.log("Error");
    }

}