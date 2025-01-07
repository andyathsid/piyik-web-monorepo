"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative w-full h-screen rounded-b-[3rem] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/piyik-hero.jpeg" // Pastikan untuk menambahkan gambar kandang ayam yang sesuai
          alt="Chicken Farm Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/60" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center text-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg md:text-xl mb-4"
        >
          Pantau kesehatan telur dengan mudah menggunakan Internet of Things dan Kecerdasan Buatan
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-8 max-w-4xl"
        >
          #JagaKesehatanTelur bersama Piyik
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-6 text-lg"
          >
            Lihat Produk Kami
          </Button>
        </motion.div>
      </div>
    </section>
  );
};