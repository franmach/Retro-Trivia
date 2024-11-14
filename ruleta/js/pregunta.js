document.addEventListener('DOMContentLoaded', async function () {
    const categoriaElement = document.getElementById('categoria');
    const preguntaTextoElement = document.getElementById('preguntaTexto');
    const opcionesContainer = document.getElementById('opciones');
    const typingSound = document.getElementById('typingSound');
    const preguntaContainer = document.querySelector('.pregunta');//para cambiarle el fondo
    const colorPregunta = document.querySelector('.dialog-text p');
    const colorOpciones = document.querySelectorAll('#opciones button');
    const typingSpeed = 50;
    let index = 0;
    let preguntaSoloTexto = "";

    // Mapear las categorías a sus imágenes de fondo
    const backgroundImages = {
        Geografia: '../images/fondoGeo.png',
        Arte: '../images/fondoA.png',
        Ciencia: '../images/fondoCie.png',
        Deportes: '../images/fondoD.png',
        Entretenimiento: '../images/fondoE.png',
        Corona: '../images/fondo.png'
    };

    // Colores específicos para botones preguntas y opciones según la categoría
    const categoriaColores = {
        Entretenimiento: '#cf321f',
        Arte: '#fff',
        Geografia: '#2e77b8',
        Deportes: '#ff5c01',
        Ciencia: 'black',
        Corona: '#d4af37'
    };

    try {
        // Obtener la categoría seleccionada del localStorage
        const categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');

        if (!categoriaSeleccionada) {
            console.error("Error: No se encontró ninguna categoría seleccionada en el localStorage.");
            categoriaElement.textContent = "Error: No se seleccionó ninguna categoría.";
            return;
        }

        categoriaElement.textContent = `Categoría: ${categoriaSeleccionada}`;



        // Cambiar el fondo del contenedor según la categoría seleccionada
        if (backgroundImages[categoriaSeleccionada]) {
            preguntaContainer.style.backgroundImage = `url('${backgroundImages[categoriaSeleccionada]}')`;
        } else {
            preguntaContainer.style.backgroundImage = ''; // Fondo por defecto si la categoría no está en el objeto
        }

        if (categoriaColores[categoriaSeleccionada]) {
            switch (categoriaSeleccionada) {
                case 'Ciencia':
                    colorPregunta.style.color = 'white';
                     break;
                case 'Entretenimiento':
                    colorPregunta.style.color = '#cf321f';
                    break;
                case 'Corona':
                    colorPregunta.style.color = 'black';
                    break;
              

            }
            // Aplicar color de fondo a cada botón en #opciones
            colorOpciones.forEach(button => {
                button.style.backgroundColor = categoriaColores[categoriaSeleccionada];
            });
        }

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
        var msg = "Hubo un error al cargar la pregunta.";
        preguntaTextoElement.textContent = startTextAnimation(msg);
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
        }
    }

});
