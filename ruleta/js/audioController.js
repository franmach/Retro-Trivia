// Configuración de sonidos de hover y clic
const hoverSound = new Audio('../audio/hover.mp3');
const clickSoundPath = '../audio/menu.mp3';

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
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    applySoundEvents();
});