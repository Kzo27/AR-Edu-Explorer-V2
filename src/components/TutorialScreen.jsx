import React from 'react';
import { ArrowLeft, Camera, QrCode, RotateCw } from 'lucide-react';

export default function TutorialScreen({ onBack }) {
  const steps = [
    {
      icon: <Camera className="w-6 h-6 text-indigo-400" />,
      title: "1. Konfigurasi Kamera",
      desc: "Sistem memerlukan akses kamera. Pilih 'Izinkan' saat peramban (browser) menampilkan pop-up permintaan akses kamera."
    },
    {
      icon: <QrCode className="w-6 h-6 text-cyan-400" />,
      title: "2. Pemindaian Marker",
      desc: "Posisikan kamera perangkat Anda tepat di atas marker QR yang telah disediakan pada modul pembelajaran."
    },
    {
      icon: <RotateCw className="w-6 h-6 text-emerald-400" />,
      title: "3. Interaksi Objek 3D",
      desc: "Gunakan satu jari untuk memutar model pembelajaran secara vertikal maupun horizontal. Gunakan dua jari (cubit/rentangkan) untuk memperbesar atau memperkecil skala objek."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Petunjuk Penggunaan</h2>
      </div>

      <div className="space-y-4 flex-1">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-4 shadow-sm"
          >
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 shrink-0 shadow-inner">
              {step.icon}
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">{step.title}</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold mt-6 transition-all active:scale-95"
      >
        Kembali ke Menu Utama
      </button>
    </div>
  );
}