
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Twitter, Search, User, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getFirebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Auth } from 'firebase/auth';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "PRODUCTS", href: "/buy" },
  { name: "COMBOS", href: "#" },
  { name: "ABOUT US", href: "/#about" },
  { name: "CONTACT US", href: "/#contact" },
  { name: "BLOGS", href: "#" },
];

export default function Header() {
  const { user } = useAuth();
  const { cart, loading } = useCart();
  const router = useRouter();
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    setAuth(getFirebaseAuth());
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <header className="bg-white text-gray-800 border-b">
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto flex flex-col items-center justify-center px-4 md:px-6 text-sm space-y-2">
          <div>
            <p>Hello and Welcome to Our Online Store!</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-cyan-300 transition-colors"><Facebook className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-cyan-300 transition-colors"><Instagram className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-cyan-300 transition-colors"><Youtube className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-cyan-300 transition-colors"><Twitter className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-6">
        <div className="flex-shrink-0">
          <Link href="/">
              <Image src="https://picsum.photos/100/50?random=20" alt="KARANTH'S Logo" width={100} height={50} data-ai-hint="logo" />
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-grow justify-center">
          <ul className="flex items-center gap-8">
            {navLinks.map(link => (
              <li key={link.name}>
                <Link href={link.href} className={`font-medium pb-1 text-gray-500 hover:text-gray-900`}>
                    {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-gray-900"><Search className="w-5 h-5" /></button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.email && <DropdownMenuItem disabled><span className='text-xs text-muted-foreground'>{user.email}</span></DropdownMenuItem>}
                <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" passHref>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <button className="relative text-gray-500 hover:text-gray-900">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{loading ? '...' : cart.length}</span>
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Your Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm">Looks like you haven't added anything to your cart yet.</p>
                    <SheetTrigger asChild>
                      <Link href="/buy" passHref>
                         <Button className="mt-6">Continue Shopping</Button>
                      </Link>
                    </SheetTrigger>
                  </div>
                ) : (
                  <>
                  <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="divide-y divide-gray-200">
                      {cart.map(item => (
                        <div key={item.id} className="py-6 flex items-center gap-4">
                          <div className="w-24 h-24 relative rounded-md overflow-hidden">
                             <Image
                                src={item.imageURL}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <p>Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <SheetFooter className="bg-gray-50 -mx-6 px-6 py-4 border-t">
                     <div className="w-full">
                       <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                       </div>
                       <p className="text-xs text-gray-500 mt-1">Shipping and taxes calculated at checkout.</p>
                        <SheetTrigger asChild>
                           <Link href="/checkout" passHref>
                            <Button className="w-full mt-4">View Cart & Checkout</Button>
                          </Link>
                        </SheetTrigger>
                     </div>
                  </SheetFooter>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
