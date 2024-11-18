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
    const partidaInfoContainer = document.getElementById('partidaInfo');
    const partidaInfo = JSON.parse(localStorage.getItem('partidaInfo'));

    let tiempoInicial = 0; // Variable para almacenar el tiempo inicial del contador
    let intervalId; // Variable para almacenar el ID del intervalo del temporizador

    if (!localStorage.getItem('partidaInfo')) {
        localStorage.setItem('partidaInfo', JSON.stringify({
            jugador: "Jugador1",
            dificultad: "Fácil",
            tiempoPorPregunta: 30,
            puntajeAcumulado: 0
        }));
    }


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
        });
    }

    try {
        // Obtener la pregunta actual del localStorage
        const preguntaActual = JSON.parse(localStorage.getItem('preguntaActual'));
        console.log("Pregunta actual cargada desde localStorage:", preguntaActual);

        actualizarInformacionPartida();

        if (!preguntaActual || !preguntaActual.enunciado || !preguntaActual.opcionesDeRespuesta) {
            alert('No se encontró una pregunta válida. Por favor, regresa a la ruleta.');
            window.location.href = 'unJugador.html';
            return;
        }

        console.log("Datos recibidos del backend:", preguntaActual);

        // Mostrar la pregunta y las opciones
        categoriaElement.textContent = `Categoría: ${preguntaActual.categoria}`;
        applyCategoryStyles(preguntaActual.categoria);

        preguntaCompleta = preguntaActual.enunciado;
        preguntaSoloTexto = preguntaCompleta.split('?')[0] + '?';
        startTextAnimation(preguntaSoloTexto);
        
        // Agregar evento a las opciones
        preguntaActual.opcionesDeRespuesta.forEach((opcion, index) => {
            const opcionElement = document.getElementById(`opcion${index + 1}`);
            if (opcionElement) {
                opcionElement.textContent = opcion;
                opcionElement.addEventListener('click', () => {

                    detenerContador();

                    const letraOpcionElegida = String.fromCharCode(65 + index);
                    const respuesta = {
                        preguntaAsociada: {
                            enunciado: preguntaActual.enunciado,
                            respuestaCorrecta: preguntaActual.respuestaCorrecta,
                        },
                        opcionElegida: letraOpcionElegida,
                        tiempoTranscurrido: obtenerTiempoTranscurrido(),
                        jugador: { nombre: partidaInfo.jugador },
                    };
                    validarRespuesta(respuesta);
                });
            }
        });


        async function validarRespuesta(respuesta) {
            try {
                const response = await fetch('https://localhost:8080/api/registrarRespuesta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(respuesta),
                });
        
                const mensaje = await response.text();
                console.log("Mensaje del servidor:", mensaje);
        
                if (mensaje.startsWith("Respuesta correcta")) {
                    // Extraer el puntaje obtenido
                    const puntajeObtenido = manejarPuntaje(mensaje);
        
                    // Actualizar y guardar en localStorage
                    partidaInfo.puntajeAcumulado += puntajeObtenido;
                    localStorage.setItem('partidaInfo', JSON.stringify(partidaInfo));
                    actualizarInformacionPartida();
        
                    // Mostrar alerta y redirigir
                    showAlert(`¡Respuesta correcta! +${puntajeObtenido} puntos`, () => {
                        setTimeout(() => {
                            window.location.href = 'unJugador.html';
                        }, 500);
                    });
                } else if (mensaje.startsWith("Respuesta incorrecta")) {
                    // Eliminar información de la partida y redirigir
                    showAlert("Respuesta incorrecta. Fin de la partida.", () => {
                        localStorage.removeItem('partidaInfo');
                        setTimeout(() => {
                            window.location.href = 'start.html';
                        }, 500);
                    });
                } else {
                    // Caso de mensaje inesperado
                    showAlert("Hubo un error inesperado. Por favor, intenta nuevamente.");
                }
            } catch (error) {
                console.error("Error al registrar la respuesta:", error);
                showAlert("Hubo un error al registrar la respuesta. Por favor, inténtalo nuevamente.");
            }
        }
        
        function manejarPuntaje(message) {
            const puntajeObtenido = parseInt(message.split(":")[1]?.trim()) || 0;
            console.log("Puntaje obtenido:", puntajeObtenido);
            return puntajeObtenido;
        }
        
        function actualizarInformacionPartida() {
            const partidaInfo = JSON.parse(localStorage.getItem('partidaInfo'));
        
            if (!partidaInfo) {
                console.warn("No se encontró información de la partida.");
                return;
            }


        
            const nombreUElement = document.getElementById('nombreU');
            const dificultadElement = document.getElementById('dificultad');
            const tiempoElement = document.getElementById('tiempo');
            const puntajeElement = document.getElementById('puntaje');
        
            if (nombreUElement) nombreUElement.textContent = partidaInfo.jugador || "Desconocido";
            if (dificultadElement) dificultadElement.textContent = partidaInfo.dificultad || "No asignada";
            if (tiempoElement) tiempoElement.textContent = `${partidaInfo.tiempoPorPregunta || 0} segundos`;
            if (puntajeElement) puntajeElement.textContent = partidaInfo.puntajeAcumulado || 0;

            console.log("Información de la partida cargada en pregunta.JS:", partidaInfo);
        }
        

        
    } catch (error) {
        console.error('Error al registrar la respuesta:', error);
        showAlert('Hubo un error al registrar la respuesta. Por favor, inténtalo nuevamente.');
    }





    function startTextAnimation(text) {
        index = 0;
        preguntaTextoElement.innerHTML = "";
        typingSound.play();
        typeDialog(text);
    }



    function typeDialog(text) {
        if (index < text.length) {
            preguntaTextoElement.innerHTML += text[index];
            index++;
            setTimeout(() => typeDialog(text), typingSpeed);
        } else {
            typingSound.pause();
            startTimer(partidaInfo.tiempoPorPregunta, () => {

                showAlert('Se acabó el tiempo!', () => {
                    window.location.href = 'start.html';
                });

            });
        }
    }

    function startTimer(duration, onTimerEnd) {
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.warn("No se encontró el elemento del temporizador (timer). Verifica que el elemento esté presente en el HTML.");
        return;
    }

    // Inicializar tiempo inicial
    tiempoInicial = duration;

    let timeRemaining = duration;
    timerElement.textContent = timeRemaining;

    intervalId = setInterval(() => {
        timeRemaining--;

        if (timeRemaining <= 0) {
            detenerContador();
            timerElement.textContent = "0";
            if (typeof onTimerEnd === 'function') {
                onTimerEnd();
            }
        } else {
            timerElement.textContent = timeRemaining;
        }
    }, 1000);
}

