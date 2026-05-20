import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Cinematic page loader ────────────────────────────────────────────────────
const loader = document.createElement('div');
loader.id = 'kb-loader';
loader.style.cssText = `
  position:fixed;inset:0;z-index:99999;
  background:#060402;
  display:flex;align-items:center;justify-content:center;
  flex-direction:column;gap:20px;
  overflow:hidden;
`;

loader.innerHTML = `
  <div id="kb-logo" style="
    font-family:'Playfair Display',serif;
    font-size:clamp(2rem,5vw,3.5rem);
    font-weight:700;font-style:italic;
    background:linear-gradient(135deg,#C9973A,#F0CC6E,#9A6E18);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;letter-spacing:-0.02em;
    opacity:0;transform:translateY(30px);
  ">Krishna Bakers</div>
  <div id="kb-tagline" style="
    font-family:'Inter',sans-serif;font-size:11px;
    letter-spacing:0.5em;text-transform:uppercase;
    color:rgba(212,168,67,0.45);
    opacity:0;transform:translateY(20px);
  ">Est. 2026 · Artisan Bakery · India</div>
  <div style="width:160px;height:1px;background:rgba(212,168,67,0.1);overflow:hidden;border-radius:4px;margin-top:8px;">
    <div id="kb-bar" style="height:100%;width:0%;background:linear-gradient(to right,#C9973A,#F0CC6E);border-radius:4px;"></div>
  </div>
`;
document.body.appendChild(loader);

// animate in
const logo    = loader.querySelector('#kb-logo');
const tagline = loader.querySelector('#kb-tagline');
const bar     = loader.querySelector('#kb-bar');

gsap.to(logo,    { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: 'expo.out' });
gsap.to(tagline, { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: 'expo.out' });
gsap.to(bar,     { width: '100%', duration: 1.2, delay: 0.3, ease: 'power2.inOut' });

// remove loader
setTimeout(() => {
  gsap.to('#kb-loader', {
    opacity: 0, duration: 0.7, ease: 'power2.inOut',
    onComplete: () => { loader.remove(); triggerPageEntrance(); },
  });
}, 1800);

// ── Page entrance — text from different sides on every load ──────────────────
function triggerPageEntrance() {
  // random direction each load
  const dirs = [
    { x: -80, y: 0 }, { x: 80, y: 0 },
    { x: 0, y: 60 },  { x: 0, y: -60 },
    { x: -60, y: 40 },{ x: 60, y: -40 },
  ];
  const pick = () => dirs[Math.floor(Math.random() * dirs.length)];

  const d1 = pick(), d2 = pick(), d3 = pick();

  gsap.fromTo('.h-line1',
    { x: d1.x, y: d1.y + 80, opacity: 0, skewY: 4 },
    { x: 0, y: 0, opacity: 1, skewY: 0, duration: 1.3, ease: 'expo.out', delay: 0.1 });

  gsap.fromTo('.h-line2',
    { x: d2.x, y: d2.y + 80, opacity: 0, skewY: 4 },
    { x: 0, y: 0, opacity: 1, skewY: 0, duration: 1.3, ease: 'expo.out', delay: 0.25 });

  gsap.fromTo('.h-eyebrow',
    { x: d3.x, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.1 });

  gsap.fromTo('.h-desc',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 });

  gsap.fromTo('.h-cta',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.65 });

  gsap.fromTo('.h-stat',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.8, stagger: 0.1 });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
