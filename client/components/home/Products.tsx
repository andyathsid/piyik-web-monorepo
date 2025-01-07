"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const products = [
    {
        category: "smartincubator",
        items: [
            {
                title: "Inkubator Pintar",
                description: "Inkubator berbasis IoT dengan logika fuzzy untuk kontrol penetasan yang presisi.",
                image: "/smart-incubator.png",
                buttonText: "Beli Sekarang"
            },
            {
                title: "Dashboard Piyik",
                description: "Pantau dan kelola inkubator Anda dengan data dan wawasan real-time.",
                image: "/products/dashboard-preview.png",
                buttonText: "Masuk ke Dashboard"
            },
        ]
    },
    {
        category: "fertilities",
        items: [
            {
                title: "Sistem Deteksi Kesuburan Telur",
                description: "Sistem berbasis AI untuk mengklasifikasikan kesuburan telur menggunakan Vision Transformer.",
                image: "/products/fertility-detection.png",
                buttonText: "Pelajari Cara Kerjanya"
            },
            {
                title: "Piyik Vision",
                description: "Mudah menilai kesuburan telur dengan mengunggah gambar untuk hasil instan.",
                image: "/products/piyik-vision-preview.png",
                buttonText: "Unggah Gambar Telur Sekarang"
            },
        ]
    }
];


export function Products() {
    return (
        <section className="py-12 sm:py-24">
            <div className="container px-4 sm:px-6">
                <Tabs defaultValue="smartincubator" className="w-full">
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                            <TabsTrigger
                                value="smartincubator"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Pemantauan Telur
                            </TabsTrigger>
                            <TabsTrigger
                                value="fertilities"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Kesuburan Telur
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {products.map((category) => (
                        <TabsContent key={category.category} value={category.category}>
                            <div className="w-full max-w-5xl mx-auto mt-8 sm:mt-16">
                                <Carousel className="relative mx-4 sm:mx-12">
                                    <CarouselContent>
                                        {category.items.map((item, index) => (
                                            <CarouselItem key={index}>
                                                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                                                    <h2 className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                                                        {category.category === "smartincubator" ? "PEMANTAUAN TELUR" : "KESUBURAN TELUR"}
                                                    </h2>
                                                    <h3 className="text-2xl sm:text-4xl font-bold">{item.title}</h3>
                                                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                                                        {item.description}
                                                    </p>
                                                    <Button
                                                        size="lg"
                                                        className="mt-4 sm:mt-8 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
                                                    >
                                                        {item.buttonText}
                                                    </Button>

                                                    <div className="relative aspect-[16/9] w-full mt-4 sm:mt-8">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.title}
                                                            fill
                                                            className="object-contain rounded-lg shadow-lg"
                                                            priority
                                                            quality={90}
                                                        />
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="hidden sm:flex absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2" />
                                    <CarouselNext className="hidden sm:flex absolute -right-4 sm:-right-12 top-1/2 -translate-y-1/2" />
                                </Carousel>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}