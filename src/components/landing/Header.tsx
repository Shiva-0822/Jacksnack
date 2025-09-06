
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn } from "lucide-react";
import Image from "next/image";
import UserProfileButton from "@/components/auth/UserProfileButton";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "/#about" },
  { name: "Products", href: "#products" },
  { name: "Tech", href: "#tech" },
  { name: "Reviews", href: "#reviews" },
  { name: "Team", href: "#team" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [activeLink, setActiveLink] = useState("#home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [isClient]);

  const NavContent = () => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setIsMenuOpen(false)}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            activeLink === link.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );

  return (
    <>
      <header className={cn("sticky top-0 z-50 w-full border-b transition-all", isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background")}>
        <div className="container flex h-16 items-center px-0 md:px-6">
          <Link href="#home" className="mr-6 flex items-center space-x-2 pl-4 md:pl-0">
            <Image src="/images/logo.png" alt="Logo" width={100} height={50} data-ai-hint="logo" />
          </Link>
          <nav className="hidden md:flex flex-grow items-center space-x-6 text-sm font-medium">
            <NavContent />
          </nav>
          
          <div className="flex flex-1 items-center justify-end gap-2 pr-4 md:pr-0">
            <div className="hidden sm:flex">
              <UserProfileButton />
            </div>
             <Link href="/deliverypage">
                <Button size="sm">Buy Now</Button>
             </Link>
            <div className="md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top">
                     <SheetTitle>Navigation Menu</SheetTitle>
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                       <Link href="#home" className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <Image src="https://picsum.photos/100/50?random=20" alt="Logo" width={100} height={50} data-ai-hint="logo" />
                        </Link>
                      <NavContent />
                       <div className="sm:hidden">
                          <UserProfileButton />
                       </div>
                    </nav>
                  </SheetContent>
                </Sheet>
            </div>
          </div>

        </div>
      </header>
    </>
  );
}
