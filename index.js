// ── Carrusel de imágenes — index.html ──────────────────────────────────────

const radios = document.querySelectorAll('input[name="slider"]');
const flechas = document.querySelectorAll('.arrows label');
const dots = document.querySelectorAll('.navigation .dot');
const slidesContainer = document.querySelector('.slides');

let currentSlide = 0;
let autoPlayInterval;
const totalSlides = radios.length;

function irASlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    slidesContainer.style.transform = `translateX(-${index * 33.333}%)`;
    radios[index].checked = true;
}

function siguienteSlide() { irASlide(currentSlide + 1); }
function anteriorSlide()  { irASlide(currentSlide - 1); }

function iniciarAutoplay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(siguienteSlide, 5000);
}

function detenerAutoplay() {
    clearInterval(autoPlayInterval);
    setTimeout(iniciarAutoplay, 10000);
}

flechas.forEach(flecha => {
    flecha.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId    = this.getAttribute('for');
        const targetIndex = parseInt(targetId.replace('slide', '')) - 1;
        if (this.classList.contains('prev')) {
            if (targetIndex === currentSlide - 1 ||
                (currentSlide === 0 && targetIndex === totalSlides - 1)) {
                irASlide(targetIndex);
            }
        } else {
            if (targetIndex === currentSlide + 1 ||
                (currentSlide === totalSlides - 1 && targetIndex === 0)) {
                irASlide(targetIndex);
            }
        }
        detenerAutoplay();
    });
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', function(e) {
        e.preventDefault();
        irASlide(index);
        detenerAutoplay();
    });
});

irASlide(0);
iniciarAutoplay();

// ── Terminal Typewriter ──────────────────────────────────────────────────────
const termLines = [
    { cls: 'cmd',   text: '$ ./hello_world --info' },
    { cls: 'out',   text: '❯ Club tecnológico de élite · FES Aragón UNAM' },
    { cls: 'blank', text: '' },
    { cls: 'cmd',   text: '$ ./hello_world --stack' },
    { cls: 'out',   text: '❯ Python · JavaScript · C++ · AI/ML · Web Dev' },
    { cls: 'blank', text: '' },
    { cls: 'cmd',   text: '$ ./hello_world --mission' },
    { cls: 'out',   text: '❯ "Competir y ganar los retos más grandes"' },
    { cls: 'blank', text: '' },
    { cls: 'cmd',   text: '$ ./hello_world --status' },
    { cls: 'out',   text: '● ACTIVO  ·  Ciclo 2025–2026' },
];

function runTerminal() {
    const output = document.getElementById('hw-terminal-output');
    if (!output) return;

    let lineIdx = 0;

    function typeLine(line, callback) {
        const span = document.createElement('span');
        span.className = 'hw-line ' + line.cls;
        output.appendChild(span);

        if (line.cls === 'blank') {
            setTimeout(callback, 180);
            return;
        }

        let charIdx = 0;
        const charDelay = line.cls === 'cmd' ? 42 : 16;

        function typeChar() {
            if (charIdx < line.text.length) {
                span.textContent += line.text[charIdx++];
                setTimeout(typeChar, charDelay + Math.random() * 18);
            } else {
                span.textContent += '\n';
                setTimeout(callback, line.cls === 'cmd' ? 280 : 120);
            }
        }
        typeChar();
    }

    function nextLine() {
        if (lineIdx >= termLines.length) return;
        typeLine(termLines[lineIdx++], nextLine);
    }

    setTimeout(nextLine, 700);
}

// ── Counters (animate on scroll into view) ───────────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const startTime = performance.now();

    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased    = 1 - Math.pow(2, -10 * progress);   // easeOutExpo
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(step);
}

function initCounters() {
    const counters = document.querySelectorAll('.hw-stat-num');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

runTerminal();
initCounters();
