
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

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "PRODUCTS", href: "/buy", active: true },
  { name: "COMBOS", href: "#" },
  { name: "ABOUT US", href: "/#about" },
  { name: "CONTACT US", href: "/#contact" },
  { name: "BLOGS", href: "#" },
];

export default function Header() {
  const { user } = useAuth();
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
                <Link href={link.href} className={`font-medium pb-1 ${link.active ? 'text-gray-900 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-900'}`}>
                    {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-gray-900"><Search className="w-5 h-5" /></button>
          
          {user ? (
            <Button onClick={handleLogout} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
            </Button>
          ) : (
            <Link href="/login" passHref>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}

          <button className="relative text-gray-500 hover:text-gray-900">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}
