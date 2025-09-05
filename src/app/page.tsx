"use client";

import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Products from '@/components/landing/Products';
import Technology from '@/components/landing/Technology';
import Reviews from '@/components/landing/Reviews';
import Team from '@/components/landing/Team';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import BackToTopButton from '@/components/landing/BackToTopButton';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Products />
        <Technology />
        <Reviews />
        <Team />
        <Contact />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
}
