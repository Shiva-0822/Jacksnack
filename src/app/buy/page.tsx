import Header from '@/components/buy/Header';
import Footer from '@/components/buy/Footer';
import ProductCard from '@/components/buy/ProductCard';
import type { Product } from '@/lib/types';

const MOCK_PRODUCTS: (Omit<Product, 'description'> & { price: number; reviews: number; rating: number; dataAiHint: string })[] = [
    {
      id: '1',
      name: 'Vacuum Fried Bhindi Okra Treat - 50 gms',
      imageURL: 'https://picsum.photos/300/300?random=21',
      price: 130.00,
      reviews: 33,
      rating: 5,
      dataAiHint: 'fried okra',
    },
    {
      id: '2',
      name: 'Vacuum Fried Bhindi Treat Mini - 20 gms',
      imageURL: 'https://picsum.photos/300/300?random=22',
      price: 55.00,
      reviews: 12,
      rating: 4,
      dataAiHint: 'fried okra snack',
    },
    {
      id: '3',
      name: 'Vacuum Fried Jackfruit Treat - 50 gms',
      imageURL: 'https://picsum.photos/300/300?random=23',
      price: 99.00,
      reviews: 16,
      rating: 5,
      dataAiHint: 'jackfruit chips',
    },
    {
      id: '4',
      name: 'Vacuum Fried Garlic Treat - 40 gms',
      imageURL: 'https://picsum.photos/300/300?random=24',
      price: 130.00,
      reviews: 19,
      rating: 5,
      dataAiHint: 'garlic chips',
    },
  ];

export default function BuyNowPage() {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <div className="bg-cyan-300 text-center py-3">
          <p className="font-semibold text-black">Use code BOOK10 for 10% Discount</p>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {MOCK_PRODUCTS.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
