document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('pressStartText');

    startButton.addEventListener('click', () => {
        iniciarNuevaPartida();
        window.location.href = 'seleccionJugadores.html';
    });
});

function iniciarNuevaPartida() {
    localStorage.setItem('partidaInfo', JSON.stringify({
        jugador: "Jugador1",
        dificultad: "Fácil",
        tiempoPorPregunta: 30,
        puntajeAcumulado: 0,
        racha: 0 
    }));
    

    localStorage.removeItem('preguntaActual'); // Elimina cualquier pregunta previa
    localStorage.removeItem('preguntaGuardada'); // Limpia la pregunta guardada
    localStorage.removeItem('puntajeAcumulado');


    console.log("Nueva partida iniciada. Datos reiniciados.");
}
