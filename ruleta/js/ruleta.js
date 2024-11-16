// Ruleta.js
class Ruleta {
    constructor(canvasId, spinButtonId, backButtonId, resultElementId, categories, onCategorySelected) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.spinButton = document.getElementById(spinButtonId);
        this.backButton = document.getElementById(backButtonId);
        this.resultElement = document.getElementById(resultElementId);
        this.categories = categories;
        this.angle = 0;
        this.isSpinning = false;
        this.onCategorySelected = onCategorySelected;

        this.spinSound = document.getElementById(spinSound);


        this.colors = ['#FF6B6B', '#4ECDC4', '#000000', '#FED766', '#9B5DE5', '#F8A13F'];
        this.images = [];
        this.backgroundImages = [];
        
        if (this.ctx) {
            this.preloadImages(this.categories.map(cat => cat.imageSrc), this.images, () => {
                this.preloadImages(this.categories.map(cat => cat.backgroundSrc), this.backgroundImages, this.drawWheel.bind(this));
            });
        }

        this.attachEventListeners();
    }

    preloadImages(sources, targetArray, callback) {
        let loadedImages = 0;
        sources.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                targetArray[index] = img;
                loadedImages++;
                if (loadedImages === sources.length) callback();
            };
            img.onerror = () => {
                console.error(`Error cargando la imagen: ${src}`);
                loadedImages++;
                if (loadedImages === sources.length) callback();
            };
        });
    }

    drawWheel() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const sectionAngle = (Math.PI * 2) / this.categories.length;

        this.categories.forEach((category, i) => {
            this.ctx.beginPath();
            this.ctx.moveTo(200, 200);
            this.ctx.arc(200, 200, 180, i * sectionAngle + this.angle, (i + 1) * sectionAngle + this.angle);
            this.ctx.lineTo(200, 200);
            this.ctx.closePath();

            this.ctx.save();
            this.ctx.clip();

            if (this.backgroundImages[i]) {
                this.ctx.drawImage(this.backgroundImages[i], 0, 0, this.canvas.width, this.canvas.height);
            } else {
                this.ctx.fillStyle = this.colors[i];
                this.ctx.fill();
            }

            this.ctx.restore();

            if (this.images[i]) {
                const aspectRatio = this.images[i].width / this.images[i].height;
                const maxImgSize = 100;
                const imgWidth = aspectRatio > 1 ? maxImgSize : maxImgSize * aspectRatio;
                const imgHeight = aspectRatio > 1 ? maxImgSize / aspectRatio : maxImgSize;
                const radialDistance = 120;
                const imgX = 200 + Math.cos(i * sectionAngle + this.angle + sectionAngle / 2) * radialDistance - imgWidth / 2;
                const imgY = 200 + Math.sin(i * sectionAngle + this.angle + sectionAngle / 2) * radialDistance - imgHeight / 2;

                this.ctx.drawImage(this.images[i], imgX, imgY, imgWidth, imgHeight);
            }
        });
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinButton.disabled = true;

        // Reproducir sonido de giro
        if (this.spinSound) {
            this.spinSound.currentTime = 0;
            this.spinSound.play();
        }

        const spinAngleStart = Math.random() * 20 + 20;
        let spinTime = 0;
        const spinTimeTotal = 10000;

        const rotateWheel = () => {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                this.stopRotateWheel();
                return;
            }
            const spinAngle = spinAngleStart - this.easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            this.angle += (spinAngle * Math.PI / 180);
            this.drawWheel();
            setTimeout(rotateWheel, 30);
        };

        rotateWheel();
    }

    stopRotateWheel() {
        this.isSpinning = false;
        this.spinButton.disabled = false;
        const degrees = this.angle * 180 / Math.PI + 90;
        const arcd = 360 / this.categories.length;
        const index = Math.floor((360 - degrees % 360) / arcd);
        const selectedCategory = this.categories[index];

        this.resultElement.textContent = `Has caído en: ${selectedCategory.name}`;
        this.onCategorySelected(selectedCategory);
    }

    easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    attachEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.backButton.addEventListener('click', () => {
            this.resultElement.textContent = '';
            this.spinButton.disabled = false;
            window.location.href = 'seleccionJugadores.html';
        });
    }
}

export default Ruleta;
