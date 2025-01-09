document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('artworkCanvas');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');

    // Set canvas size
    canvas.width = 500;
    canvas.height = 500;

    // Charger les images
    const images = [
        { src: 'assets/images/logo-bleu.png' },
        { src: 'assets/images/logo-blanc.png' }
    ];

    let imagesLoaded = 0;
    const totalImages = images.length + 1; // +1 pour l'image de fond

    // Fonction pour vérifier si toutes les images sont chargées
    const checkAllImagesLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            generateArtwork(); // Générer la première jaquette une fois toutes les images chargées
        }
    };

    // Précharger les images
    images.forEach(img => {
        const image = new Image();
        image.onload = checkAllImagesLoaded;
        image.onerror = (e) => {
            console.error('Erreur de chargement de l\'image:', img.src, e);
            checkAllImagesLoaded(); // On continue même si une image échoue
        };
        image.src = img.src;
        img.element = image;
    });

    // Charger l'image de fond
    const backgroundImage = new Image();
    backgroundImage.onload = checkAllImagesLoaded;
    backgroundImage.onerror = (e) => {
        console.error('Erreur de chargement de l\'image de fond:', e);
        checkAllImagesLoaded(); // On continue même si l'image échoue
    };
    backgroundImage.src = 'assets/images/background-city.png';

    // Fonction pour dessiner le background
    const drawBackground = () => {
        if (backgroundImage.complete) {
            ctx.save();
            
            // Dessiner avec une légère opacité
            ctx.globalAlpha = 0.3;
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
            
            ctx.restore();
        }
    };

    // Fonction pour générer des couleurs néon aléatoires
    const getNeonColor = () => {
        const colors = [
            '#00f3ff', // Bleu néon
            '#0066ff', // Bleu électrique
            '#ff00ff', // Rose néon
            '#00ffcc', // Turquoise néon
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Fonction pour dessiner une particule
    const drawParticle = (x, y) => {
        const size = Math.random() * 3 + 1;
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = getNeonColor();
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    // Fonction pour dessiner un trait néon
    const drawNeonLine = () => {
        // Choisir aléatoirement entre 45° et -45°
        const baseAngle = Math.random() < 0.5 ? Math.PI/4 : -Math.PI/4;
        // Ajouter une petite variation aléatoire à l'angle (±5°)
        const angle = baseAngle + (Math.random() - 0.5) * Math.PI/18;

        // Calculer la longueur nécessaire pour traverser toute la cover
        const length = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);

        // Position de départ aléatoire sur le bord gauche ou supérieur
        let startX, startY;
        if (Math.random() < 0.5) {
            // Départ du bord gauche
            startX = -length/2;
            startY = Math.random() * canvas.height;
        } else {
            // Départ du bord supérieur
            startX = Math.random() * canvas.width;
            startY = -length/2;
        }

        const endX = startX + Math.cos(angle) * length * 2;
        const endY = startY + Math.sin(angle) * length * 2;

        ctx.save();
        ctx.beginPath();
        // Trait blanc avec effet néon bleu
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.random() * 1.5 + 0.5; // Épaisseur entre 0.5 et 2
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f3ff'; // Effet néon bleu
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    };

    // Fonction pour dessiner un effet holographique
    const drawHolographicEffect = () => {
        ctx.fillStyle = '#001220';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Fonction pour appliquer un effet de glitch à l'image
    const applyGlitchEffect = (x, y, width, height, image, isVertical = false) => {
        const numSlices = 30;
        // Adapter la direction des tranches selon l'orientation
        const sliceSize = isVertical ? width / numSlices : height / numSlices;
        
        for (let i = 0; i < numSlices; i++) {
            const offset = Math.random() > 0.7 ? Math.random() * 8 - 4 : 0;
            
            ctx.save();
            
            if (isVertical) {
                // Tranches verticales
                const sx = (width / numSlices) * i;
                const dx = x + sx;
                
                // Effet de glitch RVB
                if (Math.random() < 0.2) {
                    ctx.globalCompositeOperation = 'screen';
                    ctx.globalAlpha = 0.4;
                    // Canal rouge décalé
                    ctx.drawImage(
                        image,
                        sx, 0, sliceSize, height,
                        dx, y + offset + 2, sliceSize, height
                    );
                    // Canal bleu décalé
                    ctx.drawImage(
                        image,
                        sx, 0, sliceSize, height,
                        dx, y + offset - 2, sliceSize, height
                    );
                }
                
                // Tranche principale
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
                ctx.drawImage(
                    image,
                    sx, 0, sliceSize, height,
                    dx, y + offset, sliceSize, height
                );
                
                // Bruit numérique
                if (Math.random() < 0.05) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
                    ctx.fillRect(dx, y + offset, sliceSize, height);
                }
            } else {
                // Tranches horizontales
                const sy = (height / numSlices) * i;
                const dy = y + sy;
                
                if (Math.random() < 0.2) {
                    ctx.globalCompositeOperation = 'screen';
                    ctx.globalAlpha = 0.4;
                    ctx.drawImage(
                        image,
                        0, sy, width, sliceSize,
                        x + offset + 2, dy, width, sliceSize
                    );
                    ctx.drawImage(
                        image,
                        0, sy, width, sliceSize,
                        x + offset - 2, dy, width, sliceSize
                    );
                }
                
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
                ctx.drawImage(
                    image,
                    0, sy, width, sliceSize,
                    x + offset, dy, width, sliceSize
                );
                
                if (Math.random() < 0.05) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
                    ctx.fillRect(x + offset, dy, width, sliceSize);
                }
            }
            
            ctx.restore();
        }
    };

    // Fonction pour dessiner l'image centrale
    const drawCenterImage = (withGlitch) => {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        
        if (randomImage.element.complete) {
            ctx.save();
            
            const maxSize = canvas.width * 0.4;
            const ratio = randomImage.element.width / randomImage.element.height;
            let width = maxSize;
            let height = maxSize / ratio;
            
            if (height > maxSize) {
                height = maxSize;
                width = maxSize * ratio;
            }
            
            const x = (canvas.width - width) / 2;
            const y = (canvas.height - height) / 2;
            
            if (withGlitch) {
                // Créer un canvas temporaire pour l'effet de glitch
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = width;
                tempCanvas.height = height;
                
                // Dessiner l'image originale sur le canvas temporaire
                tempCtx.drawImage(randomImage.element, 0, 0, width, height);
                
                // Appliquer l'effet de glitch
                ctx.shadowBlur = 30;
                ctx.shadowColor = getNeonColor();
                applyGlitchEffect(x, y, width, height, tempCanvas);
            } else {
                // Dessiner l'image normale
                ctx.shadowBlur = 30;
                ctx.shadowColor = getNeonColor();
                ctx.drawImage(randomImage.element, x, y, width, height);
            }
            
            ctx.restore();
        }
    };

    // Fonction pour dessiner les effets de fond
    const drawBackgroundEffects = () => {
        const useParticles = Math.random() > 0.5;
        
        if (useParticles) {
            // Dessiner 100 particules statiques
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                drawParticle(x, y);
            }
        } else {
            // Dessiner des traits néon
            for (let i = 0; i < 18; i++) {
                drawNeonLine();
            }
        }
    };

    // Fonction pour dessiner le texte avec effet glitch néon
    const drawNeonText = () => {
        const text = 'HOLO EMPIRE';
        const textPosition = Math.random() > 0.5 ? 'top' : 'left';
        
        // Configuration de base pour le texte
        const setupText = () => {
            ctx.font = 'bold 48px Orbitron';
            ctx.textAlign = 'center';
            if (textPosition === 'top') {
                ctx.textBaseline = 'top';
                return { x: canvas.width / 2, y: 40 };
            } else {
                ctx.translate(60, canvas.height / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.textBaseline = 'middle';
                return { x: 0, y: 0 };
            }
        };

        ctx.save();
        const pos = setupText();

        // Effet de glitch principal
        for (let i = 0; i < 3; i++) {
            ctx.save();
            
            // Décalage aléatoire pour l'effet de glitch
            const offsetX = Math.random() * 4 - 2;
            const offsetY = Math.random() * 4 - 2;

            // Effet de séparation des couleurs (RGB split)
            if (i === 0) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Rouge
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 15;
                ctx.fillText(text, pos.x + offsetX + 2, pos.y + offsetY);
            } else if (i === 1) {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'; // Cyan
                ctx.shadowColor = '#00ffff';
                ctx.shadowBlur = 15;
                ctx.fillText(text, pos.x + offsetX - 2, pos.y + offsetY);
            } else {
                // Texte principal
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = getNeonColor();
                ctx.shadowBlur = 20;
                ctx.fillText(text, pos.x, pos.y);
            }
            
            ctx.restore();
        }

        // Ajout de "tranches" de glitch
        const numSlices = 3;
        for (let i = 0; i < numSlices; i++) {
            if (Math.random() < 0.3) { // 30% de chance pour chaque tranche
                ctx.save();
                
                // Calculer la position de la tranche
                const sliceY = pos.y + (i * 20);
                const offsetX = (Math.random() * 10 - 5);
                
                // Créer un effet de découpe pour la tranche
                ctx.beginPath();
                ctx.rect(0, sliceY, canvas.width, 10);
                ctx.clip();
                
                // Dessiner la tranche avec un décalage
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = getNeonColor();
                ctx.shadowBlur = 20;
                ctx.fillText(text, pos.x + offsetX, pos.y);
                
                ctx.restore();
            }
        }

        // Ajouter du bruit numérique occasionnel
        if (Math.random() < 0.5) {
            const noiseWidth = ctx.measureText(text).width;
            const noiseHeight = 48; // Hauteur approximative du texte
            const noiseX = pos.x - noiseWidth / 2;
            const noiseY = pos.y;
            
            for (let i = 0; i < 50; i++) {
                const x = noiseX + Math.random() * noiseWidth;
                const y = noiseY + Math.random() * noiseHeight;
                const size = Math.random() * 2;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                ctx.fillRect(x, y, size, size);
            }
        }

        ctx.restore();
    };

    // Fonction pour générer une nouvelle jaquette
    const generateArtwork = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawHolographicEffect();
        drawBackground();

        // Décider où appliquer l'effet de glitch
        const glitchOnImage = Math.random() > 0.5;

        if (glitchOnImage) {
            drawBackgroundEffects();
            drawCenterImage(true);
        } else {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');

            // Dessiner les effets sur le canvas temporaire
            const useParticles = Math.random() > 0.5;
            if (useParticles) {
                for (let i = 0; i < 100; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    drawParticle(x, y);
                }
            } else {
                for (let i = 0; i < 18; i++) {
                    drawNeonLine();
                }
            }

            applyGlitchEffect(0, 0, canvas.width, canvas.height, tempCanvas);
            drawCenterImage(false);
        }

        // Utiliser la nouvelle fonction de texte avec glitch
        drawNeonText();
    };

    // Fonction pour l'effet de roulette
    async function generateRoulette() {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Génération en cours...';
        
        // Générer 10 jaquettes avec un délai entre chaque
        for (let i = 0; i < 10; i++) {
            generateArtwork();
            // Ralentir progressivement la génération
            const delay = 100 + (i * 50); // Commence à 100ms et augmente de 50ms à chaque itération
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        generateBtn.disabled = false;
        generateBtn.textContent = 'Générer une jaquette';
    }

    // Gestionnaire d'événements pour le bouton de génération
    generateBtn.addEventListener('click', () => {
        if (imagesLoaded === totalImages) {
            generateRoulette();
        }
    });
}); 