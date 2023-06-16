import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';

// Select the container for the scene
const container = document.getElementById('container');


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);


const loader = new THREE.TextureLoader();
const texture = loader.load('pana.jpeg');


const geometry = new THREE.SphereGeometry(500, 60, 40);


geometry.scale(-1, 1, 1);

const material = new THREE.MeshBasicMaterial({
    map: texture
});

const sphere = new THREE.Mesh(geometry, material);

// opacity
sphere.material.transparent = true;
sphere.material.opacity = 0.7; 

scene.add(sphere);

//camera and controls
camera.position.set(0, 0, 0.1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

controls.rotateSpeed = -0.3;

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

//loop animasi
let lastTime = 0;
const rotationSpeed = -0.00005;

function animate(time) {
    const delta = time - lastTime;
    lastTime = time;
    requestAnimationFrame(animate);

    sphere.rotation.y += rotationSpeed * delta;

    controls.update();
    renderer.render(scene, camera);
}

animate(0);






