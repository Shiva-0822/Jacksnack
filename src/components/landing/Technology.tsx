import Image from 'next/image';
import { Wind, Leaf, Sprout } from 'lucide-react';

const features = [
  {
    icon: <Wind className="w-10 h-10 text-primary" />,
    title: 'Vacuum Frying',
    description: 'Our innovative vacuum frying technology ensures minimal oil absorption and maximum nutrient retention.',
  },
  {
    icon: <Leaf className="w-10 h-10 text-primary" />,
    title: 'Healthy',
    description: 'We prioritize your well-being with products that are low in fat and free from artificial preservatives.',
  },
  {
    icon: <Sprout className="w-10 h-10 text-primary" />,
    title: 'Natural',
    description: 'Experience the pure taste of natural ingredients, sourced responsibly and crafted with care.',
  },
];

export default function Technology() {
  return (
    <section id="tech" className="bg-secondary py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">The Technology Behind Our Success</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">Innovation that drives quality and performance, ensuring our products are second to none.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <Image
              src="/images/steam.png"
              alt="Technology"
              width={600}
              height={500}
              className="rounded-lg shadow-lg object-cover"
              data-ai-hint="machine technology"
            />
          </div>
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
