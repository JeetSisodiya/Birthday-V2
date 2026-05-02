const messages = [
    "Today is...",
    "as beautiful as other days",
    "but you realize",
    "another year has gone",
    "in a blink of the eyes",
    "however",
    "Do you know..?",
    "today is just special",
    "so special to you",
    "that's why",
    "Let's make it...",
    "the best celebration ever",
    "and let me share...",
    "a piece of happiness to you",
    "I made all this...",
    "as a birthday present to you",
    "thanks for the friendship we made",
    "thanks for everything",
    "I wish you all the best",
    "May your life be at ease",
    "May all your wishes come true",
    "Remember",
    "your ambitions",
    "you live as a free bird...",
    "flying in the blue sky",
    "Now things are different...",
    "real story of your life",
    "is just about to begin",
    "indeed..",
    "but...",
    "don't worry",
    "because...",
    "God has your back",
    "and",
    "this year will be better",
    "and I hope",
    "you'll find...",
    "happiness along the way",
    "keep your spirit up",
    "enjoy every single moment...",
    "that you experience today",
    "fill it with your most beautiful smile",
    "and make it the best memory..",
    "lastly...",
    "I'd like to wish you one more time",
    "Happy Birthday Lily!"
];

const btn = document.getElementById('main-action-btn');
const bgMusic = document.getElementById('bg-music');
const lightsContainer = document.getElementById('lights-container');
const bulbs = document.querySelectorAll('.bulb');
const decorContainer = document.getElementById('decor-container');
const balloonsContainer = document.getElementById('balloons-container');
const cakeContainer = document.getElementById('cake-container');
const photoContainer = document.getElementById('photo-container');
const storyContainer = document.getElementById('story-container');

let state = 0;

btn.addEventListener('click', () => {
    state++;
    if (state === 1) {
        // Step 1: Turn On Lights
        lightsContainer.classList.add('show');
        setTimeout(() => {
            bulbs.forEach(bulb => {
                const colorSrc = bulb.getAttribute('data-color');
                bulb.src = colorSrc;
                bulb.classList.add('lit');
            });
            document.body.classList.add('lights-on');
        }, 1500); // Wait for bulbs to drop
        btn.innerText = "Play Music";
    } 
    else if (state === 2) {
        // Step 2: Play Music
        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log("Audio play blocked or missing:", e));
        bulbs.forEach(bulb => bulb.classList.add('dancing'));
        btn.innerText = "Let's Decorate";
    }
    else if (state === 3) {
        // Step 3: Decorate
        decorContainer.classList.add('show');
        btn.innerText = "Fly Balloons";
    }
    else if (state === 4) {
        // Step 4: Fly Balloons
        createBalloons();
        btn.innerText = "Bring Cake";
    }
    else if (state === 5) {
        // Step 5: Bring Cake
        cakeContainer.classList.add('show');
        btn.innerText = "Special Person";
    }
    else if (state === 6) {
        // Step 6: Show Photo
        cakeContainer.style.transform = 'translateX(-50%) scale(1) translateY(120px)'; // Move cake down
        photoContainer.classList.add('show');
        btn.innerText = "A message for you";
    }
    else if (state === 7) {
        // Step 7: Story
        btn.style.opacity = '0';
        setTimeout(() => { btn.style.display = 'none'; }, 400); // fade out button
        storyContainer.classList.add('active');
        playStory();
    }
});

function createBalloons() {
    const balloonImages = ['b2.png', 'b3.png', 'b4.png', 'b5.png', 'b6.png', 'b7.png'];
    
    // Create a continuous stream of balloons
    const interval = setInterval(() => {
        const b = document.createElement('img');
        const randomImg = balloonImages[Math.floor(Math.random() * balloonImages.length)];
        b.src = randomImg;
        b.className = 'balloon';
        
        // Random horizontal position (5vw to 95vw)
        b.style.left = (Math.random() * 90 + 5) + 'vw';
        
        // Random size (40px to 80px)
        const size = Math.random() * 40 + 40; 
        b.style.width = size + 'px';
        
        // Random duration (8s to 12s)
        const duration = Math.random() * 4 + 8; 
        b.style.animationDuration = duration + 's';
        
        balloonsContainer.appendChild(b);
        
        // Cleanup after animation finishes to keep DOM light
        setTimeout(() => {
            if(b.parentNode) {
                b.remove();
            }
        }, duration * 1000);
        
    }, 600); // Generate a balloon every 0.6 seconds
}

async function playStory() {
    // Wait for the blur transition to settle
    await new Promise(r => setTimeout(r, 1000));

    for (let i = 0; i < messages.length; i++) {
        await displayLine(messages[i]);
    }
    
    // Final burst of confetti
    fireSoftConfetti();
}

function displayLine(text) {
    return new Promise((resolve) => {
        const el = document.createElement('div');
        el.className = 'story-line';
        el.innerText = text;
        storyContainer.appendChild(el);
        
        const lines = document.querySelectorAll('.story-line');
        
        lines.forEach((line) => {
            if (line !== el) {
                if (line.classList.contains('fade-up-2')) {
                    line.classList.remove('fade-up-2');
                    line.classList.add('exit');
                    setTimeout(() => {
                        if(line.parentNode) line.remove();
                    }, 2000);
                } else if (line.classList.contains('fade-up-1')) {
                    line.classList.remove('fade-up-1');
                    line.classList.add('fade-up-2');
                } else if (line.classList.contains('visible')) {
                    line.classList.remove('visible');
                    line.classList.add('fade-up-1');
                }
            }
        });

        // Trigger animation
        setTimeout(() => {
            el.classList.add('visible');
        }, 50);

        // Calculate dynamic delay based on text length
        let delay = 2200; 
        if (text.length > 20) delay = 3200; 
        if (text.endsWith("..") || text.endsWith("...")) delay += 800; 
        if (text === "Happy Birthday Lily!") delay = 5000;
        
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

// Background Particles System
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.opacity = Math.random() * 0.5;
        this.fadeDir = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.opacity += 0.005 * this.fadeDir;
        if (this.opacity >= 0.6) this.fadeDir = -1;
        if (this.opacity <= 0.1) this.fadeDir = 1;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Final Confetti Effect
function fireSoftConfetti() {
    const colors = ['#ffffff', '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'];
    for (let i = 0; i < 120; i++) {
        setTimeout(() => {
            createGlowingOrb(colors[Math.floor(Math.random() * colors.length)]);
        }, Math.random() * 1500);
    }
}

function createGlowingOrb(color) {
    const particle = document.createElement('div');
    const size = Math.random() * 8 + 4;
    
    particle.style.position = 'fixed';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}`;
    particle.style.opacity = 1;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2 + 100;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 3 + Math.random() * 12;
    
    let x = startX;
    let y = startY;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 12; // strong initial upward burst
    let opacity = 1;
    
    const animate = () => {
        vy += 0.2; // gravity
        vx *= 0.98; // horizontal friction
        vy *= 0.98; // vertical friction
        
        x += vx;
        y += vy;
        opacity -= 0.005; // fade out
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    
    requestAnimationFrame(animate);
}
