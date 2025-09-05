
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const JacksnackLogo = () => (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12H22" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-bold text-xl text-gray-800">JACKSNACK</span>
    </div>
  );

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t text-gray-600">
      <div className="container py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 space-y-4">
            <JacksnackLogo />
            <p className="text-sm">
                Authentic and flavorful snacks delivered to your door.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gray-800">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-800">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-800">
                <Youtube className="w-5 h-5" />
              </Link>
               <Link href="#" className="text-gray-400 hover:text-gray-800">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-gray-800">Home</Link></li>
              <li><Link href="/buy" className="hover:text-gray-800">Products</Link></li>
              <li><Link href="#" className="hover:text-gray-800">Combos</Link></li>
              <li><Link href="/#about" className="hover:text-gray-800">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/#contact" className="hover:text-gray-800">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-gray-800">FAQ</Link></li>
              <li><Link href="#" className="hover:text-gray-800">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm">
                <li><p>Email: info@jacksnack.com</p></li>
                <li><p>Phone: +91 81233 63394</p></li>
                <li><p>Address: Kotturu, Karnataka, India</p></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto py-4 flex justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} JACKSNACK. All rights reserved.</p>
          <p>Designed by <a href="#" className="text-cyan-500 hover:underline">Studio</a></p>
        </div>
      </div>
    </footer>
  );
}
