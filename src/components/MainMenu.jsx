import React from 'react';
import { QrCode, BookOpen, Sparkles } from 'lucide-react';

export default function MainMenu({ onStartScan, onOpenTutorial }) {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-900 text-white">
      <header className="pt-8 text-center">
        <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-3">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">AR Edu-Explorer</h1>
        <p className="text-slate-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
          Pindai marker QR untuk memvisualisasikan materi pembelajaran secara tiga dimensi dan interaktif.
        </p>
      </header>

      <div className="w-full max-w-sm mx-auto space-y-4 my-auto">
        <button
          onClick={onStartScan}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <QrCode className="w-6 h-6" />
          Mulai Eksplorasi AR
        </button>

        <button
          onClick={onOpenTutorial}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold rounded-2xl transition-all active:scale-95"
        >
          <BookOpen className="w-6 h-6" />
          Petunjuk Penggunaan
        </button>
      </div>

      <footer className="text-center text-xs text-slate-500 pb-4 font-medium">
        Media Pembelajaran • Versi 1.0
      </footer>
    </div>
  );
}