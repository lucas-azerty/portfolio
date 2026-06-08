/* ============================================================
   Portfolio Lucas Richier — script.js
   Interactions & animations avancées
   ============================================================ */

/* ─── 1. CURSEUR PERSONNALISÉ ─────────────────────────────── */
const cursor      = document.createElement('div');
const cursorDot   = document.createElement('div');
cursor.classList.add('custom-cursor');
cursorDot.classList.add('custom-cursor-dot');
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

(function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .skill-item, .experience-card, .realisation-card, .school-item, .certifications-row img')
  .forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',  () => cursor.classList.remove('cursor-hover'));
  });


/* ─── 2. BARRE DE PROGRESSION DE LECTURE ─────────────────── */
const progressBar = document.createElement('div');
progressBar.classList.add('read-progress');
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
});


/* ─── 3. NAVIGATION ACTIVE (highlight de section courante) ── */
const navLinks   = document.querySelectorAll('nav ul li a');
const sections   = document.querySelectorAll('section[id]');

const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`nav ul li a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observerNav.observe(s));


/* ─── 4. APPARITION AU SCROLL ─────────────────────────────── */
const revealElements = document.querySelectorAll(
  '.school-item, .experience-card, .skill-item, .realisation-card, .about-content, .certifications-row img'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));


/* ─── 5. EFFET TYPING SUR LE TITRE HERO ───────────────────── */
const megaTitle = document.querySelector('.mega-title');
if (megaTitle) {
  const originalText = megaTitle.textContent.trim();
  megaTitle.textContent = '';
  megaTitle.style.borderRight = '3px solid #4db5ff';
  megaTitle.style.whiteSpace  = 'normal';

  let charIndex = 0;
  const speed   = 45; // ms par caractère

  function typeChar() {
    if (charIndex < originalText.length) {
      megaTitle.textContent += originalText[charIndex];
      charIndex++;
      setTimeout(typeChar, speed);
    } else {
      // Curseur clignotant puis disparaît
      setTimeout(() => { megaTitle.style.borderRight = 'none'; }, 1200);
    }
  }

  setTimeout(typeChar, 500);
}


/* ─── 6. PARTICULES FLOTTANTES DANS LE HERO ──────────────── */
const welcomeSection = document.querySelector('.welcome');
if (welcomeSection) {
  const canvas = document.createElement('canvas');
  canvas.classList.add('particles-canvas');
  welcomeSection.appendChild(canvas);

  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = welcomeSection.offsetWidth;
    H = canvas.height = welcomeSection.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 2 + 0.5;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.alpha= Math.random() * 0.5 + 0.15;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77, 181, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  // Lignes entre particules proches
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(77, 181, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}


/* ─── 7. COMPTEUR ANIMÉ DANS LES CARTES COMPÉTENCES ──────── */
function animateCount(el, target, duration = 1200) {
  let start    = null;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + '%';
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Données de niveau par compétence
const skillLevels = {
  'Développement Web'     : 80,
  'PHP / SQL'             : 70,
  'Architecture Logicielle': 65,
  'Bases de Données'      : 72,
  'Gestion de Version (Git)': 78,
  'Gestion de Projet'     : 75,
};

document.querySelectorAll('.skill-item').forEach(card => {
  const name  = card.querySelector('.skill-name')?.textContent.trim();
  const level = skillLevels[name];
  if (!level) return;

  // Barre de progression
  const bar = document.createElement('div');
  bar.classList.add('skill-bar-wrap');
  bar.innerHTML = `
    <div class="skill-bar-track">
      <div class="skill-bar-fill" data-target="${level}"></div>
    </div>
    <span class="skill-pct">0%</span>`;
  card.appendChild(bar);

  const fill = bar.querySelector('.skill-bar-fill');
  const pct  = bar.querySelector('.skill-pct');

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fill.style.width = level + '%';
        animateCount(pct, level);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  barObserver.observe(card);
});


/* ─── 8. BOUTON RETOUR EN HAUT ────────────────────────────── */
const backTop = document.createElement('button');
backTop.classList.add('back-to-top');
backTop.setAttribute('aria-label', 'Retour en haut');
backTop.innerHTML = '↑';
document.body.appendChild(backTop);

window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─── 9. TOOLTIP AU SURVOL DES CERTIFICATIONS ────────────── */
const certLabels = [
  'Community Manager',
  'Sécurité Informatique',
  'Droit Numérique',
  'Intrusion Web',
  'Certification 2026',
];

document.querySelectorAll('.certifications-row img').forEach((img, i) => {
  img.setAttribute('data-tooltip', certLabels[i] ?? img.alt);

  const tip = document.createElement('div');
  tip.classList.add('cert-tooltip');
  tip.textContent = certLabels[i] ?? img.alt;
  img.parentElement.style.position = 'relative';
  img.parentElement.insertBefore(tip, img.nextSibling);

  img.addEventListener('mouseenter', () => tip.classList.add('visible'));
  img.addEventListener('mouseleave',  () => tip.classList.remove('visible'));
});


/* ─── 10. LIEN DE NAV — SCROLL FLUIDE + EFFET RIPPLE ─────── */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ─── 11. TILT 3D SUR LES CARTES RÉALISATIONS ────────────── */
document.querySelectorAll('.realisation-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width  / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    const rotX   = (-y / rect.height * 10).toFixed(2);
    const rotY   = ( x / rect.width  * 10).toFixed(2);
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ─── 12. GLITCH HOVER SUR LE LOGO ───────────────────────── */
const logo = document.querySelector('.logo');
if (logo) {
  logo.setAttribute('data-text', logo.textContent);
}