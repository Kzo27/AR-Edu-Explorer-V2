// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Import semua komponen Anda
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import TutorialScreen from './components/TutorialScreen';
import ARScannerScreen from './components/ARScannerScreen';
import ModelViewer from './components/ModelViewer';

// Komponen pembungkus ini diperlukan agar kita bisa menggunakan hook useNavigate
function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Route Root: Halaman pertama yang dibuka adalah Splash Screen */}
      <Route 
        path="/" 
        element={
          <SplashScreen 
            // Gunakan replace: true agar user tidak bisa memencet tombol back ke Splash Screen
            onFinish={() => navigate('/menu', { replace: true })} 
          />
        } 
      />

      <Route 
        path="/menu" 
        element={
          <MainMenu
            onStartScan={() => navigate('/scan')}
            onOpenTutorial={() => navigate('/tutorial')}
          />
        } 
      />

      <Route 
        path="/tutorial" 
        element={
          <TutorialScreen onBack={() => navigate(-1)} />
        } 
      />

      <Route 
        path="/scan" 
        element={
          <ARScannerScreen onBack={() => navigate(-1)} />
        } 
      />

      {/* Route baru untuk halaman 3D Viewer interaktif */}
      <Route 
        path="/view/:id" 
        element={
          <ModelViewer />
        } 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* Router harus membungkus seluruh sistem navigasi aplikasi */}
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}