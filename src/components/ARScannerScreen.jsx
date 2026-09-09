import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ARScannerScreen({ onBack }) {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      
      {/* Header & Tombol Kembali (Overlay transparan di atas kamera) */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white active:scale-95 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-4 text-white font-medium text-sm drop-shadow-md bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
          Arahkan ke Marker QR Code
        </span>
      </div>

      {/* 
        Iframe memuat ar.html dari folder public.
        Atribut allow="camera" sangat penting agar browser mengizinkan iframe menyalakan kamera.
      */}
      <iframe
        src="/ar.html"
        className="w-full h-full border-none pointer-events-auto"
        allow="camera; microphone; fullscreen; display-capture"
        title="AR Engine"
      />
      
    </div>
  );
}