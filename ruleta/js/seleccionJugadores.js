document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('onePlayerBtn').addEventListener('click', () => {
        window.location.href = 'setupUnJugador.html';
    });

    document.getElementById('twoPlayersBtn').addEventListener('click', () => {
        window.location.href = 'dosJugadores.html';
    });
});
