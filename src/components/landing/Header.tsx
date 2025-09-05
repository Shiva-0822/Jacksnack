"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Tech", href: "#tech" },
  { name: "Reviews", href: "#reviews" },
  { name: "Team", href: "#team" },
  { name: "Contact", href: "#contact" },
];

const JacksnackLogo = () => (
  <div className="flex items-center gap-2">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12H22" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="font-bold text-xl text-foreground">JACKSNACK</span>
  </div>
);

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
    <header className={cn("sticky top-0 z-50 w-full border-b transition-all", isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background")}>
      <div className="container flex h-16 items-center justify-center px-4 md:px-6">
        <Link href="#home" className="mr-6 flex items-center space-x-2">
          <JacksnackLogo />
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <NavContent />
        </nav>
        <div className="flex flex-1 items-center justify-end md:hidden">
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
                    <JacksnackLogo />
                  </Link>
                <NavContent />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
