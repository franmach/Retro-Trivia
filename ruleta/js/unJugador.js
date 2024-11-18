import Ruleta from './ruleta.js';

const categories = [
    { name: 'Arte', imageSrc: '../images/arte.png', backgroundSrc: '../images/fondoA.png' },
    { name: 'Geografia', imageSrc: '../images/earth.png', backgroundSrc: '../images/fondoGeo.png' },
    { name: 'Ciencia', imageSrc: '../images/ciencia.png', backgroundSrc: '../images/fondoCie.png' },
    { name: 'Corona', imageSrc: '../images/crown.png', backgroundSrc: '../images/fond.png' },
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
            alert('Hubo un error al generar la pregunta. Por favor, inténtalo nuevamente.');
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



