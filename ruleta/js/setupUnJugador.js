document.getElementById("startGameBtn").addEventListener("click", () => {

    function showAlert(message) {
        const alertDialog = document.getElementById('alertDialog');
        document.getElementById('alertMessage').textContent = message; // Establece el mensaje
        alertDialog.showModal(); // Muestra el diálogo
    }

    // Obtener la dificultad seleccionada
    const dificultad = document.querySelector('input[name="dificultad"]:checked');
    const selectTiempo = document.getElementById("selectTiempo");

    // Verificar si las opciones están seleccionadas
    if (!dificultad) {
        showAlert("Por favor, selecciona una dificultad.");
        return;
    }
    if (selectTiempo.value === "") {
        showAlert("Por favor, selecciona el tiempo por ronda.");
        return;
    }

    // Guardar configuraciones en localStorage
    localStorage.setItem("dificultad", dificultad.value);
    localStorage.setItem("timer", selectTiempo.options[selectTiempo.selectedIndex].text);

    // Redirigir a la página de la ruleta
    window.location.href = "unJugador.html"; // Asegúrate de que esta ruta sea correcta
});
