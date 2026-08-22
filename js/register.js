// Variables globales del formulario de registro
const d = document;
userInput = d.querySelector("#usuarioForm");
rolInput = d.querySelector("#rolForm");
passInput = d.querySelector("#contraForm");
repeatPassInput = d.querySelector("#repeatContraForm");
btnRegister = d.querySelector(".btnRegister");

// Evento al botón del formulario
btnRegister.addEventListener("click", () => {
    let dataForm = getData();
    if (dataForm) {
        sendData(dataForm);
    }
});

// Función para validar el formulario y obtener los datos
let getData = () => {
    let user;

    if (userInput.value && rolInput.value && passInput.value && repeatPassInput.value) {
        if (passInput.value !== repeatPassInput.value) {
            alert("Las contraseñas no coinciden");
            return null;
        }

        user = {
            usuario: userInput.value,
            rol: rolInput.value,
            contrasena: passInput.value
        };

        // Limpiar campos
        userInput.value = "";
        rolInput.value = "";
        passInput.value = "";
        repeatPassInput.value = "";
    } else {
        alert("Todos los campos (usuario, rol, contraseña y confirmación) son obligatorios");
        return null;
    }

    console.log(user);
    return user;
};

// Función para recibir los datos y realizar la petición al servidor (POST /api/usuarios)
let sendData = async (data) => {
    let url = "http://localhost:3000/api/usuarios";
    try {
        let respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        let result = await respuesta.json();
        console.log(result);

        if (respuesta.status === 201) {
            alert("¡Usuario registrado con éxito! Redirigiendo al login...");
            window.location.href = "login.html";
        } else {
            alert("Error en el registro: " + (result.message || "Inténtalo de nuevo."));
        }
    } catch (error) {
        console.log(error);
        alert("Ocurrió un error al intentar conectar con el servidor.");
    }
};
