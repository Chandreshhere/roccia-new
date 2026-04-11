import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Serve the 40 MB GLB from jsDelivr in production (global CDN edge cache),
// local file in dev.
const GLB_URL = import.meta.env.PROD
  ? 'https://cdn.jsdelivr.net/gh/Chandreshhere/roccia-new@main/public/assets/angel-statue/source/AngelStatue.glb'
  : '/assets/angel-statue/source/AngelStatue.glb';

const AngelStatue: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera — front facing, wider FOV so the full statue fits vertically
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Renderer — lower DPR for performance
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // Simplified lighting — fewer lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xdcd1bf, 0.4);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Load GLB
    const loader = new GLTFLoader();
    let model: THREE.Group | null = null;
    let needsRender = true;

    loader.load(
      GLB_URL,
      (gltf) => {
        model = gltf.scene;

        // Center and scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        // Scale so the model fits entirely inside the camera frustum
        // with some breathing room — no clipping top or bottom
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 3.2;
        const scale = targetSize / maxDim;
        model.scale.setScalar(scale);

        // Keep the statue centered vertically — no downward shift
        // (the CSS wrapper positions it visually within the footer)
        model.position.y -= 0;

        // Face forward (front-facing, no auto rotate)
        model.rotation.set(0, 0, 0);

        scene.add(model);
        needsRender = true;
      },
      undefined,
      (err) => {
        console.error('GLB load error:', err);
      }
    );

    // Render only when visible (IntersectionObserver pauses rAF when off-screen)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(mount);

    // Render only when needed — no continuous rAF if nothing changes
    let rafId: number;
    const animate = () => {
      if (isVisible && needsRender) {
        renderer.render(scene, camera);
        needsRender = false; // Only re-render when container resizes / model changes
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize — triggers a re-render
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      needsRender = true;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        const mesh = obj as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    />
  );
};

export default AngelStatue;
