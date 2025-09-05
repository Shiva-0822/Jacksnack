"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useCallback, useEffect, useState, useRef } from 'react';
import { type CarouselApi } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import Autoplay from "embla-carousel-autoplay";
import Link from 'next/link';

const heroSlides = [
  {
    imageSrc: 'https://picsum.photos/800/800?random=10',
    title: 'Experience the Jacksnack Alpha',
    description: 'High-speed processing and ultra-durable chassis for the ultimate performance.',
    dataAiHint: 'futuristic gadget'
  },
  {
    imageSrc: 'https://picsum.photos/800/800?random=11',
    title: 'Discover the Jacksnack Beta',
    description: 'Compact, lightweight, with all-day battery life for productivity on the go.',
    dataAiHint: 'sleek device'
  },
  {
    imageSrc: 'https://picsum.photos/800/800?random=12',
    title: 'Unveil the Jacksnack Gamma',
    description: 'A stunning 4K Ultra-HD display and an immersive audio system for entertainment.',
    dataAiHint: 'vibrant screen'
  },
];

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <section id="home" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full rounded-lg overflow-hidden"
          opts={{ loop: true }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                   <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={slide.imageSrc}
                        alt={`JACKSNACK Product Image: ${slide.title}`}
                        fill
                        className={cn(
                          "object-cover transition-transform duration-1000 ease-in-out"
                        )}
                        data-ai-hint={slide.dataAiHint}
                        priority={index === 0}
                      />
                    </div>
                  <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      <span className="text-primary">{slide.title.split(' ').slice(0, 3).join(' ')}</span><br />{slide.title.split(' ').slice(3).join(' ')}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {slide.description}
                    </p>
                    <Link href="/buy">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full transition-transform hover:scale-105">
                        BUY NOW
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex items-center justify-center gap-2 mt-8">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'h-0.5 w-8 rounded-full transition-colors',
                current === index ? 'bg-primary' : 'bg-muted'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
