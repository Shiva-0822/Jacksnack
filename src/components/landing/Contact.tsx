"use client";

import { Button } from "@/components/ui/button";
import ContactForm from "./ContactForm";

export default function Contact() {

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact-form');
    if(contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      <section id="contact" className="relative py-16 md:py-24 lg:py-32 text-white"
        style={{
          background: 'linear-gradient(90deg, #1A3327 0%, #224430 50%, #2A553A 100%)',
        }}>
        <div className="absolute inset-0 bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jZMAN/u/n38D8z0AGxjDTiGqbaBqTqGka06hpGvOfi/8HFgAASGUF/iY/3B4AAAAASUVORK5CYII=)] bg-repeat [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Ready to Get Started?</h2>
              <p className="text-lg text-white/80">
                We're here to help you with any questions or inquiries. Reach out to us and we'll get back to you as soon as possible.
              </p>
              <Button size="lg" className="bg-white hover:bg-gray-200 text-green-800 font-bold text-lg px-8 py-6 rounded-md transition-transform hover:scale-105" onClick={handleContactClick}>
                CONTACT US
              </Button>
            </div>
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-md overflow-hidden">
                <iframe
                    className="w-full h-full"
                    src="https://www.google.com/maps?q=Kotturu&output=embed"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Interactive map of Kotturu"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactForm />
    </>
  );
}
    