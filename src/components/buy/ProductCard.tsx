
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseDb, doc, setDoc, getDoc, serverTimestamp, increment } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type ProductCardProps = {
    product: Omit<Product, 'quantity'> & { imageURL: string; price: number; reviews: number; rating: number, dataAiHint: string };
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
        action: (
            <Button onClick={() => router.push('/login')}>Login</Button>
        )
      });
      return;
    }
    try {
      const db = getFirebaseDb();
      const itemRef = doc(db, 'carts', user.uid, 'items', product.id);
      
      const docSnap = await getDoc(itemRef);

      if (docSnap.exists()) {
        // If item exists, increment quantity
        await setDoc(itemRef, {
            quantity: increment(1)
        }, { merge: true });
        toast({
            title: "Quantity updated!",
            description: `The quantity for ${product.name} has been updated in your cart.`,
        });
      } else {
        // If item does not exist, add it to cart
        await setDoc(itemRef, {
            ...product,
            quantity: 1, // Start with quantity 1
            addedAt: serverTimestamp()
        });
        toast({
            title: "Added to cart!",
            description: `${product.name} has been added to your cart.`,
        });
      }

    } catch (error) {
      console.error("Error adding to cart: ", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="text-center group flex flex-col justify-between h-full border rounded-lg p-4 transition-all hover:shadow-lg">
      <div>
        <div className="relative w-full aspect-1 bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Image 
                src={product.imageURL} 
                alt={product.name}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.dataAiHint}
            />
        </div>
        <h3 className="text-base text-gray-700 mb-2 h-10">{product.name}</h3>
        <div className="flex justify-center items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-500 ml-1">({product.reviews} reviews)</span>
        </div>
        <p className="text-lg font-semibold text-gray-800 mb-4">From ₹{product.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <Button variant="outline" size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
        </Button>
        <Link href={`/buy/${product.id}`} passHref>
          <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">
              Buy Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
