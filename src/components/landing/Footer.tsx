import Link from 'next/link';
import { Facebook, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

const JacksnackLogo = () => (
  <div className="flex items-center gap-2">
    <Image src="/images/logo.png" alt="Logo" width={100} height={50} data-ai-hint="logo" />
  </div>
);


export default function Footer() {
  return (
    <footer className="bg-secondary border-t text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 space-y-4">
             <JacksnackLogo />
            <p className="text-sm">
              Our mission is to preserve the holistic traditional values and local ethos in the rural world, even while achieving progress by employing updated, innovative technology.
            </p>
          </div>
          <div className="col-span-1 md:col-start-3 space-y-4">
            <h3 className="font-semibold text-foreground">Talk To Us</h3>
            <a href="mailto:info@jacksnack.com" className="text-primary hover:underline">info@jacksnack.com</a>
            <div className="flex space-x-2">
              <Link href="#" className="p-2 bg-background rounded-md shadow-md hover:bg-accent transition-colors">
                <Facebook className="w-5 h-5 text-primary" />
              </Link>
              <Link href="tel:+918123363394" className="p-2 bg-background rounded-md shadow-md hover:bg-accent transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </Link>
              <Link href="mailto:info@jacksnack.com" className="p-2 bg-background rounded-md shadow-md hover:bg-accent transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 flex justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} JACKSNACK. All rights reserved.</p>
          <p>Designed by <a href="#" className="text-primary hover:underline">Studio</a></p>
        </div>
      </div>
    </footer>
  );
}
