document.getElementById("startGameBtn").addEventListener("click", async () => {

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

    // Crear el objeto de configuración
    const usuario = JSON.parse(localStorage.getItem('userInfo'));
    const configuracion = {
        jugador: usuario?.nombre || "Desconocido", // Valor por defecto si no hay usuario
        dificultad: dificultad.value,
        tiempoPorPregunta: parseInt(selectTiempo.value),
        puntajeAcumulado: 0,
    
    };


    try {
        // Realizar la solicitud POST al backend para iniciar la partida
        const response = await fetch('https://localhost:8080/api/iniciarPartida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configuracion)
        });

        if (!response.ok) {
            throw new Error('Error al iniciar la partida');
        }

        //guarda el objeto configuracion en el localStorage
        localStorage.setItem('partidaInfo', JSON.stringify(configuracion));
        // Redirigir a la pantalla de la ruleta si la partida se inició correctamente
        window.location.href = "unJugador.html";
    } catch (error) {
        console.error('Error al iniciar la partida:', error);
        showAlert("Hubo un error al iniciar la partida. Por favor, inténtalo nuevamente.");
    }
});
