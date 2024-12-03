
function validateRegister() {
    const name = document.getElementById('txtRegisterNombre').value;
    const email = document.getElementById('txtRegisterEmail').value;
    const password = document.getElementById('txtRegisterContrasena').value;

    // Expresión regular para validar el email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name.trim() === '') {
        showAlert('Por favor ingresa tu nombre de usuario.');
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

function showAlert(message) {
    const alertDialog = document.getElementById('alertDialog');
    document.getElementById('alertMessage').textContent = message; // Establece el mensaje
    alertDialog.showModal(); // Muestra el diálogo
}


function aLogin() {
    window.location.href = 'login.html';

    const menuSound = document.getElementById('menuSound');
    if (menuSound) menuSound.play(); // Sonido al cambiar de pantalla  
}

document.getElementById('btnRegistrarse').addEventListener('click', function (event) {
    if (!validateRegister()) {
        event.preventDefault(); // Previene la acción si hay errores  
    } else {
        // Si la validación es correcta, procede con el registro
        window.location.href = 'login.html';
    }
});
