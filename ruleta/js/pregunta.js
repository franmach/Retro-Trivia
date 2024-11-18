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

        // Mostrar las opciones de respuesta
        preguntaActual.opcionesDeRespuesta.forEach((opcion, index) => {
            const opcionElement = document.getElementById(`opcion${index + 1}`);
            if (opcionElement) {
                opcionElement.textContent = opcion;
                opcionElement.addEventListener('click', async () => {
                    try {
                        // Determinar la letra correspondiente a la opción elegida
                        const letraOpcionElegida = String.fromCharCode(65 + index); // A, B, C, D según el índice

                        // Crear el objeto Respuesta
                        const respuesta = {
                            preguntaAsociada: {
                                enunciado: preguntaActual.enunciado,
                                respuestaCorrecta: preguntaActual.respuestaCorrecta
                            },
                            opcionElegida: letraOpcionElegida,
                            tiempoTranscurrido: obtenerTiempoTranscurrido(), // Obtener el tiempo transcurrido de alguna manera
                            jugador: { nombre: "Jugador1" } // Datos básicos del jugador
                        };

                        console.log("Datos de la respuesta a enviar:", respuesta);

                        // Realizar la solicitud POST al backend para registrar la respuesta
                        const response = await fetch('https://localhost:8080/api/registrarRespuesta', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(respuesta)
                        });

                        const mensaje = await response.text();
                        alert(mensaje);

                        // Dependiendo de la respuesta, redirigir al jugador
                        if (mensaje.includes("correcta")) {
                            window.location.href = 'unJugador.html';
                        } else {
                            alert('Partida Finalizada. Gracias por jugar.');
                            window.location.href = 'index.html';
                        }
                    } catch (error) {
                        console.error('Error al registrar la respuesta:', error);
                        alert('Hubo un error al registrar la respuesta. Por favor, inténtalo nuevamente.');
                    }
                });
            }
        });

        // Actualizar la información de la partida si el contenedor está presente en la página
        //NO HA FUNCIONADO
        if (partidaInfoContainer) {
            actualizarInformacionPartida();
        }

    } catch (error) {
        console.error('Error al obtener la pregunta:', error);
        const msg = "Hubo un error al cargar la pregunta.";
        preguntaTextoElement.textContent = msg;
    }

    // Funciones auxiliares
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
            startTimer(30, () => {
                showAlert("¡Se acabó el tiempo!");
            });
        }
    }

    function startTimer(duration, onTimerEnd) {
        const timerElement = document.getElementById('timer');
        if (!timerElement) {
            console.warn("No se encontró el elemento del temporizador (timer). Verifica que el elemento esté presente en el HTML.");
            return;
        }
        let timeRemaining = duration;

        timerElement.textContent = timeRemaining;

        const intervalId = setInterval(() => {
            timeRemaining--;

            if (timeRemaining <= 0) {
                clearInterval(intervalId);
                timerElement.textContent = "0";
                if (typeof onTimerEnd === 'function') {
                    onTimerEnd();
                }
            } else {
                timerElement.textContent = timeRemaining;
            }
        }, 1000);
    }

    function obtenerTiempoTranscurrido() {
        // Implementar la lógica para obtener el tiempo transcurrido
        return 10; // Valor estático de prueba
    }

    function showAlert(message) {
        const alertDialog = document.getElementById('alertDialog');
        if (!alertDialog) {
            console.warn("No se encontró el elemento de alerta (alertDialog). Verifica que el elemento esté presente en el HTML.");
            return;
        }
        document.getElementById('alertMessage').textContent = message;
        alertDialog.showModal();
    }

    
    
    function actualizarInformacionPartida() {
        const partidaInfoContainer = document.getElementById('partidaInfo');
        if (!partidaInfoContainer) {
            console.warn("No se encontró el contenedor de información de la partida (partidaInfo). Verifica que el elemento esté presente en el HTML.");
        }
    
        const jugador = "Jugador1";
        const dificultad = localStorage.getItem('dificultad') || 'N/A';
        const respuestasCorrectas = parseInt(localStorage.getItem('respuestasCorrectas') || '0', 10);
        const puntajeAcumulado = parseInt(localStorage.getItem('puntajeAcumulado') || '0', 10);
    
        console.log("Actualizando información de la partida:", { jugador, dificultad, respuestasCorrectas, puntajeAcumulado });
    
        // Actualizar el `localStorage` para que esté disponible en la página `unJugador.html`
        localStorage.setItem('partidaInfo', JSON.stringify({ jugador, dificultad, respuestasCorrectas, puntajeAcumulado }));
    
        // Actualizar el cuadro de información de la partida en la página actual si el contenedor está presente
        if (partidaInfoContainer) {
            partidaInfoContainer.innerHTML = `
                <div class="nes-container is-rounded">
                    <p><strong>Jugador:</strong> ${jugador}</p>
                    <p><strong>Dificultad:</strong> ${dificultad}</p>
                    <p><strong>Respuestas Correctas:</strong> ${respuestasCorrectas}</p>
                    <p><strong>Puntaje Acumulado:</strong> ${puntajeAcumulado}</p>
                </div>
            `;
        }
    }
});
