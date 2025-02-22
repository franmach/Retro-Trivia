document.addEventListener('DOMContentLoaded', async function () {


    const puntajeElement = document.getElementById('puntaje');
    const typingSpeed = 50;
    let index = 0;
    let preguntaSoloTexto = "";

    const categoriaElement = document.getElementById('categoria');
    const iconoCategoria = document.getElementById('iconoCategoria');
    const preguntaTextoElement = document.getElementById('preguntaTexto');
    const opcionesContainer = document.getElementById('opciones');

    const typingSound = document.getElementById('typingSound');
    const loserSound = document.getElementById('loserSound');
    const winSound = document.getElementById('winnerSound');


    const preguntaContainer = document.querySelector('.pregunta');
    const colorPregunta = document.querySelector('.dialog-text p');
    const colorOpciones = document.querySelectorAll('#opciones button');
    const colorFooter = document.querySelectorAll('.textoFooter');
    const partidaInfoContainer = document.getElementById('partidaInfo');

    const partidaInfo = JSON.parse(localStorage.getItem('partidaInfo')) || {};


    let tiempoInicial = 0; // Variable para almacenar el tiempo inicial del contador
    let intervalId; // Variable para almacenar el ID del intervalo del temporizador
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
        Musica: {
            textColor: '#ffff',
            buttonBackground: 'black',
            footerColor: '#fdee39',
            backgroundImage: '../images/fondoMusica.png',
            icon: '../images/musica.png'
        }
    };

    if (!localStorage.getItem('partidaInfo')) {
        localStorage.setItem('partidaInfo', JSON.stringify({
            jugador: "Jugador1",
            dificultad: "Fácil",
            tiempoPorPregunta: 30,
            puntajeAcumulado: 0
        }));
    }


    // Actualizar el DOM con el puntaje inicial
    if (puntajeElement) puntajeElement.textContent = partidaInfo.puntajeAcumulado;
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
        categoriaElement.textContent = preguntaActual.categoria;
        applyCategoryStyles(preguntaActual.categoria);

        preguntaCompleta = preguntaActual.enunciado;
        preguntaSoloTexto = preguntaCompleta.split('?')[0] + '?';
        startTextAnimation(preguntaSoloTexto);
        // Guardar los datos de la pregunta en localStorage
        localStorage.setItem('preguntaGuardada', JSON.stringify({
            enunciado: preguntaActual.enunciado,
            opciones: preguntaActual.opcionesDeRespuesta,
            respuestaCorrecta: preguntaActual.respuestaCorrecta,
        }));
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

    } catch (error) {
        console.error('Error al registrar la respuesta:', error);
        showAlert('Hubo un error al registrar la respuesta. Por favor, inténtalo nuevamente.');
    }


    const cards = document.querySelectorAll('.card-container');
    const cardCosts = {
        hint: 500,
        fifty: 750,
        roll: 1000,
        king: 0
    };


    console.log(partidaInfo.puntajeAcumulado);
    if (puntajeElement) puntajeElement.textContent = partidaInfo.puntajeAcumulado;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cardId = card.id;
            const cardCost = cardCosts[cardId];

            if (partidaInfo.puntajeAcumulado >= cardCost) {
                actualizarPuntaje(-cardCost);
                console.log(`Tarjeta ${cardId} comprada.`);
                card.classList.add('disabled');
                activateCardPower(cardId);
            } else {
                showAlert('No tienes suficientes puntos para comprar este poder.');
            }
        });
    });

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

    }
    
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

            const partidaInfo = JSON.parse(localStorage.getItem('partidaInfo'));

            if (mensaje.startsWith("Respuesta correcta")) {
                // Extraer el puntaje obtenido
                const puntajeObtenido = manejarPuntaje(mensaje);

                // Actualizar puntaje y racha
                partidaInfo.puntajeAcumulado += puntajeObtenido;
                partidaInfo.racha = (partidaInfo.racha || 0) + 1; // Incrementar la racha

                // Guardar en localStorage
                localStorage.setItem('partidaInfo', JSON.stringify(partidaInfo));

                actualizarInformacionPartida();
                winSound.currentTime = 0;
                winSound.play();

                // Mostrar alerta y redirigir
                showAlert(`¡Respuesta correcta! +${puntajeObtenido} puntos`, () => {
                    setTimeout(() => {
                        window.location.href = 'unJugador.html';
                    }, 500);
                });
            } else if (mensaje.startsWith("Respuesta incorrecta")) {
                // Calcular puntaje final
                const puntajeFinal = partidaInfo.puntajeAcumulado * (partidaInfo.racha || 1);

                // Resetear la racha
                partidaInfo.racha = 0;
                localStorage.setItem('partidaInfo', JSON.stringify(partidaInfo));

                // Mostrar el puntaje final
                loserSound.currentTime = 0;
                loserSound.play();
                finAlert(puntajeFinal, () => {
                    // Redirigir o reiniciar el juego
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
        const partidaInfo = JSON.parse(localStorage.getItem('partidaInfo')) || {};

        const nombreUElement = document.getElementById('nombreU');
        const dificultadElement = document.getElementById('dificultad');
        const tiempoElement = document.getElementById('tiempo');
        const puntajeElement = document.getElementById('puntaje');

        if (nombreUElement) nombreUElement.textContent = partidaInfo.jugador || "Desconocido";
        if (dificultadElement) dificultadElement.textContent = partidaInfo.dificultad || "No asignada";
        if (tiempoElement) tiempoElement.textContent = `${partidaInfo.tiempoPorPregunta || 0} segundos`;
        if (puntajeElement) puntajeElement.textContent = partidaInfo.puntajeAcumulado || 0;

        console.log("Información de la partida cargada:", partidaInfo);
    }
    function startTextAnimation(text) {
        index = 0;
        preguntaTextoElement.innerHTML = "";
        typingSound.play();

        // Obtiene todos los botones dentro de #opciones y los deshabilita  
        const botones = document.querySelectorAll('#opciones button');
        botones.forEach(boton => {
            boton.disabled = true;
        });
        document.getElementById('poderes').classList.add('disabled');


        typeDialog(text);
    }

    const tituloFin = document.getElementById('tituloFin');

    function typeDialog(text) {
        if (index < text.length) {
            preguntaTextoElement.innerHTML += text[index];
            index++;
            setTimeout(() => typeDialog(text), typingSpeed);
        } else {
            typingSound.pause();
            botones = document.querySelectorAll('#opciones button');
            botones.forEach(boton => {
                boton.disabled = false;
            });
            document.getElementById('poderes').classList.remove('disabled');

            startTimer(partidaInfo.tiempoPorPregunta, () => {
                const puntajeFinal = partidaInfo.puntajeAcumulado * (partidaInfo.racha || 1);

                loserSound.currentTime = 0;
                loserSound.play();
                tituloFin.textContent = 'SE ACABO EL TIEMPO!';
                finAlert(puntajeFinal,() => {
                    // Redirigir a la pantalla inicial o realizar otras acciones
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

    function finAlert(puntajeFinal, callback) {
        const closeButton = document.getElementById('btnFin');
        const finDialog = document.getElementById('finDialog');

        if (!finDialog) {
            console.warn("No se encontró el elemento de alerta (finDialog). Verifica que el elemento esté presente en el HTML.");
            return;
        }

        // Construir contenido dinámico con los datos de la partida
        const finMessageElement = document.getElementById('finMessage');
        finMessageElement.innerHTML = `
            <p>Jugador: ${partidaInfo.jugador || "Desconocido"}</p>
            <p>Dificultad: ${partidaInfo.dificultad || "No asignada"}</p>
            <P>Puntaje Acumulado: ${partidaInfo.puntajeAcumulado || "0"}</p>
            <P>Racha: x${partidaInfo.racha || "0"}</p>
            <p>Puntaje Final: ${puntajeFinal}</p>
        `;

        // Muestra el cuadro de diálogo
        finDialog.showModal();

        // Agrega un evento para cerrar el cuadro de diálogo solo con el botón
        closeButton.addEventListener('click', () => {
            finDialog.close();
            if (typeof callback === 'function') {
                callback(); // Ejecuta la función adicional si se pasa
            }
        }, { once: true });
    }


    function actualizarPuntaje(puntos) {
        // Recuperar partidaInfo
        const partidaInfo = JSON.parse(localStorage.getItem('partidaInfo')) || {};

        // Asegurar estructura
        partidaInfo.puntajeAcumulado = (partidaInfo.puntajeAcumulado || 0) + puntos;

        // Guardar en localStorage
        localStorage.setItem('partidaInfo', JSON.stringify(partidaInfo));

        // Actualizar el DOM
        const puntajeElement = document.getElementById('puntaje');
        if (puntajeElement) puntajeElement.textContent = partidaInfo.puntajeAcumulado;

        console.log("Puntaje actualizado:", partidaInfo.puntajeAcumulado);
    }


    function activateCardPower(cardId) {
        switch (cardId) {
            case 'hint':
                console.log('Activando poder Hint...');
                activateHintCard();
                break;
            case 'fifty':
                console.log('Activando poder Fifty-Fifty...');
                activateFiftyFifty();
                break;
            case 'roll':
                console.log('Activando poder Roll...');
                activateRollPower();
                break;
            case 'king':
                console.log('Activando poder King...');
                activateKingPower();
                break;
            default:
                console.warn(`No se reconoce el poder asociado a la tarjeta con ID: ${cardId}`);
        }
    }
    // Funciones de cada poder
    function activateKingPower() {
        console.log("Activando el poder King: duplicar puntos.");
        showAlert("¡Puntos duplicados!");
        // Lógica para duplicar puntos (puedes ajustar según tu lógica actual)
        const puntajeElement = document.getElementById('puntaje');
        const puntajeActual = parseInt(puntajeElement.textContent) || 0;
        puntajeElement.textContent = puntajeActual * 2;
        partidaInfo.puntajeAcumulado = puntajeActual * 2;
    }

    function activateRollPower() {
        const tituloAlert = document.getElementById('tituloAlert');
        tituloAlert.textContent = 'Roll Card'
        showAlert('Volviendo a la ruleta', () => {
            window.location.href = 'unJugador.html';
        });
    }

    async function activateHintCard() {
        console.log("Activando el poder Hint: mostrar pista.");

        const preguntaActual = JSON.parse(localStorage.getItem('preguntaActual'));

        if (preguntaActual && preguntaActual.enunciado) {
            try {
                // Realizar la llamada al backend para obtener la pista
                const response = await fetch('https://localhost:8080/api/pista', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pregunta: preguntaActual.enunciado }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Pista obtenida:", data.pista);
                    const tituloAlert = document.getElementById('tituloAlert');
                    tituloAlert.textContent= 'PISTA';
                    showAlert(data.pista);
                } else {
                    console.error("Error al obtener la pista:", response.statusText);
                    showAlert("No se pudo generar una pista. Intenta nuevamente.");
                }
            } catch (error) {
                console.error("Error al realizar la solicitud para obtener la pista:", error);
                showAlert("Hubo un error al generar la pista. Intenta nuevamente.");
            }
        } else {
            showAlert("No hay pregunta actual para generar una pista.");
        }
    }

    function activateFiftyFifty() {
        // Recuperar los datos de la pregunta desde el localStorage
        const preguntaGuardada = JSON.parse(localStorage.getItem('preguntaGuardada'));

        if (!preguntaGuardada) {
            console.warn("No se encontraron datos de la pregunta en el localStorage.");
            return;
        }

        const respuestaCorrecta = preguntaGuardada.respuestaCorrecta; // Ejemplo: "B"

        // Seleccionar todos los botones dentro de #opciones
        const opciones = Array.from(document.querySelectorAll('#opciones button'));

        // Mapear la letra a un índice basado en ASCII
        const indiceCorrecta = respuestaCorrecta.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3

        // Identificar la opción correcta basada en el índice
        const correcta = opciones[indiceCorrecta];

        if (!correcta) {
            console.warn("No se encontró la opción correcta en las opciones.");
            return;
        }

        // Filtrar las opciones incorrectas
        const incorrectas = opciones.filter((_, index) => index !== indiceCorrecta);

        if (incorrectas.length >= 2) {
            // Seleccionar 2 opciones incorrectas para eliminar
            const eliminadas = incorrectas.slice(0, 2);
            eliminadas.forEach(opcion => {
                opcion.disabled = true;
                opcion.style.opacity = 0.5; // Reducir visibilidad de las incorrectas eliminadas
            });
        } else {
            console.warn("No hay suficientes opciones incorrectas para eliminar.");
        }

        // Mantener habilitadas la opción correcta y cualquier incorrecta que no fue eliminada
        opciones.forEach(opcion => {
            if (!opcion.disabled) {
                opcion.disabled = false; // Asegurar que las opciones restantes estén habilitadas
                opcion.style.opacity = 1; // Restaurar visibilidad completa
            }
        });
    }



});

