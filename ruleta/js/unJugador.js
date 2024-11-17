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
    (selectedCategory) => {
        localStorage.setItem('categoriaSeleccionada', selectedCategory.name);
        setTimeout(() => {
            window.location.href = 'pregunta.html';
        }, 2000);
    },
    'spinSound' // ID del audio
);

    
    document.getElementById('spinBtn').addEventListener('click', () => {
        ruleta.spin();
    });
   

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



