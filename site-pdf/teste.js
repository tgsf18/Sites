// --- CONTROLE DE SLIDES ---
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
  if (index >= 0 && index < slides.length) {
    slides[index].scrollIntoView({ behavior: 'smooth' });
    currentSlide = index;
  }
}

// --- CENA 3D THREE.JS ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// --- PARTÍCULAS ---
const particleCount = 8000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 30; // antes era 10 — aumentei pra cobrir a tela
  positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.center(); // centraliza o grupo no meio da cena

const material = new THREE.PointsMaterial({
  color: 0xaa66ff,
  size: 0.05,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);
camera.position.z = 10; // um pouco mais distante, mas proporcional ao novo volume

// --- EFEITOS GSAP ---
function reform() {
  gsap.to(particles.rotation, { y: 0, duration: 2, ease: "power2.inOut" });
  gsap.to(particles.position, { z: 0, duration: 2, ease: "power2.inOut" });
  gsap.to(material, { opacity: 1, duration: 2, ease: "power1.out" });
}

function explode() {
  gsap.to(particles.rotation, { y: Math.PI * 2, duration: 2, ease: "power2.inOut" });
  gsap.to(particles.position, { z: 2, duration: 2, ease: "power2.inOut" });
  gsap.to(material, { opacity: 0.3, duration: 2, ease: "power1.out" });
}

let exploded = false;

// --- BOTAO SETAS ---
document.querySelector('.prev').addEventListener('click', () => {
  showSlide(currentSlide - 1);
  exploded ? reform() : explode();
  exploded = !exploded;
});

document.querySelector('.next').addEventListener('click', () => {
  showSlide(currentSlide + 1);
  exploded ? reform() : explode();
  exploded = !exploded;
});

// --- PASSAR COM O TECLADO ---
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    showSlide(currentSlide - 1); 
    exploded ? reform() : explode();
    exploded = !exploded;
  } else if (event.key === 'ArrowRight') {
    showSlide(currentSlide + 1);
    exploded ? reform() : explode();
    exploded = !exploded;
  }
});

// --- LOOP DE ANIMAÇÃO ---
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.x += 0.001;
  renderer.render(scene, camera);
}
animate();

// --- AJUSTE RESPONSIVO ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
