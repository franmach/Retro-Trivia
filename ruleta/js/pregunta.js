document.addEventListener('DOMContentLoaded', async function () {
    const categoriaElement = document.getElementById('categoria');
    const iconoCategoria = document.getElementById('iconoCategoria');
    const preguntaTextoElement = document.getElementById('preguntaTexto');
    const opcionesContainer = document.getElementById('opciones');
    const typingSound = document.getElementById('typingSound');
    const preguntaContainer = document.querySelector('.pregunta');
    const colorPregunta = document.querySelector('.dialog-text p');
    const colorOpciones = document.querySelectorAll('#opciones button');
    const colorFooter = document.querySelectorAll('.textoFooter');
    const typingSpeed = 50;
    let index = 0;
    let preguntaSoloTexto = "";

    // Configuración de estilos para categorías
    const categoryConfig = {
        Geografia: {
            textColor: '#fff',
            buttonBackground: '#2e77b8',
            footerColor: '#2e77b8',
            backgroundImage: '../images/fondoGeo.png',
            icon: '../images/earth.png'
        },
        Arte: {
            textColor: '#fff',
            buttonBackground: '#051baf',
            footerColor: '#fff',
            backgroundImage: '../images/fondoA.png',
            icon: '../images/arte.png'
        },
        Ciencia: {
            textColor: 'white',
            buttonBackground: 'black',
            footerColor: 'white',
            backgroundImage: '../images/fondoCie.png',
            icon: '../images/ciencia.png'
        },
        Deportes: {
            textColor: '#fff',
            buttonBackground: '#ff5c01',
            footerColor: '#ff5c01',
            backgroundImage: '../images/fondoD.png',
            icon: '../images/deporte.png'
        },
        Entretenimiento: {
            textColor: '#cf321f',
            buttonBackground: '#cf321f',
            footerColor: '#fff',
            backgroundImage: '../images/fondoE.png',
            icon: '../images/pop.png'
        },
        Corona: {
            textColor: '#d4af37',
            buttonBackground: '#d4af37',
            footerColor: '#d4af37',
            backgroundImage: '../images/fondo.png',
            icon: '../images/crown.png'
        }
    };

    // Función para aplicar estilos según la categoría
    function applyCategoryStyles(category) {
        const config = categoryConfig[category];

        if (!config) {
            console.warn(`No se encontró configuración para la categoría: ${category}`);
            return;
        }

        // Cambiar el fondo de la pregunta
        preguntaContainer.style.backgroundImage = `url('${config.backgroundImage}')`;

        // Cambiar el icono de la categoría
        iconoCategoria.src = config.icon;

        // Cambiar el color del texto de la pregunta
        colorPregunta.style.color = config.textColor;

        // Cambiar el color de fondo de los botones de opciones
        colorOpciones.forEach(button => {
            button.style.backgroundColor = config.buttonBackground;
        });

        // Cambiar el color del footer
        colorFooter.forEach(element => {
            element.style.color = config.footerColor;
        });    }

    try {
        // Obtener la categoría seleccionada del localStorage
        const categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');

        if (!categoriaSeleccionada) {
            console.error("Error: No se encontró ninguna categoría seleccionada en el localStorage.");
            categoriaElement.textContent = "Error: No se seleccionó ninguna categoría.";
            return;
        }

        categoriaElement.textContent = `${categoriaSeleccionada}`;
        applyCategoryStyles(categoriaSeleccionada);

        // Realizar la solicitud al backend
        const response = await fetch(`https://localhost:8080/api/pregunta?categoria=${encodeURIComponent(categoriaSeleccionada)}`);

        if (!response.ok) {
            throw new Error(`Error en la solicitud al backend: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Datos recibidos del backend:", data);

        // Preparar el texto de la pregunta para animación
        const enunciadoCompleto = data.enunciado || "No se pudo obtener la pregunta.";
        preguntaSoloTexto = enunciadoCompleto.split('?')[0] + '?';

        // Iniciar animación de la pregunta en el diálogo
        startTextAnimation(preguntaSoloTexto);

        // Mostrar las opciones de respuesta
        data.opcionesDeRespuesta.forEach((opcion, index) => {
            const opcionElement = document.getElementById(`opcion${index + 1}`);
            if (opcionElement) {
                opcionElement.textContent = opcion;
            }
        });

    } catch (error) {
        console.error('Error al obtener la pregunta:', error);
        const msg = "Hubo un error al cargar la pregunta.";
        preguntaTextoElement.textContent = msg;
    }

    // Función para iniciar la animación de texto
    function startTextAnimation(text) {
        index = 0;
        preguntaTextoElement.innerHTML = ""; // Limpiar el texto antes de iniciar
        typingSound.play();
        typeDialog(text);
    }

    // Animación de escritura para el diálogo
    function typeDialog(text) {
        if (index < text.length) {
            preguntaTextoElement.innerHTML += text[index];
            index++;
            setTimeout(() => typeDialog(text), typingSpeed);
        } else {
            typingSound.pause();
            startTimer(30, () => {
                showAlert("¡Se acabó el tiempo!");

            });
    
        }
    }
    // Función para manejar el temporizador
    function startTimer(duration, onTimerEnd) {
        const timerElement = document.getElementById('timer');
        let timeRemaining = duration;

        // Actualiza el texto inicial
        timerElement.textContent = timeRemaining;

        const intervalId = setInterval(() => {
            timeRemaining--;

            if (timeRemaining <= 0) {
                clearInterval(intervalId); // Detiene el temporizador
                timerElement.textContent = "0";
                if (typeof onTimerEnd === 'function') {
                    onTimerEnd();
                }
            } else {
                timerElement.textContent = timeRemaining;
            }
        }, 1000);
    }

    function showAlert(message) {
        const alertDialog = document.getElementById('alertDialog');
        document.getElementById('alertMessage').textContent = message; // Establece el mensaje
        alertDialog.showModal(); // Muestra el diálogo

    }
});
