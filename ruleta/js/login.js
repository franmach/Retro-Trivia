function showAlert(message) {
    const alertDialog = document.getElementById('alertDialog');
    document.getElementById('alertMessage').textContent = message; // Establece el mensaje
    alertDialog.showModal(); // Muestra el diálogo
}


function validateLogin() {
    const email = document.getElementById('txtLoginEmail').value;
    const password = document.getElementById('txtLoginContrasena').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showAlert('Por favor ingresa un email válido.');
        return false;
    }

    if (password.length < 8) {
        showAlert('La contraseña debe tener al menos 8 caracteres.');
        return false;
    }

    return true;
}

function validateRegister() {
    const name = document.getElementById('txtRegisterNombre').value;
    const email = document.getElementById('txtRegisterEmail').value;
    const password = document.getElementById('txtRegisterContrasena').value;

    // Expresión regular para validar el email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name.trim() === '') {
        showAlert('Por favor ingresa tu nombre completo.');
        return false;
    }

    if (!emailRegex.test(email)) {
        showAlert('Por favor ingresa un email válido.');
        return false;
    }

    if (password.length < 8) {
        showAlert('La contraseña debe tener al menos 8 caracteres.');
        return false;
    }

    return true;
}



// Definimos las funciones cambiarTexto y restaurarTexto directamente en el HTML
function cambiarTexto() {
    document.getElementById("registrarse").innerText = "Registrarse";
    const hoverSound = document.getElementById("hoverSound");
    hoverSound.currentTime = 0;
    hoverSound.play(); // Sonido al hover  
}

function restaurarTexto() {

    document.getElementById("registrarse").innerText = "¿Aun no estás registrado?";
}

function aRegistro() {
    window.location.href = 'registro.html'; // Redirige a la página de pregunta después de mostrar la categoría
    const menuSound = document.getElementById('menuSound');
    if (menuSound) menuSound.play(); // Sonido al cambiar de pantalla  
}
function aLogin() {
    window.location.href = 'login.html'; // Redirige a la página de pregunta después de mostrar la categoría

    const menuSound = document.getElementById('menuSound');
    if (menuSound) menuSound.play(); // Sonido al cambiar de pantalla  
}

document.getElementById('btnLogin').addEventListener('click', function (event) {
    // Comprueba si la función de validación devuelve falso  
    if (!validateLogin()) {
        event.preventDefault(); // Previene el envío del formulario si hay errores  
    } else {
        // Si la validación es correcta, redirige a index.html  
        window.location.href = 'start.html';
    }


});

document.getElementById('btnRegistrarse').addEventListener('click', function (event) {
    if (!validateRegister()) {
        event.preventDefault(); // Previene la acción si hay errores  
    } else {
        // Si la validación es correcta, procede con el registro
        window.location.href = 'start.html';
    }
});
