
"use client";

import ProductCard from './ProductCard';
import type { Product } from '@/lib/types';
import Image from 'next/image';

const MOCK_PRODUCTS: (Omit<Product, 'quantity'> & { imageURL: string; price: number; reviews: number; rating: number, dataAiHint: string })[] = [
  {
    id: 'prod_1',
    name: 'Jacksnack Alpha',
    imageURL: '/images/jack.jpg',
    price: 1.00,
    reviews: 120,
    rating: 5,
    dataAiHint: 'sleek gadget'
  },
  {
    id: 'prod_2',
    name: 'Vacuum Fried Bhindi Treat Mini - 20 gms',
    imageURL: '/images/jack.jpg',
    price: 55.00,
    reviews: 12,
    rating: 4,
    dataAiHint: 'fried okra snack',
  },
  {
    id: 'prod_3',
    name: 'Vacuum Fried Jackfruit Treat - 50 gms',
    imageURL: '/images/jack.jpg',
    price: 99.00,
    reviews: 16,
    rating: 5,
    dataAiHint: 'jackfruit chips',
  },
  {
    id: 'prod_4',
    name: 'Vacuum Fried Garlic Treat - 40 gms',
    imageURL: 'https://picsum.photos/400/400?random=24',
    price: 130.00,
    reviews: 19,
    rating: 5,
    dataAiHint: 'garlic chips',
  },
  {
    id: 'prod_5',
    name: 'Chips',
    imageURL: 'https://picsum.photos/400/400?random=25',
    price: 50.00,
    reviews: 25,
    rating: 4,
    dataAiHint: 'potato chips',
  },
  {
    id: 'prod_6',
    name: 'Spicy Sticks',
    imageURL: 'https://picsum.photos/400/400?random=26',
    price: 60.00,
    reviews: 18,
    rating: 5,
    dataAiHint: 'spicy snacks',
  },
  {
    id: 'prod_7',
    name: 'Jacksnack Beta',
    imageURL: 'https://picsum.photos/400/400?random=2',
    price: 79.99,
    reviews: 95,
    rating: 4,
    dataAiHint: 'modern device'
  },
  {
    id: 'prod_8',
    name: 'Jacksnack Gamma',
    imageURL: 'https://picsum.photos/400/400?random=3',
    price: 129.99,
    reviews: 210,
    rating: 5,
    dataAiHint: 'premium electronics'
  },
];

export default function Products() {
  const bestSellers = MOCK_PRODUCTS.slice(0, 3);

  return (
    <section className="py-12 bg-gray-50">
        <div className="mb-16">
          <Image
            src="/images/logo.png"
            alt="Promotional Banner"
            width={1200}
            height={400}
            className="w-full h-auto object-cover shadow-md"
            data-ai-hint="snack promotion"
          />
        </div>
      <div className="container mx-auto px-4 md:px-6">

        <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Best Sellers</h2>
            <p className="text-center text-gray-500 mb-8">
              Check out our top-rated products that customers love.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} variant="borderless" />
                ))}
            </div>
        </div>

      </div>
    </section>
  );
}
