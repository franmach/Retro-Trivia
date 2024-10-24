document.addEventListener('DOMContentLoaded', function () {
    // Elementos de la interfaz
    const startScreen = document.getElementById('startScreen');
    const playerSelectionScreen = document.getElementById('playerSelectionScreen');
    const gameScreen = document.getElementById('gameScreen');
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const dialogTextElement = document.getElementById('dialogText');

    // Audio
    const hoverSound = document.getElementById('hoverSound');
    const spinSound = document.getElementById('spinSound');
    const menuSound = document.getElementById('menuSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const typing = document.getElementById("typingSound");

    // Animacion dialogo

    // Texto de diálogo y configuración de animación
    const text = "BIENVENIDO A 8BIT TRIVIA\n¿Estas listo para jugar?";
    let index = 0;
    const typingSpeed = 50;

    // Animación del texto
    function startTextAnimation() {
        index = 0;
        dialogTextElement.innerHTML = ""; // Limpiar el texto antes de iniciar
        typing.play();
        typeDialog();

    }

    function resetDialogText() {
        dialogTextElement.innerHTML = ""; // Limpiar el texto al volver atrás
    }

    function typeDialog() {
        if (index < text.length) {
            dialogTextElement.innerHTML += text[index];
            index++;
            setTimeout(typeDialog, typingSpeed);
        } else {
            typing.pause();  // Detener el sonido cuando se termine de escribir
        }
    }
    

    // Eventos de inicio
    document.getElementById('pressStartText').addEventListener('click', function () {
        startScreen.classList.add('hidden');
        playerSelectionScreen.classList.remove('hidden');
        backgroundMusic.play(); // Iniciar la música de fondo
    });

    // Selección de número de jugadores
    document.getElementById('onePlayerBtn').addEventListener('click', function () {
        playerSelectionScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startTextAnimation();
    });

    document.getElementById('twoPlayersBtn').addEventListener('click', function () {
        playerSelectionScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        startTextAnimation();
    });

    // Botón de giro
    document.getElementById('spinBtn').addEventListener('click', spin);

    // Botón de "Volver atrás"
    document.getElementById('backBtn').addEventListener('click', function () {
        // Detener el sonido si está reproduciéndose
        spinSound.pause();
       resetDialogText() ;
        
        // Limpiar el resultado si existe
        if (document.getElementById('resultEl')) {
            document.getElementById('resultEl').textContent = '';
        }
        
        // Habilitar el botón de giro
        document.getElementById('spinBtn').disabled = false;
        
        // Ocultar la pantalla de juego y mostrar la de selección de jugadores
        gameScreen.classList.add('hidden');
        playerSelectionScreen.classList.remove('hidden');
    });

    // Configuración de la ruleta
    let angle = 0;
    let isSpinning = false;
    let sections = ['Arte', 'Geografia', 'Ciencia', 'Corona', 'Entretenimiento', 'Deportes'];
    let colors = ['#FF6B6B', '#4ECDC4', '#000000', '#FED766', '#9B5DE5', '#F8A13F'];
    let images = [];
    let imageSources = ['images/arte.png', 'images/earth.png', 'images/ciencia.png', 'images/crown.png', 'images/pop.png', 'images/deporte.png'];

    // Cargar imágenes
    imageSources.forEach((src, index) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            images[index] = img;
            drawWheel();
        };
    });

    let backgroundImages = [];
    let backgroundSources = ['images/fondoA.png', 'images/fondoGeo.png', 'images/fondoCie.png', 'images/fond.png', 'images/fondoE.png', 'images/fondoD.png'];
    
    backgroundSources.forEach((src, index) => {
        let img = new Image();
        img.src = src;
        img.onload = () => {
            backgroundImages[index] = img;
            drawWheel(); // Redibujar la rueda cuando se carguen las imágenes
        };
    });

    // Dibujar la rueda
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let sectionAngle = (Math.PI * 2) / sections.length;
    
        for (let i = 0; i < sections.length; i++) {
            // Crear la ruta para la sección de la ruleta
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 140, i * sectionAngle + angle, (i + 1) * sectionAngle + angle);
            ctx.lineTo(150, 150);
            ctx.closePath();
    
            // Clipping para limitar el área de dibujo al triángulo de la sección
            ctx.save(); // Guardar el estado del contexto
            ctx.clip(); // Limitar el dibujo a la sección actual
    
            // Dibujar la imagen de fondo para la sección, si está disponible
            if (backgroundImages[i]) {
                // Ajustar el tamaño de la imagen de fondo para que ocupe todo el triángulo
                ctx.drawImage(backgroundImages[i], 0, 0, canvas.width, canvas.height);
            } else {
                // Si no hay imagen de fondo, usar el color
                ctx.fillStyle = colors[i];
                ctx.fill();
            }
    
            ctx.restore(); // Restaurar el contexto para la siguiente sección
    
            // Dibujar la imagen de la categoría dentro del triángulo
            if (images[i]) {
                // Tamaño original de la imagen
                let imgOriginalWidth = images[i].width;
                let imgOriginalHeight = images[i].height;
    
                // Calcular la relación de aspecto de la imagen
                let aspectRatio = imgOriginalWidth / imgOriginalHeight;
    
                // Definir un tamaño máximo para el ancho o alto
                let maxImgSize = 80;
    
                let imgWidth, imgHeight;
    
                // Ajustar el tamaño según la relación de aspecto
                if (aspectRatio > 1) {
                    // Imagen más ancha que alta
                    imgWidth = maxImgSize;
                    imgHeight = maxImgSize / aspectRatio;
                } else {
                    // Imagen más alta que ancha
                    imgWidth = maxImgSize * aspectRatio;
                    imgHeight = maxImgSize;
                }
    
                // Calcular la posición para centrar la imagen en su sector
                let imgX = 150 + Math.cos(i * sectionAngle + angle + sectionAngle / 2) * 90 - imgWidth / 2;
                let imgY = 150 + Math.sin(i * sectionAngle + angle + sectionAngle / 2) * 90 - imgHeight / 2;
    
                // Dibujar la imagen con el tamaño ajustado
                ctx.drawImage(images[i], imgX, imgY, imgWidth, imgHeight);
            }
        }
    }
    
    

    // Función para girar la rueda
    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        document.getElementById('spinBtn').disabled = true;

        spinSound.currentTime = 0; // Reiniciar sonido de giro
        spinSound.play();

        let spinAngleStart = Math.random() * 20 + 20;
        let spinTime = 0;
        const spinTimeTotal = 10000;

        function rotateWheel() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }
            let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            angle += (spinAngle * Math.PI / 180);
            drawWheel();
            setTimeout(rotateWheel, 30);
        }

        rotateWheel();

        function stopRotateWheel() {
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            let degrees = angle * 180 / Math.PI + 90;
            let arcd = 360 / sections.length;
            let index = Math.floor((360 - degrees % 360) / arcd);
            document.getElementById('resultEl').textContent = `Has caído en: ${sections[index]}`;
        }

        function easeOut(t, b, c, d) {
            let ts = (t /= d) * t;
            let tc = ts * t;
            return b + c * (tc + -3 * ts + 3 * t);
        }
    }

   

    // Eventos de sonido para los botones
    document.querySelectorAll('.menuBtn').forEach(btn => {
        btn.addEventListener('mouseover', function () {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });

        btn.addEventListener('mouseout', function () {
            hoverSound.pause();
        });
    });

    // Sonido de los botones de selección de jugadores
    [document.getElementById("pressStartText"), document.getElementById("onePlayerBtn"),document.getElementById("backBtn"), document.getElementById("twoPlayersBtn")].forEach(btn => {
        btn.addEventListener("mouseover", function () {
            menuSound.currentTime = 0;
            menuSound.play();
        });
        btn.addEventListener("mouseout", function () {
            menuSound.pause();
        });
    });
});
