import React, { useEffect } from 'react';
import { Box } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-50">
      <div className="animate-bounce mb-4 p-4 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl">
        <Box className="w-16 h-16 text-indigo-400" />
      </div>
      <h1 className="text-3xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
        AR Edu-Explorer
      </h1>
      <p className="text-slate-400 mt-2 text-sm font-medium">Memuat media pembelajaran interaktif...</p>
      <div className="mt-8 w-40 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
}