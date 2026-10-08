import * as THREE from 'three';
import { VexoraEngine } from './VexoraEngine';
import { PlayerController } from './Player';

const engine = new VexoraEngine();
const player = new PlayerController(engine.getScene());

const input: Record<string, boolean> = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false,
};

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'w') input.w = true;
  if (key === 'a') input.a = true;
  if (key === 's') input.s = true;
  if (key === 'd') input.d = true;
  if (key === ' ') {
    input.space = true;
    event.preventDefault();
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'w') input.w = false;
  if (key === 'a') input.a = false;
  if (key === 's') input.s = false;
  if (key === 'd') input.d = false;
  if (key === ' ') input.space = false;
});

document.addEventListener('click', () => {
  const root = document.getElementById('canvas-root');
  if (root) root.requestPointerLock();
});

document.addEventListener('mousemove', (event) => {
  const root = document.getElementById('canvas-root');
  if (document.pointerLockElement === root) {
    player.onMouseMove(event.movementX, event.movementY);
  }
});

const fpsEl = document.getElementById('fps');
const posEl = document.getElementById('position');

const clock = new THREE.Clock();
let frameCounter = 0;
let lastFpsTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  player.update(input, delta);
  engine.update(delta);
  engine.render();

  frameCounter += 1;
  const now = performance.now();
  if (now - lastFpsTime >= 1000) {
    fpsEl!.textContent = `FPS: ${frameCounter}`;
    frameCounter = 0;
    lastFpsTime = now;
  }

  const p = player.getPosition();
  posEl!.textContent = `Position: ${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}`;
}

animate();
