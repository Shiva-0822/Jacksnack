import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import type { TeamMember } from '@/lib/types';
import { User } from 'lucide-react';

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Martinez',
    role: 'CEO & Founder',
    bio: 'The visionary behind JACKSNACK, driving the company towards a future of innovation and excellence.',
    imageURL: 'https://picsum.photos/200/200?random=6',
  },
  {
    id: '2',
    name: 'Jessica Lee',
    role: 'Chief Technology Officer',
    bio: 'The mastermind of our tech, Jessica leads the engineering team with passion and expertise.',
    imageURL: 'https://picsum.photos/200/200?random=7',
  },
  {
    id: '3',
    name: 'David Rodriguez',
    role: 'Head of Design',
    bio: 'David crafts the stunning aesthetics of our products, blending form and function seamlessly.',
    imageURL: 'https://picsum.photos/200/200?random=8',
  },
  {
    id: '4',
    name: 'Emily White',
    role: 'Marketing Director',
    bio: 'Emily tells the story of JACKSNACK, connecting our brand with audiences around the world.',
    imageURL: 'https://picsum.photos/200/200?random=9',
  },
];

export default function Team() {
  return (
    <section id="team" className="py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Meet the Team</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">The brilliant minds behind JACKSNACK, dedicated to innovation and quality.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="text-center transition-all hover:shadow-xl hover:scale-105">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <User className="w-20 h-20 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl font-bold">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                <p className="text-muted-foreground mt-2 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
