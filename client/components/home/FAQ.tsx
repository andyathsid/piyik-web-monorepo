"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Apa itu Smart Incubator, dan bagaimana cara kerjanya?",
    answer: "Smart Incubator adalah perangkat berbasis IoT yang menggunakan logika fuzzy untuk menjaga kondisi optimal dalam inkubasi telur, termasuk kontrol suhu dan kelembaban.",
    value: "item-1",
  },
  {
    question: "Apakah saya bisa menggunakan Sistem Deteksi Kesuburan Telur untuk semua jenis telur?",
    answer: "Sistem ini terutama dirancang untuk telur unggas dan telah diuji pada telur ayam. Kompatibilitas dengan jenis telur lain mungkin bervariasi.",
    value: "item-2",
  },
  {
    question: "Seberapa akurat Sistem Deteksi Kesuburan Telur?",
    answer: "Sistem kami, yang didukung oleh teknologi Vision Transformer, menawarkan akurasi tinggi, namun hasilnya dapat bergantung pada kualitas gambar dan faktor lingkungan.",
    value: "item-3",
  },
  {
    question: "Apakah saya memerlukan keahlian teknis untuk menggunakan Dashboard Piyik?",
    answer: "Tidak, dashboard dirancang dengan antarmuka yang intuitif, sehingga mudah digunakan oleh siapa saja untuk memantau dan mengelola inkubator mereka.",
    value: "item-4",
  },
  {
    question: "Apakah layanan Piyik Vision gratis untuk digunakan?",
    answer: "Ya, Anda dapat mengunggah gambar telur dan mendapatkan hasil secara gratis selama periode beta kami. Fitur tambahan mungkin akan ditambahkan di masa mendatang.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Pertanyaan yang Sering{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Diajukan
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Masih punya pertanyaan?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Hubungi kami
        </a>
      </h3>
    </section>
  );
};
