
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Twitter, ShoppingCart, Trash2, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import UserProfileButton from '@/components/auth/UserProfileButton';

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "PRODUCTS", href: "/deliverypage", active: true },
  { name: "COMBOS", href: "#" },
  { name: "ABOUT US", href: "/#about" },
  { name: "CONTACT US", href: "/#contact" },
  { name: "BLOGS", href: "#" },
];

export default function Header() {
  const { cart, loading, removeItem } = useCart();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const NavContent = () => (
    <nav className="flex flex-col gap-6 text-lg font-medium mt-8">
      {navLinks.map((link) => (
         <Link
          key={link.name}
          href={link.href}
          onClick={() => setIsMenuOpen(false)}
          className={`font-medium pb-1 ${link.active ? 'text-gray-900 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-900'}`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
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
                <Image src="/images/logo.png" alt="KARANTH'S Logo" width={100} height={50} data-ai-hint="logo" />
            </Link>
          </div>
          
          <nav className="hidden md:flex flex-grow justify-center">
            <ul className="flex items-center gap-8">
              {navLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className={`font-medium pb-1 ${link.active ? 'text-gray-900 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-900'}`}>
                      {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center gap-4">
            <UserProfileButton />
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
                      <SheetClose asChild>
                        <Link href="/deliverypage" passHref>
                           <Button className="mt-6">Continue Shopping</Button>
                        </Link>
                      </SheetClose>
                    </div>
                  ) : (
                    <>
                    <ScrollArea className="flex-1 -mx-6 px-6">
                      <div className="divide-y divide-gray-200">
                        {cart.map(item => (
                          <div key={item.id} className="py-6 flex items-start gap-4">
                            <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
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
                              <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8"
                              onClick={() => handleRemoveItem(item.id)}
                              aria-label={`Remove ${item.name} from cart`}
                              >
                               <Trash2 className="w-4 h-4" />
                            </Button>
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
                          <SheetClose asChild>
                             <Link href="/checkout" passHref>
                              <Button className="w-full mt-4">View Cart & Checkout</Button>
                            </Link>
                          </SheetClose>
                       </div>
                    </SheetFooter>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>
                            <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                <Image src="https://picsum.photos/100/50?random=20" alt="KARANTH'S Logo" width={100} height={50} data-ai-hint="logo" />
                            </Link>
                        </SheetTitle>
                    </SheetHeader>
                    <NavContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
