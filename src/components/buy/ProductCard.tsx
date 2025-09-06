
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseDb, doc, setDoc, getDoc, serverTimestamp, increment } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type ProductCardProps = {
    product: Omit<Product, 'quantity'> & { imageURL: string; price: number; reviews: number; rating: number, dataAiHint: string };
    variant?: 'default' | 'borderless';
};

const ProductCard = ({ product, variant = 'default' }: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Cart requires login",
        description: "You need to be logged in to add items to your cart. This feature will be re-enabled soon.",
        variant: "destructive",
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
            quantity: increment(quantity)
        }, { merge: true });
        toast({
            title: "Quantity updated!",
            description: `${product.name} has been added to your cart.`,
        });
      } else {
        // If item does not exist, add it to cart
        await setDoc(itemRef, {
            ...product,
            quantity: quantity,
            addedAt: serverTimestamp()
        });
        toast({
            title: "Added to cart!",
            description: `${quantity} x ${product.name} has been added to your cart.`,
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
    <div className={cn(
        "text-center group flex flex-col justify-between h-full",
        variant === 'default' && "border rounded-lg p-4 transition-all hover:shadow-lg"
    )}>
      <div>
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
            <Image 
                src={product.imageURL} 
                alt={product.name}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.dataAiHint}
            />
        </div>
        <h3 className="font-semibold text-sm text-gray-800 mb-1 h-10 flex items-center justify-center">{product.name}</h3>
        <div className="flex justify-center items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>
        <p className="text-md font-semibold text-gray-800 mb-3">₹{product.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex justify-center items-center gap-2 mb-2">
            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus className="h-3 w-3" />
            </Button>
            <span className="font-semibold text-sm w-8 text-center">{quantity}</span>
            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setQuantity(q => q + 1)}>
                <Plus className="h-3 w-3" />
            </Button>
        </div>
        <Button variant="outline" size="sm" className="text-xs" onClick={handleAddToCart}>
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Add to Cart
        </Button>
        <Link href={`/deliverypage/${product.id}?quantity=${quantity}`} passHref>
          <Button size="sm" className="w-full bg-green-500 hover:bg-green-600 text-xs">
              Buy Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
