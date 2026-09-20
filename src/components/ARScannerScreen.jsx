import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

export default function ARScannerScreen({ onBack }) {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  
  // 1. Tambahkan flag ini untuk mendeteksi apakah kamera sudah menyala
  const isScannerInitialized = useRef(false); 

  useEffect(() => {
    // 2. Jika sudah inisialisasi, hentikan eksekusi (mencegah kamera ganda)
    if (isScannerInitialized.current) return;
    isScannerInitialized.current = true;

    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const onScanSuccess = (decodedText) => {
      console.log("QR Code terbaca:", decodedText);
      
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          // Bersihkan elemen HTML kamera
          html5QrCode.clear(); 
          navigate(`/view/${decodedText}`);
        }).catch((err) => console.error("Gagal mematikan kamera:", err));
      } else {
        navigate(`/view/${decodedText}`);
      }
    };

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10
        // qrbox DIHAPUS DI SINI AGAR SENSOR KAMERA LEBIH SENSITIF & FULL SCREEN
      },
      onScanSuccess,
      () => {} // Abaikan error frame
    ).catch((err) => {
      console.error("Gagal memulai kamera otomatis:", err);
    });

    return () => {
      // Cleanup saat user menekan tombol kembali
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
        }).catch(console.error);
      }
    };
  }, [navigate]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col">
      
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => {
            // Hapus logika onBack dan navigate(-1), langsung tembak ke rute '/' (Menu Utama)
            navigate('/'); 
          }}
          className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white active:scale-95 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-4 text-white font-medium text-sm drop-shadow-md bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
          Arahkan ke Marker QR Code
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center w-full h-full bg-gray-900">
        <div 
          id="qr-reader" 
          className="w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20 bg-black"
        ></div>
      </div>
      
    </div>
  );
}