import Ruleta from './ruleta.js';

const categories = [
    { name: 'Arte', imageSrc: '../images/arte.png', backgroundSrc: '../images/fondoA.png' },
    { name: 'Geografia', imageSrc: '../images/earth.png', backgroundSrc: '../images/fondoGeo.png' },
    { name: 'Ciencia', imageSrc: '../images/ciencia.png', backgroundSrc: '../images/fondoCie.png' },
    { name: 'Musica', imageSrc: '../images/musica.png', backgroundSrc: '../images/fond.png' },
    { name: 'Entretenimiento', imageSrc: '../images/pop.png', backgroundSrc: '../images/fondoE.png' },
    { name: 'Deportes', imageSrc: '../images/deporte.png', backgroundSrc: '../images/fondoD.png' },
];

const ruleta = new Ruleta(
    'wheelCanvas',
    'spinBtn',
    'backBtn',
    'resultEl',
    categories,
    async (selectedCategory) => {
        try {
            // Realizar la solicitud GET al backend para generar una nueva pregunta
            localStorage.setItem('categoriaSeleccionada', selectedCategory.name);
            const response = await fetch(`https://localhost:8080/api/generarPregunta?categoria=${encodeURIComponent(selectedCategory.name)}`);
            if (!response.ok) {
                throw new Error('Error al generar la pregunta');
            }

            // Guardar la pregunta recibida en localStorage para usarla en la siguiente página
            const pregunta = await response.json();
            localStorage.setItem('preguntaActual', JSON.stringify(pregunta));

            // Redirigir a la página de pregunta después de recibir la pregunta del backend
            setTimeout(() => {
                window.location.href = 'pregunta.html';
            }, 2000);
        } catch (error) {
            console.error('Error al generar la pregunta:', error);
            showAlert('Hubo un error al generar la pregunta. Por favor, inténtalo nuevamente.');
        }
    },
    'spinSound' // ID del audio
);

// Evento para iniciar el giro de la ruleta
document.getElementById('spinBtn').addEventListener('click', () => {
    ruleta.spin();
});

// Configuración de efectos de hover para el host
document.addEventListener('DOMContentLoaded', () => {

    actualizarInformacionPartida();

    const imagenHost = document.getElementById('spkHost');
    const hoverButton = document.getElementById('spinBtn');
    const imagenOriginal = '../images/spkGame.gif';
    const imagenHover = '../images/presiona.gif';

    // Cambia la imagen al hacer `hover`
    hoverButton.addEventListener('mouseover', () => {
        imagenHost.src = imagenHover;
    });

    // Restaura la imagen original al quitar el cursor del botón
    hoverButton.addEventListener('mouseout', () => {
        imagenHost.src = imagenOriginal;
    });


    
});

// Leer la información de la partida desde `localStorage`
function actualizarInformacionPartida() {
    const partidaInfo = JSON.parse(localStorage.getItem('partidaInfo'));

    if (!partidaInfo) {
        console.warn("No se encontró información de la partida.");
        return;
    }

    console.log("Información de la partida cargada en unJugador:", partidaInfo); // LOG para verificar los datos

    const nombreUElement = document.getElementById('nombreU');
    const dificultadElement = document.getElementById('dificultad');
    const tiempoElement = document.getElementById('tiempo');
    const puntajeElement = document.getElementById('puntaje');

    if (nombreUElement) nombreUElement.textContent = partidaInfo.jugador || "Desconocido";
    if (dificultadElement) dificultadElement.textContent = partidaInfo.dificultad || "No asignada";
    if (tiempoElement) tiempoElement.textContent = `${partidaInfo.tiempoPorPregunta || 0} segundos`;
    if (puntajeElement) puntajeElement.textContent = partidaInfo.puntajeAcumulado || 0;
}


