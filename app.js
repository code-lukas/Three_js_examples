import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

let container;
let camera, cameraTarget, scene, renderer;
let mesh; // Declare mesh globally

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
    camera.position.set(3, 0.15, 3);

    cameraTarget = new THREE.Vector3(0, -0.25, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x72645b, 2, 15);

    // Ground

    const loader = new STLLoader();

    loader.load('http://localhost:8000/test.stl', function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        mesh = new THREE.Mesh(geometry, material); // Assign to global variable
        mesh.position.set(0, 0, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    });

    // Lights

    scene.add(new THREE.HemisphereLight(0x8d7c7c, 0x494966, 3));

    addShadowedLight(1, 1, 1, 0xffffff, 3.5);
    addShadowedLight(0.5, 1, -1, 0x454545, 3);

    // Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    // Controls

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = true;
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function addShadowedLight(x, y, z, color, intensity) {
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = -0.002;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    if (mesh) { // Check if mesh is defined
        const timer = Date.now() * 0.0005;
        mesh.rotation.x = Math.cos(timer);
        mesh.rotation.y = Math.cos(timer);
        mesh.rotation.z = Math.sin(timer);
    }

    renderer.render(scene, camera);
}
