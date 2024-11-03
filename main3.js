import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ColorDetector } from './colorDetector3';

let carMaterials = [];
let colorDetector;

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
camera.position.set(8, 4, 8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
controls.minPolarAngle = 0.3;
controls.maxPolarAngle = 1.4;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 0.5, 0);
controls.update();

// Create a circular ground
const groundRadius = 25; // Radius of the circle
const groundSegments = 64; // Number of segments for smoother circle
const groundGeometry = new THREE.CircleGeometry(groundRadius, groundSegments);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 800, 100, 0.8, 0.5);
spotLight.position.set(5, 15, 5);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const spotLight2 = new THREE.SpotLight(0xffffff, 600, 100, 0.8, 0.5);
spotLight2.position.set(-5, 12, -5);
spotLight2.castShadow = true;
spotLight2.shadow.bias = -0.0001;
scene.add(spotLight2);

const loader = new GLTFLoader().setPath('public/rolls-royce_ghost/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  const bodyPartNames = [
    'rrghost_paint',
    'rrghost_body',
    'rrghost_fender',
    'rrghost_door',
    'rrghost_trunk',
    'rrghost_bumper'
  ];

  const blackParts = [
    'handle',
    'doorhandle',
    'knob',
    'hood',
    'bonnet',
    'grille_b',
    'grille_surround',
    'hood_panel',
    'upper_grille',
    'rrghost_grille_b',
    'trunk_handle',
    'dikky_handle',
    'boot_handle',
    'rrghost_trunk_handle',
    'trunk_release',
    'sunroof',
    'sun_roof',
    'rrghost_sunroof',
    'roof_glass',
    'panoramic_roof'
  ];

  const whiteParts = [
    'number_plate',
    'numberplate',
    'license_plate',
    'licenseplate',
    'plate_rear',
    'rear_plate',
    'registration_plate',
    'rrghost_plate'
  ];

  const excludedParts = [
    'chrome',
    'metal',
    'emblem',
    'logo',
    'badge'
  ];

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      if (child.material) {
        if ((child.material.name?.toLowerCase().includes('sunroof') || 
            child.name?.toLowerCase().includes('sunroof') ||
            child.name?.toLowerCase().includes('sun_roof') ||
            child.name?.toLowerCase().includes('panoramic')) &&
            (child.material.name?.toLowerCase().includes('glass') || 
             child.name?.toLowerCase().includes('glass'))) {
          
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0x000000),
            transparent: true,
            opacity: 0.9,
            transmission: 0.1,
            roughness: 0.1,
            metalness: 0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.2
          });
          return;
        }

        if (child.material.name?.toLowerCase().includes('glass') || 
          child.name?.toLowerCase().includes('glass') ||
          child.name?.toLowerCase().includes('windshield') ||
          child.name?.toLowerCase().includes('window')) {
          
          child.material = new THREE.MeshPhysicalMaterial({
            transparent: true,
            opacity: 0.3,
            transmission: 0.95,
            roughness: 0,
            metalness: 0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            color: new THREE.Color(0x99ccff),
            envMapIntensity: 1.5
          });
          return;
        }

        const shouldBeWhite = whiteParts.some(partName => 
          child.material.name?.toLowerCase().includes(partName.toLowerCase()) ||
          child.name?.toLowerCase().includes(partName.toLowerCase())
        ) || (
          (child.name?.toLowerCase().includes('plate') && 
           child.name?.toLowerCase().includes('rear')) ||
          (child.name?.toLowerCase().includes('registration') && 
           child.name?.toLowerCase().includes('plate'))
        );

        if (shouldBeWhite) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xffffff),
            metalness: 0.2,
            roughness: 0.4,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
            envMapIntensity: 0.8
          });
          return;
        }

        const shouldBeBlack = blackParts.some(partName => 
          child.material.name?.toLowerCase().includes(partName.toLowerCase()) ||
          child.name?.toLowerCase().includes(partName.toLowerCase())
        ) || (
          (child.material.name?.toLowerCase().includes('rrghost_hood') ||
           child.name?.toLowerCase().includes('rrghost_hood')) ||
          (child.name?.toLowerCase().includes('trunk') && 
           child.name?.toLowerCase().includes('handle')) ||
          (child.name?.toLowerCase().includes('boot') && 
           child.name?.toLowerCase().includes('handle'))
        );

        if (shouldBeBlack) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0x000000),
            metalness: 0.75,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.2
          });
          return;
        }

        const isExcluded = excludedParts.some(partName => 
          child.material.name?.toLowerCase().includes(partName.toLowerCase()) ||
          child.name?.toLowerCase().includes(partName.toLowerCase())
        );

        if (isExcluded) {
          return;
        }

        const isBodyPart = bodyPartNames.some(partName => 
          child.material.name?.toLowerCase().includes(partName.toLowerCase()) ||
          child.name?.toLowerCase().includes(partName.toLowerCase())
        );

        if (isBodyPart) {
          child.material = child.material.clone();
          child.material.metalness = 0.9;
          child.material.roughness = 0.1;
          carMaterials.push(child.material);
        }
      }
    }
  });

  mesh.position.set(0, 0.09, 0);
  mesh.scale.set(2, 2, 2);
  scene.add(mesh);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture;

  async function initializeColorDetection() {
    colorDetector = new ColorDetector();
    const success = await colorDetector.initialize();
    
    if (success) {
      setInterval(() => {
        const color = colorDetector.getDominantColor();
        carMaterials.forEach(material => {
          material.color.setRGB(
            color.r / 255,
            color.g / 255,
            color.b / 255
          );
        });
      }, 100);
    }
  }

  initializeColorDetection();

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();