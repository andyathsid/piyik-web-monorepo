"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const Scroll = () => {
  return (
    <section className="container py-24 sm:py-32 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-sm uppercase tracking-wider text-primary font-semibold">
          PRODUK KAMI
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold">
          Solusi Ketahanan Pangan di Chickin Indonesia
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Kami menyediakan beragam solusi bagi peternak dan pelaku bisnis. Dari hulu hingga hilir. Dari support teknologi hingga distribusi.
        </p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mt-4"
      >
        <ChevronDown size={32} className="text-muted-foreground" />
      </motion.div>
    </section>
  );
};
