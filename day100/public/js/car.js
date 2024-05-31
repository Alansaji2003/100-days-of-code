import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import * as THREE from 'three';

const loader = new GLTFLoader();
const fontLoader = new FontLoader(); 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const carElement = document.querySelector(".car");
renderer.setSize(window.innerWidth - 10, window.innerHeight);
renderer.setClearColor(0xFFD700);

carElement.appendChild(renderer.domElement);
// Add a light source
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

// Add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

let model_md;
let model_lg;
let model_car;
loader.load('3D/sm_car/sm.gltf', function(gltf) {
    model_car = gltf.scene;

    // Scale the model
    model_car.scale.set(2, 2, 2);

    // Create a group and add the car model to it
    scene.add(model_car);

    model_car.position.x = -9;
    model_car.position.z = 4;
    model_car.position.y = -2;
}, undefined, function(error) {
    console.error(error);
});

loader.load('3D/md_car/md.gltf', function(gltf) {
    model_md = gltf.scene;

    // Scale the model
    model_md.scale.set(1.2, 1.2, 1.2); 
    model_md.position.x = 0;
    model_md.position.y = -0.5;
    scene.add(model_md);
}, undefined, function(error) {
    console.error(error);
});

loader.load('3D/lg_car/lg.gltf', function(gltf) {
    model_lg = gltf.scene;

    // Scale the model
    model_lg.scale.set(1.2, 1.2, 1.2);
    model_lg.position.x = 6;
    model_lg.position.z = -7;
    model_lg.position.y = -2;
    scene.add(model_lg);
}, undefined, function(error) {
    console.error(error);
});

// Set up camera position
camera.position.x = 4;
camera.position.z = 5;
camera.position.y = 0;
camera.lookAt(0, 0, 0); 

// Load the font
fontLoader.load('fonts/helvet.typeface.json', function(font) {
    // Create text geometry
    const textGeometry = new TextGeometry('Transport Options', {
        font: font,
        size: 0.5, 
        depth: 0.01, 
        curveSegments: 10,
        bevelEnabled: false 
    });

    // Create material for the text
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00000 }); 

    // Create mesh for the text
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Position the text
    textMesh.position.set(-1.3, 2.5, 2); 
    textMesh.rotation.y = 0.6;
    textMesh.rotation.z = -0.03;

    // Add text mesh to the scene
    scene.add(textMesh);
});

function animate() {
    requestAnimationFrame(animate);

    // Rotate car model
    if (model_car) {
        model_car.rotation.y += 0.003;
    }

    // Rotate set model
    if (model_md) {
        model_md.rotation.y += 0.003;
    }
    if (model_lg) {
        model_lg.rotation.y += 0.003;
    }

    renderer.render(scene, camera);
}
animate();