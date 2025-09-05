
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { collection, onSnapshot, query, Firestore, DocumentData, doc, deleteDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


interface CartContextType {
  cart: (Product & {id: string})[];
  loading: boolean;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({ cart: [], loading: true, removeItem: async () => {}, clearCart: async () => {} });

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<(Product & {id: string})[]>([]);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState<Firestore | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      setDb(getFirebaseDb());
    } catch(e) {
      console.error(e);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    if (!user || !db) {
      toast({ title: "Error", description: "You must be logged in to modify your cart.", variant: "destructive" });
      return;
    }
    
    const itemToRemove = cart.find(item => item.id === itemId);
    
    try {
      const itemRef = doc(db, 'carts', user.uid, 'items', itemId);
      await deleteDoc(itemRef);
       toast({
          title: "Item removed",
          description: `${itemToRemove?.name} has been removed from your cart.`,
      });
    } catch (error) {
      console.error("Error removing item: ", error);
      toast({ title: "Error", description: "Could not remove item. Please try again.", variant: "destructive" });
    }
  }, [user, db, cart, toast]);

  const clearCart = useCallback(async () => {
    if (!user || !db) {
      toast({ title: "Error", description: "You must be logged in to clear your cart.", variant: "destructive" });
      return;
    }
    try {
      // This is a simplified clear cart. For production, you might run this on a backend
      // to avoid many individual delete operations from the client.
      const cartRef = collection(db, 'carts', user.uid, 'items');
      const deletePromises = cart.map(item => deleteDoc(doc(cartRef, item.id)));
      await Promise.all(deletePromises);
      
    } catch (error) {
      console.error("Error clearing cart: ", error);
      toast({ title: "Error", description: "Could not clear cart. Please try again.", variant: "destructive" });
    }
  }, [user, db, cart, toast]);


  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!user || !db) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const cartRef = collection(db, 'carts', user.uid, 'items');
    const q = query(cartRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: (Product & {id: string})[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as (Product & {id: string}));
      });
      setCart(items);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching cart:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, db]);

  return (
    <CartContext.Provider value={{ cart, loading, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
