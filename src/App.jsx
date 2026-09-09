// src/App.jsx
import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import TutorialScreen from './components/TutorialScreen';
import ARScannerScreen from './components/ARScannerScreen';

export default function App() {
  // Screen state: 'splash' | 'menu' | 'tutorial' | 'scanner'
  const [currentScreen, setCurrentScreen] = useState('splash');

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => setCurrentScreen('menu')} />
      )}

      {currentScreen === 'menu' && (
        <MainMenu
          onStartScan={() => setCurrentScreen('scanner')}
          onOpenTutorial={() => setCurrentScreen('tutorial')}
        />
      )}

      {currentScreen === 'tutorial' && (
        <TutorialScreen onBack={() => setCurrentScreen('menu')} />
      )}

      {currentScreen === 'scanner' && (
        <ARScannerScreen onBack={() => setCurrentScreen('menu')} />
      )}
    </div>
  );
}