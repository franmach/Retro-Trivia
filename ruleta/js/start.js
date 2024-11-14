document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('pressStartText');
    
    startButton.addEventListener('click', () => {
        // Iniciar la música solo si no está en reproducción
        if (!window.backgroundMusic) {
            window.backgroundMusic = new Audio('../audio/music.mp3');
            window.backgroundMusic.loop = true;
            window.backgroundMusic.volume = 0.5;
            window.backgroundMusic.play();
            localStorage.setItem('isBackgroundMusicPlaying', 'true');
        } else if (localStorage.getItem('isBackgroundMusicPlaying') === 'true') {
            window.backgroundMusic.play();
        }

        // Redirigir de inmediato
        window.location.href = 'seleccionJugadores.html';
    });
});
