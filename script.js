
// import * as THREE from 'three';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement); 

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(1, 1, 1).normalize();
// scene.add(light);

// const controls = new OrbitControls(camera, renderer.domElement);

// camera.position.z = 200;

// //make the background white
// renderer.setClearColor(0xffffff, 1);

// //set this brain object to be pink
// const brainMaterial = new THREE.MeshStandardMaterial({color: 0xff00ff});
// const brain = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), brainMaterial);
// scene.add(brain);


// const loader = new GLTFLoader();
// loader.load('brain.glb', function(glb){
//     scene.add(glb.scene);
//     console.log(glb);
// },
// function ( xhr ){
//     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
// },function ( error ){
//     console.log( 'An error happened' + error);
// }
// );

// const loader1 = new THREE.TextureLoader();
// loader1.load('textures/gltf_embedded_0.png', function(texture){
//     brainMaterial.map = texture;
//     brainMaterial.needsUpdate = true;
// });


// function handleClick(event) {
//     const explanation = event.target.userData.explanation;
//     alert(explanation); // Show a popup or other UI element with the explanation
// }

// function animate() {
//     requestAnimationFrame(animate);
//     // controls.update();
//     renderer.render(scene, camera);
// }

// animate();

//version 2
// import * as THREE from 'three';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement); 

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(1, 1, 1).normalize();
// scene.add(light);

// const controls = new OrbitControls(camera, renderer.domElement);

// camera.position.z = 200;
// renderer.setClearColor(0xffffff, 1);

// // Raycaster for detecting mouse events
// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// // Placeholder for objects that can be clicked
// let clickableObjects = [];

// // Load the 3D brain model
// const loader = new GLTFLoader();
// loader.load('brain.glb', function(glb){
//     scene.add(glb.scene);
//     clickableObjects = glb.scene.children; // Save objects to be clickable
//     console.log(glb.scene);
// },
// function (xhr){
//     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
// },function (error){
//     console.log('An error happened: ' + error);
// });

// // Handle mouse movement and click detection
// function onMouseMove(event) {
//     // Convert mouse position to normalized device coordinates (-1 to +1)
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

// function onMouseClick(event) {
//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObjects(clickableObjects, true);
    
//     if (intersects.length > 0) {
//         const clickedObject = intersects[0].object;
//         showPopup(clickedObject.userData.explanation);
//     }
// }

// // Add event listeners for mouse move and click
// window.addEventListener('mousemove', onMouseMove);
// window.addEventListener('click', onMouseClick);

// // Function to show the popup
// function showPopup(explanation) {
//     if (explanation) {
//         alert(explanation); // For now, just show a basic alert
//     } else {
//         alert("No data available for this part of the brain.");
//     }
// }

// function animate() {
//     requestAnimationFrame(animate);
//     raycaster.setFromCamera(mouse, camera);
    
//     // Check for hover effects
//     const intersects = raycaster.intersectObjects(clickableObjects, true);
//     if (intersects.length > 0) {
//         const hoveredObject = intersects[0].object;
//         hoveredObject.material.emissive.setHex(0xff0000); // Change color on hover
//     }

//     renderer.render(scene, camera);
// }

// animate();

//version 3
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

//Add the same lighting all the way around the object 
const hemisphereLight1 = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
scene.add(hemisphereLight1);


// Add ambient light for better visibility
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 200;
renderer.setClearColor(0xffffff, 1);

// make background black instead of default white
 renderer.setClearColor(0x000000, 1);

// Raycaster for detecting mouse events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Placeholder for clickable regions
let clickableObjects = [];

// Load the 3D brain model
const loader = new GLTFLoader();
loader.load('lobes_brain_3d.glb', function(glb){
    const brainModel = glb.scene;
    scene.add(brainModel);

    // Set the material color to pink
    brainModel.traverse((node) => {
        if (node.isMesh) {
            node.material = new THREE.MeshStandardMaterial({ color: 0xffc0cb });
            // Check for specific region names or properties
            if (node.name === 'occipital' || node.name === 'frontal' || node.name === 'parietal' || node.name === 'temporal' || node.name === 'cerebellum') {
                // Apply a distinct material to highlight the region
                clickableObjects.push(node);
            }
        }
        
    });

    // Create clickable placeholder geometries for each brain region
    regions.forEach(region => {
        const geometry = new THREE.BoxGeometry(region.size.x, region.size.y, region.size.z);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, transparent: true, opacity: 0 });
        const regionMesh = new THREE.Mesh(geometry, material);
        regionMesh.position.set(region.position.x, region.position.y, region.position.z);
        regionMesh.userData = { name: region.name }; // Add region name as userData
        clickableObjects.push(regionMesh);
        brainModel.add(regionMesh); // Add regions as part of the brain model
    
    // Compute the bounding box of the model
    const box = new THREE.Box3().setFromObject(brainModel);
    const center = box.getCenter(new THREE.Vector3());

    // Set the target of the OrbitControls to the center of the model
    controls.target.copy(center);
    controls.update();
    });
    
    // Log helper positions on click
    window.addEventListener('click', () => {
        helpers.forEach(helper => {
            console.log(`${helper.userData.name} position:`, helper.position);
        });
    });
    
}, function(xhr){
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function(error){
    console.log('An error happened: ' + error);
});

// Handle mouse movement and click detection
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects, true);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        openModal(clickedObject.userData.name+"Modals"); // Show modal popup with the name of the region
    }
    
}

// Add event listeners for mouse move and click
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseClick);

/// Function to show the modal popup
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";
}

// Close modal when clicking the close button
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Find the closest modal-container (not just modal)
        const modalContent = button.closest('.modal-container');
        if (modalContent) {
            modalContent.style.display = "none";
        }
    });
});

// Close the modal when clicking outside the modal content
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal-container');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none"; // Close the modal if clicking outside content
        }
    });
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
