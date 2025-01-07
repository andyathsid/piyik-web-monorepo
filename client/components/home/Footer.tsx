"use client";

import { Logo } from "@/components/Logo";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex items-center gap-2"
          >
            <Logo />
            PIYIK
          </a>
          <p className="mt-2 opacity-60">
            Teknologi Inkubator Pintar untuk Hasil Penetasan yang Lebih Baik
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Tautan Cepat</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#product"
              className="opacity-60 hover:opacity-100"
            >
              Produk
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100"
            >
              Piyik Dashboard
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#dashboard"
              className="opacity-60 hover:opacity-100"
            >
              Piyik Vision
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Dukungan</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#contact"
              className="opacity-60 hover:opacity-100"
            >
              Hubungi Kami
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#faq"
              className="opacity-60 hover:opacity-100"
            >
              FAQ
            </a>
          </div>
          <div>
            <a
              rel="noreferrer noopener"
              href="#documentation"
              className="opacity-60 hover:opacity-100"
            >
              Dokumentasi
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Kontak</h3>
          <div className="opacity-60">
            <p>Email: info@piyik.com</p>
          </div>
          <div className="opacity-60">
            <p>Telepon: +62 (022) 7801840</p>
          </div>
          <div className="opacity-60">
            <p>Alamat: Jl. Pendidikan No.15, Cibiru Wetan, Kec. Cileunyi, Kabupaten Bandung, Jawa Barat 40625</p>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          © {new Date().getFullYear()} PIYIK. Hak cipta dilindungi undang-undang.
        </h3>
      </section>
    </footer>
  );
};
