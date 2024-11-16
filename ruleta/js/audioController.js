// Configuración de sonidos de hover y clic
const hoverSound = new Audio('../audio/hover.mp3');
const clickSoundPath = '../audio/menu.mp3';
const backgroundMusic = new Audio('../audio/backgroundMusic.mp3')

// Función para aplicar eventos de sonido a los botones
function applySoundEvents() {
    document.querySelectorAll('.menuBtn').forEach(btn => {
        // Sonido de hover
        btn.addEventListener('mouseover', () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });

        btn.addEventListener('mouseout', () => {
            hoverSound.pause();
        });

        // Reproducir sonido de clic sin retraso en la redirección
        btn.addEventListener('click', (event) => {
            const clickSound = new Audio(clickSoundPath);
            clickSound.play();
        });
    });
     // Evento para el botón de giro de la ruleta
     const spinButton = document.getElementById('spinBtn');
     if (spinButton) {
         spinButton.addEventListener('click', () => {
             spinSound.currentTime = 0; // Reinicia el sonido
             spinSound.play(); // Reproduce el sonido de giro
         });
     }

     const startButton = document.getElementById('pressStartText');
     if (startButton) {
         startButton.addEventListener('click', () => {
             backgroundMusic.play();
             console.log('musiquita')
         });
     }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    applySoundEvents();
});

