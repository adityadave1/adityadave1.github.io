import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
// Add some fog for depth
scene.fog = new THREE.FogExp2(0x050510, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// Enable shadow map for better visuals (if we add shadows later)
renderer.shadowMap.enabled = true;

document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- Lighting ---
// Main Directional Light (Sun)
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);

// Accent Light (Pink/Purple)
const accentLight = new THREE.PointLight(0xff00ba, 5, 100);
accentLight.position.set(-10, 5, 10);
scene.add(accentLight);

// Blue Rim Light
const rimLight = new THREE.SpotLight(0x00f0ff, 5);
rimLight.position.set(0, 10, -10);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// --- Particles Background ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);
const originalPosArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;

    posArray[i] = x;
    posArray[i + 1] = y;
    posArray[i + 2] = z;

    originalPosArray[i] = x;
    originalPosArray[i + 1] = y;
    originalPosArray[i + 2] = z;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create a simple circular texture programmatically
const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const context = canvas.getContext('2d');
const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
gradient.addColorStop(0, 'rgba(255,255,255,1)');
gradient.addColorStop(0.2, 'rgba(0,240,255,1)');
gradient.addColorStop(0.5, 'rgba(0,0,50,1)');
gradient.addColorStop(1, 'rgba(0,0,0,0)');
context.fillStyle = gradient;
context.fillRect(0, 0, 32, 32);

const particleTexture = new THREE.CanvasTexture(canvas);

const particlesMaterial = new THREE.PointsMaterial({
    size: 6,
    map: particleTexture,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 50;
controls.maxDistance = 500;

camera.position.z = 220;
camera.position.x = 50;
camera.position.y = 20;

// --- Load Brain Model ---
const loader = new GLTFLoader();
let brainModel = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoverObject = null;

// Map lobe names to nice display titles
const lobeTitles = {
    'frontal': 'Entrepreneurship & Leadership',
    'parietal': 'Engineering & Design',
    'temporal': 'Arts & Academics',
    'occipital': 'Research & Discovery',
    'cerebellum': 'Clinical Work and Service'
};

// Material presets
const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9
});

const hoverMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x001020,
    roughness: 0.2,
    metalness: 0.5,
    transparent: true,
    opacity: 1
});

loader.load('lobes_brain_3d.glb', function (glb) {
    brainModel = glb.scene;
    scene.add(brainModel);

    // Initial Material Setup
    brainModel.traverse((node) => {
        if (node.isMesh) {
            // Clone material so we can change them individually
            node.material = baseMaterial.clone();
            // Assign custom colors based on lobe if desired, or keep uniform
            if (node.name.includes('frontal')) node.material.color.setHex(0xff00ba); // Pink
            if (node.name.includes('parietal')) node.material.color.setHex(0x00ff9d); // Green
            if (node.name.includes('temporal')) node.material.color.setHex(0xffd700); // Gold
            if (node.name.includes('occipital')) node.material.color.setHex(0x00f0ff); // Blue
            if (node.name.includes('cerebellum')) node.material.color.setHex(0xff4040); // Red

            node.userData.originalColor = node.material.color.getHex();
        }
    });

    // Center the model
    const box = new THREE.Box3().setFromObject(brainModel);
    const center = box.getCenter(new THREE.Vector3());
    controls.target.copy(center);

    // Boot Sequence Integration
    // Only reveal if boot is visually complete? 
    // For now, we let the boot screen cover the load time.
    // The CSS animation takes ~3.5s.

    // Trigger visual brain entrance?
    brainModel.scale.set(0, 0, 0);
    // Simple grow animation would require Tweening lib or custom loop logic
    // We'll just set it for now.
    brainModel.scale.set(1, 1, 1);

}, undefined, function (error) {
    console.error('An error happened', error);
});


// --- Interaction Logic ---
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Hover Effect
    if (brainModel) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(brainModel.children, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (hoverObject !== object) {
                // Reset previous
                if (hoverObject) hoverObject.material.emissive.setHex(0x000000);

                // Set new
                hoverObject = object;
                hoverObject.material.emissive.setHex(0x333333); // Subtle glow
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (hoverObject) {
                hoverObject.material.emissive.setHex(0x000000);
                hoverObject = null;
                document.body.style.cursor = 'default';
            }
        }
    }

}


function onMouseClick(event) {
    if (hoverObject) {
        let lobeName = hoverObject.name.toLowerCase();

        // Normalize names just in case 
        if (lobeName.includes('frontal')) lobeName = 'frontal';
        else if (lobeName.includes('parietal')) lobeName = 'parietal';
        else if (lobeName.includes('temporal')) lobeName = 'temporal';
        else if (lobeName.includes('occipital')) lobeName = 'occipital';
        else if (lobeName.includes('cerebellum')) lobeName = 'cerebellum';

        openDrawer(lobeName);
    }
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseClick);


// --- UI / Drawer Logic ---
window.openDrawer = function (category) {
    const drawer = document.getElementById('info-drawer');
    const drawerTitle = document.getElementById('drawer-title');
    const drawerBody = document.getElementById('drawer-body');
    const dataSource = document.querySelector(`div[data-category="${category}"]`);

    if (dataSource) {
        drawerTitle.innerText = lobeTitles[category] || category.toUpperCase();
        drawerBody.innerHTML = dataSource.innerHTML; // Inject content

        drawer.classList.add('active');
        document.body.classList.add('drawer-open');

        // Shift camera if needed (optional simple tween could go here)
    }
}

document.getElementById('drawer-close').addEventListener('click', () => {
    document.getElementById('info-drawer').classList.remove('active');
    document.body.classList.remove('drawer-open');
});

// --- Profile Mode Logic ---
window.toggleProfile = function (show) {
    const overlay = document.getElementById('profile-overlay');
    const drawer = document.getElementById('info-drawer');

    if (show) {
        overlay.classList.add('active');
        // Close drawer if open
        if (drawer.classList.contains('active')) {
            drawer.classList.remove('active');
            document.body.classList.remove('drawer-open');
        }
    } else {
        overlay.classList.remove('active');
    }
}

// --- Boot Sequence Logic ---
window.addEventListener('load', () => {
    const progressBar = document.querySelector('.fill');
    if (progressBar) {
        setTimeout(() => { progressBar.style.width = '40%'; }, 500);
        setTimeout(() => { progressBar.style.width = '80%'; }, 1500);
        setTimeout(() => { progressBar.style.width = '100%'; }, 2500);

        // End Boot
        setTimeout(() => {
            const bootScreen = document.getElementById('boot-screen');
            if (bootScreen) {
                bootScreen.style.opacity = '0';
                setTimeout(() => { bootScreen.style.display = 'none'; }, 1000);
            }
        }, 3200);
    }
});

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

    // Particle Float (Passive only)
    if (particlesMesh) {
        // Slowly rotate entire system
        particlesMesh.rotation.y += 0.0002;
        // Gentle wave motion
        particlesMesh.position.y = Math.sin(Date.now() * 0.0005) * 5;
    }
}

animate();
