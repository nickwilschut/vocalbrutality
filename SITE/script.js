/* script.js
 - Multi-layer animated visualizer (zonder audio afhankelijkheid)
 - Parallax scroll voor logo en achtergrond.
 - Glitch- en fade-in effecten.
 - Subtiele frequentielijnen als achtergronddecor.
*/

const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d', {
    alpha: true
});

// parallax elementen
const logo = document.getElementById('logo');
const heroContent = document.getElementById('heroContent');

// canvas responsive
function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resize);
resize();

/* ===== MULTI-LAYER VISUALIZER ===== */
const layers = [{
        speed: 0.9,
        heightMult: 0.6,
        alpha: 0.22,
        lineWidth: 3.0,
        colorOffset: 0
    },
    {
        speed: 1.7,
        heightMult: 0.9,
        alpha: 0.18,
        lineWidth: 4.2,
        colorOffset: 20
    },
    {
        speed: 1.25,
        heightMult: 0.45,
        alpha: 0.14,
        lineWidth: 2.2,
        colorOffset: 60
    },
    {
        speed: 2.25,
        heightMult: 1.15,
        alpha: 0.12,
        lineWidth: 5.0,
        colorOffset: 100
    },
];

let time = 0;

function lerpColor(t) {
    const a1 = [0, 191, 255];
    const a2 = [0, 51, 102];
    return `rgba(${Math.round(a1[0] + (a2[0] - a1[0]) * t)},${Math.round(a1[1] + (a2[1] - a1[1]) * t)},${Math.round(a1[2] + (a2[2] - a1[2]) * t)},`;
}

function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, 'rgba(0,0,0,0)');
    bgGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const points = Math.max(80, Math.floor(w / 10));

    layers.forEach((layer, idx) => {
        ctx.beginPath();
        ctx.lineWidth = layer.lineWidth;

        const t = (Math.sin(time * 0.002 * layer.speed + layer.colorOffset) + 1) / 2;
        const colorBase = lerpColor(t);
        const alpha = layer.alpha;
        ctx.strokeStyle = colorBase + alpha + ')';
        ctx.fillStyle = colorBase + (alpha * 0.09) + ')';
        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < points; i++) {
            const waveNoise = Math.sin(i * 0.15 + time * 0.005 * layer.speed + idx) * 0.5;
            const wave = Math.sin((i / points) * Math.PI * 2 * layer.speed + time * 0.0015 * layer.speed + idx * 0.8);
            const amplitude = (0.3 + waveNoise) * layer.heightMult * h * 0.4;
            const y = (h / 2) + wave * (40 + amplitude);
            const x = (i / points) * w;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.lineTo(w, h + 600);
        ctx.lineTo(0, h + 600);
        ctx.closePath();
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
    });

    // subtiele witte textuurlijn
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(248,248,248,0.04)';
    for (let i = 0; i < points; i++) {
        const v = Math.sin(i * 0.1 + time * 0.002);
        const px = (i / points) * w;
        const py = (h / 2) + v * h * 0.05;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    time += 1;
    requestAnimationFrame(draw);
}
draw();

/* ===== PARALLAX SCROLL ===== */
function handleParallax() {
    const scrolled = window.scrollY || window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroRect = hero.getBoundingClientRect();
    const heroTop = Math.max(0, -heroRect.top);

    const logoParallax = Math.min(80, heroTop * 0.18);
    logo.style.transform = `translateY(${logoParallax}px)`;
    heroContent.style.transform = `translateY(${logoParallax * 0.22}px)`;
}

window.addEventListener('scroll', handleParallax, {
    passive: true
});
window.addEventListener('resize', handleParallax);
handleParallax();

/* ===== JAAR UPDATEN ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== GLITCH EFFECT ===== */
function startLogoGlitch() {
    const wrapper = document.querySelector('.logo-glitch-wrapper');
    const originalLogo = document.getElementById('logo');

    const redLayer = document.createElement('div');
    redLayer.className = 'glitch-layer';

    const blueLayer = document.createElement('div');
    blueLayer.className = 'glitch-layer';

    wrapper.appendChild(redLayer);
    wrapper.appendChild(blueLayer);

    function glitchFrame() {
        const layers = [redLayer, blueLayer];
        layers.forEach(layer => {
            const offsetX = Math.floor(Math.random() * 20) - 10;
            const offsetY = Math.floor(Math.random() * 10) - 5;
            const clipTop = Math.floor(Math.random() * originalLogo.height * 0.5);
            const clipHeight = Math.floor(Math.random() * originalLogo.height * 0.2) + 5;
            layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            layer.style.clip = `rect(${clipTop}px, ${originalLogo.width}px, ${clipTop + clipHeight}px, 0px)`;
        });
        setTimeout(glitchFrame, Math.random() * 150);
    }

    glitchFrame();
}
window.addEventListener('load', startLogoGlitch);

/* ===== FADE-IN EN SLIDE-IN ===== */
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".fade-in, .slide-in");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        }
    );
    elements.forEach((el) => observer.observe(el));
});

/* ===== SUBTIELE FREQUENTIE-LIJNEN ACHTERGROND ===== */
const freqCanvas = document.getElementById('freqLines');
const fctx = freqCanvas.getContext('2d', {
    alpha: true
});

function resizeFreq() {
    freqCanvas.width = window.innerWidth * devicePixelRatio;
    freqCanvas.height = window.innerHeight * devicePixelRatio;
    fctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resizeFreq);
resizeFreq();

let freqTime = 0;
const freqParticles = [];
const maxFreqParticles = 300;
const lineCount = 5;

function initFreqParticles() {
    for (let i = 0; i < maxFreqParticles; i++) {
        const isBlue = Math.random() < 0.6;
        const alpha = 0.05 + Math.random() * 0.25;
        freqParticles.push({
            x: Math.random() * freqCanvas.width,
            layer: Math.floor(Math.random() * lineCount),
            speed: 0.1 + Math.random() * 1.2,
            size: 1 + Math.random() * 3,
            color: isBlue ?
                `rgba(0,191,255,${alpha})` : `rgba(255,255,255,${alpha})`
        });
    }
}
initFreqParticles();

function drawFreq() {
    const w = freqCanvas.clientWidth;
    const h = freqCanvas.clientHeight;

    fctx.fillStyle = 'rgba(0,0,0,0.15)';
    fctx.fillRect(0, 0, w, h);

    const yPositions = [];
    for (let l = 0; l < lineCount; l++) {
        yPositions[l] = [];
        const intensity = 1 + l * 0.3;
        const yBase = h / 2 + (l - Math.floor(lineCount / 2)) * 25;
        const amp = 70 * intensity;
        const freq = 0.01 + l * 0.006;

        for (let x = 0; x < w; x += 5) {
            const wave =
                Math.sin((x * freq) + freqTime * 0.05 * (1 + l)) *
                Math.cos(x * 0.003 + freqTime * 0.1) * amp;
            yPositions[l].push(yBase + wave);
        }
    }

    freqParticles.forEach(p => {
        const lineY = yPositions[p.layer];
        if (!lineY) return;
        const idx = Math.floor(p.x / 5) % lineY.length;
        const y = lineY[idx];

        fctx.beginPath();
        fctx.fillStyle = p.color;
        fctx.shadowBlur = 8 + Math.random() * 8;
        fctx.shadowColor = p.color;
        fctx.arc(p.x, y, p.size, 0, Math.PI * 2);
        fctx.fill();
        fctx.shadowBlur = 0;

        p.x += p.speed;
        if (p.x > w) p.x = 0;
    });

    freqTime += 0.3;
    requestAnimationFrame(drawFreq);
}
drawFreq();