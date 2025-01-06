import "@/app/index.css";
import { About } from "@/components/home/About";
import { Cta } from "@/components/home/Cta";
import { FAQ } from "@/components/home/FAQ";
import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { Newsletter } from "@/components/home/Newsletter";
import { Pricing } from "@/components/home/Pricing";
import { ScrollToTop } from "@/components/home/ScrollToTop";
import { Services } from "@/components/home/Services";
import { Sponsors } from "@/components/home/Sponsors";
import { Team } from "@/components/home/Team";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}