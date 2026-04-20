import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    cameraRef.current = camera;

    // Renderer Setup - optimized for performance
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    renderer.shadowMap.enabled = false; // Disable shadows for better performance
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Globe with optimized geometry
    const geometryDetail = prefersReducedMotion ? 32 : 48;
    const geometry = new THREE.IcosahedronGeometry(1.5, geometryDetail);
    const canvas = document.createElement('canvas');
    canvas.width = 1024; // Reduced from 2048 for performance
    canvas.height = 512; // Reduced from 1024 for performance
    const ctx = canvas.getContext('2d')!;

    // Draw gradient on canvas
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(0.5, '#0891b2');
    gradient.addColorStop(1, '#ef4444');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise/texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 30;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: 0x22c55e,
      emissiveIntensity: 0.3,
      shininess: 100,
    });

    const globe = new THREE.Mesh(geometry, material);
    globe.castShadow = false;
    globe.receiveShadow = false;
    scene.add(globe);
    globeRef.current = globe;

    // Create Particles - optimized count
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = prefersReducedMotion ? 300 : 800;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x22c55e,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Lighting - optimized
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = false;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x22c55e, 0.5);
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (globeRef.current && !prefersReducedMotion) {
        globeRef.current.rotation.x += 0.0005;
        globeRef.current.rotation.y += 0.001;
        globeRef.current.rotation.x += mouseY * 0.0005;
        globeRef.current.rotation.y += mouseX * 0.0005;
      }

      if (particlesRef.current && !prefersReducedMotion) {
        particlesRef.current.rotation.x += 0.0002;
        particlesRef.current.rotation.y += 0.0003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
}
