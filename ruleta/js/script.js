document.addEventListener('DOMContentLoaded', function () {
    // Elementos de la interfaz
    const startScreen = document.getElementById('startScreen');
    const playerSelectionScreen = document.getElementById('playerSelectionScreen');
    const gameScreen = document.getElementById('gameScreen');

    // Configuración de canvas y contexto
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    if (!ctx) {
        console.warn('El contexto del canvas no está disponible');
        return;
    }

    const dialogTextElement = document.getElementById('dialogText');

    // Audio
    const hoverSound = document.getElementById('hoverSound');
    const spinSound = document.getElementById('spinSound');
    const menuSound = document.getElementById('menuSound');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const typing = document.getElementById("typingSound");

    // Configuración de texto y sonido
    const text = "BIENVENIDO A 8BIT TRIVIA\n¿Estas listo para jugar?";
    let index = 0;
    const typingSpeed = 50;

    function startTextAnimation() {
        index = 0;
        dialogTextElement.innerHTML = "";
        typing.play();
        typeDialog();
    }

    function typeDialog() {
        if (index < text.length) {
            dialogTextElement.innerHTML += text[index];
            index++;
            setTimeout(typeDialog, typingSpeed);
        } else {
            typing.pause();
        }
    }

    document.getElementById('pressStartText').addEventListener('click', function () {
        startScreen.classList.add('hidden');
        playerSelectionScreen.classList.remove('hidden');
        backgroundMusic.play();
    });

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

    document.getElementById('spinBtn').addEventListener('click', spin);

    document.getElementById('backBtn').addEventListener('click', function () {
        spinSound.pause();
        
        if (document.getElementById('resultEl')) {
            document.getElementById('resultEl').textContent = '';
        }
        
        document.getElementById('spinBtn').disabled = false;
        gameScreen.classList.add('hidden');
        playerSelectionScreen.classList.remove('hidden');
    });

    // Configuración de la ruleta
    let angle = 0;
    let isSpinning = false;
    let sections = ['Arte', 'Geografia', 'Ciencia', 'Corona', 'Entretenimiento', 'Deportes'];
    let colors = ['#FF6B6B', '#4ECDC4', '#000000', '#FED766', '#9B5DE5', '#F8A13F'];
    let images = [];
    let backgroundImages = [];

    // Función para cargar imágenes
    function preloadImages(sources, targetArray, callback) {
        let loadedImages = 0;
        sources.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                targetArray[index] = img;
                loadedImages++;
                if (loadedImages === sources.length) {
                    callback();
                }
            };
            img.onerror = () => {
                console.error(`Error cargando la imagen: ${src}`);
                loadedImages++;
                if (loadedImages === sources.length) {
                    callback();
                }
            };
        });
    }

    // Fuentes de las imágenes
    let imageSources = ['images/arte.png', 'images/earth.png', 'images/ciencia.png', 'images/crown.png', 'images/pop.png', 'images/deporte.png'];
    let backgroundSources = ['images/fondoA.png', 'images/fondoGeo.png', 'images/fondoCie.png', 'images/fond.png', 'images/fondoE.png', 'images/fondoD.png'];

    // Cargar imágenes y luego dibujar la rueda
    preloadImages(imageSources, images, () => {
        preloadImages(backgroundSources, backgroundImages, drawWheel);
    });

    // Dibujar la rueda
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let sectionAngle = (Math.PI * 2) / sections.length;
    
        for (let i = 0; i < sections.length; i++) {
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 140, i * sectionAngle + angle, (i + 1) * sectionAngle + angle);
            ctx.lineTo(150, 150);
            ctx.closePath();
    
            ctx.save();
            ctx.clip();
    
            if (backgroundImages[i]) {
                ctx.drawImage(backgroundImages[i], 0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = colors[i];
                ctx.fill();
            }
    
            ctx.restore();
    
            if (images[i]) {
                let aspectRatio = images[i].width / images[i].height;
                let maxImgSize = 80;
                let imgWidth = aspectRatio > 1 ? maxImgSize : maxImgSize * aspectRatio;
                let imgHeight = aspectRatio > 1 ? maxImgSize / aspectRatio : maxImgSize;
                let imgX = 150 + Math.cos(i * sectionAngle + angle + sectionAngle / 2) * 90 - imgWidth / 2;
                let imgY = 150 + Math.sin(i * sectionAngle + angle + sectionAngle / 2) * 90 - imgHeight / 2;
    
                ctx.drawImage(images[i], imgX, imgY, imgWidth, imgHeight);
            }
        }
    }

    // Función para girar la rueda
    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        document.getElementById('spinBtn').disabled = true;
        spinSound.currentTime = 0;
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

    // Eventos de sonido para los botones del menú
    document.querySelectorAll('.menuBtn').forEach(btn => {
        btn.addEventListener('mouseover', function () {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });

        btn.addEventListener('mouseout', function () {
            hoverSound.pause();
        });
    });

    // Sonido para los botones de selección de jugadores
    [document.getElementById("pressStartText"), document.getElementById("onePlayerBtn"), document.getElementById("backBtn"), document.getElementById("twoPlayersBtn")].forEach(btn => {
        btn.addEventListener("mouseover", function () {
            menuSound.currentTime = 0;
            menuSound.play();
        });
        btn.addEventListener("mouseout", function () {
            menuSound.pause();
        });
    });
});