
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

const MOCK_PRODUCTS: Omit<Product, 'description'>[] = [
  {
    id: '1',
    name: 'Jacksnack Alpha',
    imageURL: 'https://picsum.photos/400/600?random=1',
    quantity: 1,
    price: 1.00,
  },
  {
    id: '2',
    name: 'Jacksnack Beta',
    imageURL: 'https://picsum.photos/400/600?random=2',
    quantity: 1,
    price: 79.99,
  },
  {
    id: '3',
    name: 'Jacksnack Gamma',
    imageURL: 'https://picsum.photos/400/600?random=3',
    quantity: 1,
    price: 129.99,
  },
];

export default function Products() {
  const [products, setProducts] = useState<Omit<Product, 'description'>[]>([]);

  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, quantity: newQuantity } : p
        )
      );
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Our Products</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Explore our range of innovative solutions designed for performance and reliability.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] flex flex-col">
              <CardHeader className="p-0">
                <div className="relative w-full h-[450px]">
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
                  <p className="text-xl font-semibold text-primary mt-2">₹{product.price.toFixed(2)}</p>
                </div>
                 <div className="flex items-center justify-center gap-2 mt-4">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(product.id, product.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number" 
                    className="w-16 text-center" 
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10) || 1)}
                    min="1"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                  </Button>
                  <Link href={`/buy/${product.id}?quantity=${product.quantity}`} passHref>
                    <Button className="w-full">
                        Buy Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
