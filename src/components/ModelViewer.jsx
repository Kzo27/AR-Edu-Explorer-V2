import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MODEL_DATABASE } from '../data/models'; // Pastikan path ini sesuai

export default function ModelViewer() {
  // 1. Ambil ID dari URL (misal: "QR_SAMPLE_01")
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 2. Cari data model berdasarkan ID, gunakan DEFAULT jika tidak ketemu
  const modelData = MODEL_DATABASE[id] || MODEL_DATABASE["DEFAULT"];

  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || !modelData) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0xffffff, 2);
    frontLight.position.set(0, 5, 5);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
    backLight.position.set(0, -5, -5);
    scene.add(backLight);

    // Load Model
    let loadedModel = null;
    const loader = new GLTFLoader();

    // Menggunakan filepath dari data yang sudah difilter
    loader.load(
      modelData.filePath,
      (gltf) => {
        loadedModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(loadedModel);
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2; 
        
        const scaleRatio = targetSize / maxDim;
        const finalScale = scaleRatio * (modelData.scale || 1);
        
        loadedModel.scale.set(finalScale, finalScale, finalScale);

        const boxAfterScale = new THREE.Box3().setFromObject(loadedModel);
        const center = boxAfterScale.getCenter(new THREE.Vector3());
        
        loadedModel.position.x -= center.x;
        loadedModel.position.y -= center.y;
        loadedModel.position.z -= center.z;

        scene.add(loadedModel);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("Gagal memuat 3D model:", err);
        setErrorMsg("File model 3D tidak ditemukan di folder public.");
        setLoading(false);
      }
    );

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;    
    controls.enablePan = true;     
    controls.autoRotate = true;    
    controls.autoRotateSpeed = 1.0;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update(); 
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose(); 
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelData]); // Dependensi effect diubah ke modelData

  return (
    <div className="w-screen h-screen bg-gray-900 relative flex flex-col overflow-hidden">
      
      {/* Header & Tombol Kembali */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => navigate('/scan')}
          className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white active:scale-95 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-4 flex flex-col">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {modelData.name}
          </span>
          <span className="text-gray-300 text-xs drop-shadow-md">
            {modelData.description}
          </span>
        </div>
      </div>

      {/* Area Three.js */}
      <div className="flex-1 relative z-30 pointer-events-auto">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-40">
            <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-white text-sm font-medium animate-pulse">Menyiapkan 3D Object...</p>
          </div>
        )}

        {errorMsg && (
          <div className="absolute top-24 left-4 right-4 p-4 bg-red-600/90 border border-red-400 text-white rounded-xl text-center shadow-lg z-40">
            <p className="font-bold">Gagal</p>
            <p className="text-sm opacity-90">{errorMsg}</p>
          </div>
        )}

        {/* Canvas Render */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>
      
    </div>
  );
}