"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Testimonial } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Adithya Rao',
    role: 'Faculty in Physics',
    review: "Tastes like heaven. I would recommend this to everyone.",
    imageURL: 'https://picsum.photos/100/100?random=4',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Lead Designer',
    review: "JACKSNACK's products have transformed my workflow. The performance is simply out of this world. I can't imagine going back to anything else!",
    imageURL: 'https://picsum.photos/100/100?random=5',
  },
   {
    id: '3',
    name: 'Michael Chen',
    role: 'Developer',
    review: 'The build quality and attention to detail are exceptional. Every interaction feels premium. Highly recommended for any professional.',
    imageURL: 'https://picsum.photos/100/100?random=6',
  },
];

export default function Reviews() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
   const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  )

  useEffect(() => {
    setTestimonials(MOCK_TESTIMONIALS);
  }, []);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section 
      id="reviews" 
      className="relative py-16 md:py-24 lg:py-32 text-white"
      style={{
        background: 'linear-gradient(90deg, #3c091a 0%, #7d1a2d 50%, #b22c38 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jZMAN/u/n38D8z0AGxjDTiGqbaBqTqGka06hpGvOfi/8HFgAASGUF/iY/3B4AAAAASUVORK5CYII=)] bg-repeat [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Reviews</h2>
          <p className="text-lg text-white/80 mt-2 max-w-3xl mx-auto">
            Explore the feedback and reviews shared by our valued customers to gain insights into their experiences with our services.
          </p>
        </div>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: 'center',
            loop: true,
          }}
          className="w-full max-w-2xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16 border-2 border-white/50">
                      <AvatarImage src={testimonial.imageURL} alt={testimonial.name} data-ai-hint="person photo"/>
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-white/80">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="relative bg-white text-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                    <div className="absolute left-1/2 -top-3 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45"></div>
                    <p className="italic">"{testimonial.review}"</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
