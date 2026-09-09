import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ModelViewer({ modelData }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // Sesuaikan posisi kamera agar sedikit lebih mundur dan pas untuk HP
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // 3. Lighting (Pencahayaan dibuat lebih terang dari segala sisi)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 2);
    frontLight.position.set(0, 5, 5);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
    backLight.position.set(0, -5, -5);
    scene.add(backLight);

    // 4. Load 3D Model & Auto-Fit Algorithm
    let loadedModel = null;
    const loader = new GLTFLoader();

    loader.load(
      modelData.filePath,
      (gltf) => {
        loadedModel = gltf.scene;

        // --- ALGORITMA AUTO-FIT & CENTER ---
        // Hitung ukuran asli dari Bounding Box model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = box.getSize(new THREE.Vector3());
        
        // Cari dimensi terbesar (X, Y, atau Z)
        const maxDim = Math.max(size.x, size.y, size.z);
        
        // Target ukuran ideal di layar (misalnya 2 unit)
        const targetSize = 2; 
        
        // Sesuaikan rasio skala asli dengan target ukuran
        const scaleRatio = targetSize / maxDim;
        // Gabungkan dengan settingan scale dari database (default 1)
        const finalScale = scaleRatio * (modelData.scale || 1);
        
        loadedModel.scale.set(finalScale, finalScale, finalScale);

        // Update Box setelah discale, lalu cari titik tengah yang baru
        const boxAfterScale = new THREE.Box3().setFromObject(loadedModel);
        const center = boxAfterScale.getCenter(new THREE.Vector3());
        
        // Geser model agar titik tengahnya persis berada di 0,0,0
        loadedModel.position.x -= center.x;
        loadedModel.position.y -= center.y;
        loadedModel.position.z -= center.z;
        // ------------------------------------

        scene.add(loadedModel);
        setLoading(false);
      },
      undefined, // Progress callback tidak dipakai
      (err) => {
        console.error("Gagal memuat 3D model:", err);
        setErrorMsg("File tidak ditemukan atau format salah.");
        setLoading(false);
      }
    );

    // 5. Interaksi Putar (Rotasi)
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      previousPosition = { x: e.clientX || (e.touches && e.touches[0].clientX) || 0, y: e.clientY || 0 };
    };

    const onPointerMove = (e) => {
      if (!isDragging || !loadedModel) return;
      const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = currentX - previousPosition.x;

      loadedModel.rotation.y += deltaX * 0.01;
      previousPosition = { x: currentX, y: e.clientY || 0 };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 6. Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (loadedModel && !isDragging) {
        loadedModel.rotation.y += 0.005; // Rotasi otomatis yang halus
      }
      renderer.render(scene, camera);
    };
    animate();

    // 7. Handle Resize Layar
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup memori saat ditutup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelData]);

  return (
    <div className="absolute inset-0 z-30 pointer-events-auto">
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-40">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-white text-sm font-medium animate-pulse">Menyiapkan 3D Object...</p>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="absolute top-24 left-4 right-4 p-4 bg-red-600/90 border border-red-400 text-white rounded-xl text-center shadow-lg z-40">
          <p className="font-bold">Gagal</p>
          <p className="text-sm opacity-90">{errorMsg}</p>
        </div>
      )}

      {/* Canvas Three.js */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}