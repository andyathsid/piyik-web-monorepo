"use client";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import Link from "next/link";

const heroContent = [
  {
    title: "Smart Incubator for Better Hatching",
    description: "Revolutionary IoT-powered incubator with AI fertility detection. Maximize your hatching success with our advanced technology.",
    image: "/incubator-hero.jpg",
    primaryButton: {
      text: "Buy Now",
      href: "#product"
    },
    secondaryButton: {
      text: "Learn More",
      href: "#features"
    }
  },
  {
    title: "AI-Powered Egg Fertility Detection",
    description: "Upload an image of your egg and our advanced AI will instantly analyze its fertility status. Get accurate results in seconds!",
    image: "/ai-service-hero.jpg",
    primaryButton: {
      text: "Try Now",
      href: "#ai-service"
    },
  }
];

export const Hero = () => {
  return (
    <section className="container py-20 md:py-32">
      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent>
          {heroContent.map((content, index) => (
            <CarouselItem className="px-8"  key={index}>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-6 text-center lg:text-left"
                >
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
                      {content.title}
                    </span>
                  </h1>

                  <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
                    {content.description}
                  </p>

                  <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
                    <Link 
                      href={content.primaryButton.href}
                      className={buttonVariants({
                        size: "lg",
                        className: "w-full md:w-auto"
                      })}
                    >
                      {content.primaryButton.text}
                    </Link>

                    {content.secondaryButton && (
                      <Link
                        href={content.secondaryButton.href}
                        className={buttonVariants({
                          variant: "outline",
                          size: "lg",
                          className: "w-full md:w-auto"
                        })}
                      >
                        {content.secondaryButton.text}
                      </Link>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative aspect-video rounded-xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={content.image}
                    alt={content.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="hidden md:block">
          <CarouselPrevious className="-left-16" />
          <CarouselNext className="-right-16" />
        </div>
      </Carousel>
    </section>
  );
};
