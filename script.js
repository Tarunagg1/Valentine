// Get elements
const questionCard = document.getElementById('questionCard');
const successCard = document.getElementById('successCard');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const heartsContainer = document.getElementById('heartsContainer');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');

// Set canvas size
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

// Floating hearts background
function createFloatingHeart() {
    const heartTypes = ['❤️', '💕', '💖', '💗', '💝'];
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 4 + 5) + 's';
    heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Create hearts continuously
setInterval(createFloatingHeart, 300);

// Yes button growing effect
let growthLevel = 1;
let growthInterval;
let growthCount = 0;
const maxGrowthCount = 6;
const warmingText = document.querySelector('.warming-text');

function startYesButtonGrowth() {
    growthInterval = setInterval(() => {
        if (growthCount < maxGrowthCount) {
            growthCount++;
            growthLevel += 0.18;
            yesBtn.style.setProperty('--grow-scale', growthLevel);
            yesBtn.classList.add('growing');

            // Show "getting warmer" text after first growth
            if (growthCount === 1) {
                warmingText.classList.add('show');
            }

            // Create sparkles around Yes button
            createSparkles();
        } else {
            // Stop growing after 6 times
            clearInterval(growthInterval);
        }
    }, 5000);
}

// Start the growth effect when page loads
startYesButtonGrowth();

// Create sparkles effect
function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const cardRect = questionCard.getBoundingClientRect();

    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');

        const angle = (Math.PI * 2 * i) / 8;
        const distance = 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.left = (yesBtnRect.left + yesBtnRect.width / 2 - cardRect.left) + 'px';
        sparkle.style.top = (yesBtnRect.top + yesBtnRect.height / 2 - cardRect.top) + 'px';
        sparkle.style.setProperty('--sparkle-x', x + 'px');
        sparkle.style.setProperty('--sparkle-y', y + 'px');

        sparklesContainer.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1500);
    }
}

// Romantic "No" button behavior with movement
const romanticMessages = [
    "No, please don't click me 💔",
    "Not this again, my love 😢",
    "Please, have mercy on my heart 💕",
    "I can't take this rejection 😭",
    "No, my darling, not yet 🌹",
    "Please reconsider, sweetheart 💖",
    "Don't break my heart like this 💔",
    "No, I beg you, not now 😞"
];

let lastMoveTime = 0;
let isMoving = false;
const buttonsContainer = document.querySelector('.buttons-container');

questionCard.addEventListener('mousemove', checkCursorNearNoButton);
noBtn.addEventListener('mouseenter', changeToRomantic);
noBtn.addEventListener('mouseleave', changeBackToNo);
noBtn.addEventListener('touchstart', moveNoButton);

function checkCursorNearNoButton(e) {
    if (isMoving) return;

    const now = Date.now();
    if (now - lastMoveTime < 200) return;

    const btnRect = noBtn.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(
        Math.pow(mouseX - btnCenterX, 2) +
        Math.pow(mouseY - btnCenterY, 2)
    );

    if (distance < 150) {
        lastMoveTime = now;
        isMoving = true;
        moveNoButtonAwayFromCursor(mouseX, mouseY, btnCenterX, btnCenterY);
        setTimeout(() => { isMoving = false; }, 300);
    }
}

function moveNoButtonAwayFromCursor(mouseX, mouseY, btnCenterX, btnCenterY) {
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const deltaX = btnCenterX - mouseX;
    const deltaY = btnCenterY - mouseY;

    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const dirX = deltaX / dist;
    const dirY = deltaY / dist;

    const moveDistance = 350;
    const targetX = btnCenterX + dirX * moveDistance;
    const targetY = btnCenterY + dirY * moveDistance;

    let newLeft = targetX - containerRect.left - btnRect.width / 2;
    let newTop = targetY - containerRect.top - btnRect.height / 2;

    const padding = 10;
    newLeft = Math.max(padding, Math.min(containerRect.width - btnRect.width - padding, newLeft));
    newTop = Math.max(padding, Math.min(containerRect.height - btnRect.height - padding, newTop));

    noBtn.style.position = 'absolute';
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top = newTop + 'px';
    noBtn.style.transform = 'none';
}

function changeToRomantic(e) {
    e.preventDefault();
    const randomMessage = romanticMessages[Math.floor(Math.random() * romanticMessages.length)];
    noBtn.textContent = randomMessage;
}

function changeBackToNo(e) {
    e.preventDefault();
    noBtn.textContent = 'No';
}

function moveNoButton(e) {
    e.preventDefault();
    const containerRect = buttonsContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const padding = 10;
    const maxX = containerRect.width - btnRect.width - padding * 2;
    const maxY = containerRect.height - btnRect.height - padding * 2;

    const randomX = Math.random() * maxX + padding;
    const randomY = Math.random() * maxY + padding;

    noBtn.style.position = 'absolute';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transform = 'none';
}

// Yes button click
yesBtn.addEventListener('click', () => {
    // Clear the growth interval
    clearInterval(growthInterval);

    // Hide question card with animation
    questionCard.style.animation = 'cardDisappear 0.5s ease-in';

    setTimeout(() => {
        questionCard.style.display = 'none';
        successCard.style.display = 'block';

        // Start confetti
        startConfetti();

        // Create more hearts
        createHeartExplosion();

        // Start rose petals
        startRosePetals();
    }, 500);
});

// Rose petals animation
function startRosePetals() {
    const rosePetalsContainer = document.getElementById('rosePetals');

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('rose-petal');
        petal.innerHTML = '🌹';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 4 + 6) + 's';
        petal.style.animationDelay = Math.random() * 2 + 's';
        rosePetalsContainer.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 10000);
    }

    // Create petals continuously
    setInterval(createPetal, 400);

    // Create initial batch
    for (let i = 0; i < 8; i++) {
        setTimeout(createPetal, i * 200);
    }
}

// Card disappear animation
const style = document.createElement('style');
style.textContent = `
    @keyframes cardDisappear {
        to {
            opacity: 0;
            transform: scale(0.8) translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// Confetti animation
function startConfetti() {
    confettiCanvas.style.display = 'block';

    const confetti = [];
    const confettiCount = 200;
    const colors = ['#d53369', '#daae51', '#ff6b6b', '#feca57', '#ff9a9e', '#fff'];

    class Confetto {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = -20;
            this.size = Math.random() * 10 + 4;
            this.speedY = Math.random() * 4 + 2;
            this.speedX = Math.random() * 3 - 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 12 - 6;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > confettiCanvas.height) {
                this.y = -20;
                this.x = Math.random() * confettiCanvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        confetti.push(new Confetto());
    }

    // Animation loop
    function animateConfetti() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confetti.forEach(c => {
            c.update();
            c.draw();
        });

        requestAnimationFrame(animateConfetti);
    }

    animateConfetti();
}

// Heart explosion effect
function createHeartExplosion() {
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.style.position = 'fixed';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = 'translate(-50%, -50%)';
            heart.style.zIndex = '10000';
            heart.style.pointerEvents = 'none';
            heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

            const angle = (Math.PI * 2 * i) / 30;
            const velocity = Math.random() * 300 + 200;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            document.body.appendChild(heart);

            let posX = 0;
            let posY = 0;
            let opacity = 1;

            const animate = () => {
                posX += vx * 0.016;
                posY += vy * 0.016;
                opacity -= 0.02;

                heart.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px))`;
                heart.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    heart.remove();
                }
            };

            animate();
        }, i * 50);
    }
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});
