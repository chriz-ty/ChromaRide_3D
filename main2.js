import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createGround } from './ground2';

// Add video and canvas elements for color detection
const video = document.createElement('video');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.style.position = 'absolute';
canvas.style.bottom = '20px';
canvas.style.right = '20px';
canvas.style.width = '320px';
canvas.style.height = '240px';
canvas.width = 320;
canvas.height = 240;
document.body.appendChild(canvas);

// Setup webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function(err) {
    console.error("Error accessing webcam:", err);
  });

// Function to draw detection box
function drawDetectionBox() {
  const boxSize = 50; // Size of the detection box
  const x = (canvas.width - boxSize) / 2;
  const y = (canvas.height - boxSize) / 2;
  
  ctx.strokeStyle = '#00FF00'; // Green color
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, boxSize, boxSize);
}

// Function to get dominant color from video
function getDominantColor() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const boxSize = 50;
  const x = Math.floor((canvas.width - boxSize) / 2);
  const y = Math.floor((canvas.height - boxSize) / 2);
  
  const imageData = ctx.getImageData(x, y, boxSize, boxSize);
  const data = imageData.data;
  
  let r = 0, g = 0, b = 0;
  let samples = 0;
  
  // Sample only pixels that aren't too dark or too bright
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (brightness > 20 && brightness < 250) {  // Ignore very dark or very bright pixels
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      samples++;
    }
  }
  
  // Draw the detection box
  drawDetectionBox();
  
  // Add color preview
  ctx.fillStyle = `rgb(${r/samples}, ${g/samples}, ${b/samples})`;
  ctx.fillRect(10, canvas.height - 30, 20, 20);
  
  return {
    r: samples > 0 ? r / samples : 0,
    g: samples > 0 ? g / samples : 0,
    b: samples > 0 ? b / samples : 0
  };
}

// Store car materials for updating
let carMaterials = [];

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const ground = createGround();
scene.add(ground);

// Main spotlight from above
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.3, 0.5);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
spotLight.shadow.mapSize.width = 2048;  // Increased shadow resolution
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 100;
scene.add(spotLight);

// Reduced ambient light for more dramatic effect
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Reduced intensity
scene.add(ambientLight);

// Add subtle fog to the scene
scene.fog = new THREE.FogExp2(0x000000, 0.02);

// Add directional lights for better car details
const frontLight = new THREE.DirectionalLight(0xffffff, 1);
frontLight.position.set(0, 5, 10);
frontLight.castShadow = true;
scene.add(frontLight);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 5, -10);
backLight.castShadow = true;
scene.add(backLight);

// Add side lights for better material reflection
const leftLight = new THREE.DirectionalLight(0xffffff, 0.5);
leftLight.position.set(-10, 3, 0);
scene.add(leftLight);

const rightLight = new THREE.DirectionalLight(0xffffff, 0.5);
rightLight.position.set(10, 3, 0);
scene.add(rightLight);

// Add a subtle rim light
const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
rimLight.position.set(0, 2, -5);
scene.add(rimLight);

// Optional: Add helper to visualize light positions (remove in production)
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

const loader = new GLTFLoader().setPath('public/2018_audi_tt_rs/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Target the car paint material (Car_paint_flip_flop.001)
      if (child.material && child.material.name === 'Car_paint_flip_flop.001') {
        console.log('Found car body part:', child.name);
        
        // Create a new material with enhanced properties
        const carPaintMaterial = new THREE.MeshPhysicalMaterial({
          metalness: 0.9,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.5,
          color: new THREE.Color(0x888888).multiplyScalar(0.7),
          emissive: new THREE.Color(0x888888).multiplyScalar(0.2)
        });
        
        child.material = carPaintMaterial;
        carMaterials.push(carPaintMaterial);
      }
    }
  });

  // Adjust car position and scale
  mesh.position.set(0, 0.02, 0);  // Lowered Y position to sit on ground
  mesh.scale.set(0.7, 0.7, 0.7); // Adjusted scale for better proportions
  mesh.rotation.y = Math.PI;      // Rotate to face camera

  // Create a bounding box to help position the car
  const bbox = new THREE.Box3().setFromObject(mesh);
  const height = bbox.max.y - bbox.min.y;
  const centerY = (bbox.max.y + bbox.min.y) / 2;
  
  // Adjust position based on bounding box
  mesh.position.y = Math.abs(bbox.min.y) + 0.01; // Small offset to prevent z-fighting

  scene.add(mesh);
  console.log('Number of car paint materials:', carMaterials.length);
  console.log('Car height:', height);
  console.log('Car center Y:', centerY);

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

// Also adjust camera and controls for better view
camera.position.set(5, 3, 8); // Adjusted camera position
controls.target.set(0, 0.5, 0); // Look at the center of the car
controls.update();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Improved color update function with smoother transitions
let currentColor = new THREE.Color(0x888888);
const colorChangeSpeed = 0.1;

function updateCarColor(color) {
  // Intensify the colors by reducing the brightness
  const intensityFactor = 0.7; // Decrease this value to make colors darker
  const targetColor = new THREE.Color(
    (color.r / 255) * intensityFactor,
    (color.g / 255) * intensityFactor,
    (color.b / 255) * intensityFactor
  );

  // Smoothly interpolate to the new color
  currentColor.lerp(targetColor, colorChangeSpeed);

  carMaterials.forEach(material => {
    if (material) {
      // Update the material color
      material.color.copy(currentColor);
      
      // Adjust material properties for more intense look
      const brightness = (color.r + color.g + color.b) / (3 * 255);
      material.metalness = 0.9;  // Increased metalness
      material.roughness = 0.15;  // Decreased roughness for more shine
      material.clearcoat = 1.0;   // Maximum clearcoat
      material.clearcoatRoughness = 0.1;  // Smoother clearcoat
      material.envMapIntensity = 1.5;    // Increased environment map intensity
      
      // Add some emissive color for more intensity
      material.emissive = currentColor.clone().multiplyScalar(0.2);
      
      material.needsUpdate = true;
    }
  });
}

// Modified animate function with color detection threshold
function animate() {
  requestAnimationFrame(animate);
  
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const color = getDominantColor();
    
    // Only update color if the detected color is significantly different
    const threshold = 5; // Minimum RGB difference to trigger update
    const currentRGB = {
      r: currentColor.r * 255,
      g: currentColor.g * 255,
      b: currentColor.b * 255
    };
    
    if (Math.abs(color.r - currentRGB.r) > threshold ||
        Math.abs(color.g - currentRGB.g) > threshold ||
        Math.abs(color.b - currentRGB.b) > threshold) {
      updateCarColor(color);
      
      // Debug: Log the color being applied
      console.log('Applying color:', 
        Math.round(color.r), 
        Math.round(color.g), 
        Math.round(color.b)
      );
    }
  }
  
  controls.update();
  renderer.render(scene, camera);
}

animate();