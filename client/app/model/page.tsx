"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";
import { motion } from "framer-motion";
import { Camera, Egg, Upload, Search, AlertCircle } from "lucide-react";
import { ImageUploader } from "@/components/model/ImageUploader";

export default function ModelPage() {
  const steps = [
    {
      icon: Camera,
      title: "Persiapkan Gambar",
      description: "Ambil foto telur menggunakan metode candling. Pastikan ruangan gelap dan sumber cahaya tepat di belakang telur."
    },
    {
      icon: Upload,
      title: "Unggah Gambar",
      description: "Upload gambar telur ke sistem. Anda dapat mengunggah beberapa gambar sekaligus."
    },
    {
      icon: Search,
      title: "Analisis Otomatis",
      description: "Sistem akan menganalisis gambar menggunakan AI untuk mendeteksi kesuburan telur."
    },
    {
      icon: Egg,
      title: "Lihat Hasil",
      description: "Hasil analisis akan menunjukkan status kesuburan telur dengan indikator visual yang jelas."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <section className="container py-12 md:py-24 space-y-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 relative"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-yellow-500 text-transparent bg-clip-text">
                Piyik Vision
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Deteksi kesuburan telur dengan mudah menggunakan teknologi AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-xl border bg-card/50 backdrop-blur hover:bg-card/80 transition-colors duration-300"
              >
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-muted/50 rounded-lg p-6 mt-12"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Panduan Candling</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Lakukan candling di ruangan yang gelap</li>
                  <li>Gunakan sumber cahaya yang terang (senter atau lampu khusus candling)</li>
                  <li>Posisikan telur tepat di depan sumber cahaya</li>
                  <li>Pastikan gambar yang diambil jelas dan tidak blur</li>
                  <li>Hindari pantulan cahaya yang dapat mengganggu hasil analisis</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="container pb-24">
          <div className="max-w-5xl mx-auto">
            <ImageUploader />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}