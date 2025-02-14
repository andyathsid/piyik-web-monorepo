"use client";

import { Statistics } from "@/components/home/Statistics";
import pilot from "@/assets/pilot.png";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot.src}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  Tentang{" "}
                </span>
                Kami
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                We are a passionate team of five university students driven by a shared vision: harnessing technology to revolutionize poultry farming. Our startup specializes in developing smart solutions, combining IoT, artificial intelligence, and innovative software to make egg incubation and fertility detection easier, smarter, and more efficient.
              </p>
            </div>

 
          </div>
        </div>
      </div>
    </section>
  );
};
