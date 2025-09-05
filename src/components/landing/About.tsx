export default function About() {
  return (
    <section id="about" className="bg-secondary py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">About JACKSNACK</h2>
            <p className="text-lg text-muted-foreground">
              Founded on the principle of innovation, JACKSNACK is dedicated to pushing the boundaries of what's possible. We believe in creating products that not only perform exceptionally but also inspire a new generation of creators and professionals. Our journey is one of relentless pursuit of perfection and a commitment to our customers.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-primary tracking-tighter">Our Vision</h3>
            <p className="text-lg text-muted-foreground">
              Our vision is to empower every individual with technology that feels intuitive and powerful. We are building a future where design and functionality merge seamlessly, creating experiences that are both beautiful and efficient. We strive to be at the forefront of the technological revolution, leading with integrity and passion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
