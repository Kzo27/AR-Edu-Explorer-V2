// src/data/models.js
export const MODEL_DATABASE = {
  // Key adalah teks/nilai yang tersimpan di dalam QR Code
  "QR_SAMPLE_01": {
    name: "Model Percobaan",
    description: "Ini adalah model 3D lokal pertama untuk uji coba AR.",
    filePath: "/models/sample.glb",
    scale: 1.5, // Atur skala default model
  },
  "DEFAULT": {
    name: "Model Default",
    description: "Model default yang dimuat jika QR code tidak dikenali.",
    filePath: "/models/sample.glb",
    scale: 1.5,
  }
};