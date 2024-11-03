import * as THREE from 'three';

function createGround() {
    // Create a radial gradient texture for the ground
    const textureSize = 2048; // Increased for better quality
    const canvas = document.createElement('canvas');
    canvas.width = textureSize;
    canvas.height = textureSize;
    const context = canvas.getContext('2d');

    // Create radial gradient with spotlight effect
    const gradient = context.createRadialGradient(
        textureSize/2, textureSize/2, 0,          // Inner circle center and radius
        textureSize/2, textureSize/2, textureSize/2  // Outer circle center and radius
    );
    
    // Define gradient color stops for spotlight effect
    gradient.addColorStop(0, '#666666');    // Bright center
    gradient.addColorStop(0.2, '#444444');  // First transition
    gradient.addColorStop(0.4, '#222222');  // Second transition
    gradient.addColorStop(0.6, '#111111');  // Dark outer area
    gradient.addColorStop(1, '#000000');    // Complete darkness at edges

    // Fill the canvas with the gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, textureSize, textureSize);

    // Add noise texture for fog effect
    const imageData = context.getImageData(0, 0, textureSize, textureSize);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        // Add subtle noise
        const noise = (Math.random() * 10 - 5);
        data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
        data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise)); // G
        data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise)); // B
    }
    
    context.putImageData(imageData, 0, 0);

    // Create texture from canvas
    const groundTexture = new THREE.CanvasTexture(canvas);
    groundTexture.wrapS = THREE.ClampToEdgeWrapping;
    groundTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Create ground geometry (made larger for better fog effect)
    const groundGeometry = new THREE.CircleGeometry(30, 64); // Changed to circle geometry
    groundGeometry.rotateX(-Math.PI / 2); // Rotate to be horizontal

    // Create ground material with fog-like properties
    const groundMaterial = new THREE.MeshStandardMaterial({
        map: groundTexture,
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    // Create mesh and enable shadow receiving
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -0.01; // Slightly below zero to prevent z-fighting

    // Add a second layer for fog depth effect
    const fogGeometry = new THREE.CircleGeometry(35, 64);
    fogGeometry.rotateX(-Math.PI / 2);
    
    const fogMaterial = new THREE.MeshStandardMaterial({
        map: groundTexture,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false // Prevents z-fighting with main ground
    });

    const fogMesh = new THREE.Mesh(fogGeometry, fogMaterial);
    fogMesh.receiveShadow = true;
    fogMesh.position.y = 0.05; // Slightly above the ground

    // Create a group to hold both meshes
    const groundGroup = new THREE.Group();
    groundGroup.add(groundMesh);
    groundGroup.add(fogMesh);

    return groundGroup;
}

export { createGround }; 