function detenerContador() {
    if (intervalId) {
        clearInterval(intervalId);
        console.log("Contador detenido.");
    } else {
        console.warn("No se pudo detener el contador porque no se encontró un intervalo activo.");
    }
}

function obtenerTiempoTranscurrido() {
    // Obtener el valor actual del temporizador desde el elemento HTML
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.warn("No se encontró el elemento del temporizador (timer). Verifica que el elemento esté presente en el HTML.");
        return 0;
    }

    const tiempoRestante = parseInt(timerElement.textContent, 10);
    if (isNaN(tiempoRestante)) {
        console.warn("No se pudo obtener el tiempo restante del temporizador.");
        return 0;
    }

    // Verificar si tiempoInicial está definido correctamente
    if (typeof tiempoInicial === 'undefined' || tiempoInicial === 0) {
        console.warn("El tiempo inicial no se ha definido correctamente.");
        return 0;
    }

    // Calcular el tiempo transcurrido
    return tiempoInicial - tiempoRestante;
}

    function showAlert(message, callback) {
        const closeButton = document.getElementById('btnAlerta');
        const alertDialog = document.getElementById('alertDialog');

        if (!alertDialog) {
            console.warn("No se encontró el elemento de alerta (alertDialog). Verifica que el elemento esté presente en el HTML.");
            return;
        }

        // Establece el mensaje
        document.getElementById('alertMessage').textContent = message;

        // Muestra el cuadro de diálogo
        alertDialog.showModal();

        // Agrega un evento para cerrar el cuadro de diálogo solo con el botón
        closeButton.addEventListener('click', () => {
            alertDialog.close();
            if (typeof callback === 'function') {
                callback(); // Ejecuta la función adicional si se pasa
            }
        }, { once: true });
    }

});
