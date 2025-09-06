
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    name: 'Jacksnack Alpha',
    imageURL: '/images/jack.jpg',
    quantity: 1,
    price: 1.00,
    description: 'High-speed processing and ultra-durable chassis for the ultimate performance.',
  },
  {
    id: 'prod_7',
    name: 'Jacksnack Beta',
    imageURL: '/images/jack.jpg',
    quantity: 1,
    price: 79.99,
    description: 'Compact, lightweight, with all-day battery life for productivity on the go.',
  },
  {
    id: 'prod_8',
    name: 'Jacksnack Gamma',
    imageURL: '/images/jack.jpg',
    quantity: 1,
    price: 129.99,
    description: 'A stunning 4K Ultra-HD display and an immersive audio system for entertainment.',
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
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] flex flex-col">
              <CardHeader className="p-0">
                <div className="relative w-full h-[380px]">
                    <Image
                      src={product.imageURL}
                      alt={product.name}
                      fill
                      className="object-cover"
                      data-ai-hint="product image"
                    />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4 flex-grow flex flex-col">
                <div className="flex-grow">
                  <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
                  <p className="text-xl font-light text-gray-800 mt-2">₹{product.price.toFixed(2)}</p>
                  <CardDescription className="mt-4 text-base text-muted-foreground">
                    {product.description}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
