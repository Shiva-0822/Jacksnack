"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Jacksnack Alpha',
    description: ['High-speed processing', 'Ultra-durable chassis', 'Next-gen AI features'],
    imageURL: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: '2',
    name: 'Jacksnack Beta',
    description: ['Compact and lightweight', 'All-day battery life', 'Seamless connectivity'],
    imageURL: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: '3',
    name: 'Jacksnack Gamma',
    description: ['4K Ultra-HD display', 'Immersive audio system', 'Studio-quality microphone'],
    imageURL: 'https://picsum.photos/400/300?random=3',
  },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
  }, []);

  return (
    <section id="products" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Our Products</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Explore our range of innovative solutions designed for performance and reliability.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
              <CardHeader className="p-0">
                <Image
                  src={product.imageURL}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="object-cover w-full h-48"
                  data-ai-hint="product image"
                />
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                <ul className="space-y-2 text-muted-foreground">
                  {product.description.map((desc, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
