import * as dat from "dat.gui";
import * as THREE from "three";
import "./style.css";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);

const partcilesGeometry = new THREE.BufferGeometry();
const particlesCnt = 50000;

const posArray = new Float32Array(particlesCnt * 3);

for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = ((Math.random() - 0.5) / Math.random()) * 9;
}

partcilesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

// Materials

const material = new THREE.PointsMaterial({
  size: 0.01,
  transparent: true,
  opacity: 0.3,
  color: 0xfeb139,
});

const lineMaterial = new THREE.PointsMaterial({
  transparent: true,
  opacity: 0.5,
  size: 0.01,
  color: 0xf55353,
});

// Mesh
const sphere = new THREE.Points(geometry, lineMaterial);
const particlesMesh = new THREE.Points(partcilesGeometry, material);
scene.add(sphere, particlesMesh);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x143f6b);

/**
 * Animate
 */

const clock = new THREE.Clock();
let yAcceleration = 0;
let mouseX = 0;
let mouseY = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.z = 0.5 * elapsedTime;
  partcilesGeometry.rotateX(0.001);

  // Update Orbital Controls
  // controls.update()

  if (yAcceleration > 0) {
    yAcceleration -= 0.0004;

    if (yAcceleration < 0) {
      yAcceleration = 0;
    }

    partcilesGeometry.rotateY(yAcceleration);
  }

  let torusScale = distanceFromCenter(mouseX, mouseY) * 2;

  if (torusScale > 1) {
    torusScale = 1;
  } else if (torusScale < 0.5) {
    torusScale = 0.5;
  }

  sphere.scale.x = torusScale;
  sphere.scale.y = torusScale;
  sphere.scale.z = torusScale;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

document.addEventListener("mousemove", (event) => {
  yAcceleration = 0.005;
  mouseX = event.clientX;
  mouseY = event.clientY;
});

tick();

function distanceFromCenter(x, y) {
  x = Math.abs(x - innerWidth / 2) / innerWidth;
  y = Math.abs(y - innerHeight / 2) / innerHeight;

  return Math.sqrt(x * x + y * y);
}

const putAroundZero = (x, y) => {
  return {
    x: Math.sin(x),
    y: Math.sin(y),
  };
};
