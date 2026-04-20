import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plane, FileText, Briefcase, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

const LOGO_URL = "/manus-storage/success-inc-logo_d6eee728.png";

// 3D Hero Section with CSS animations
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent/5 via-background to-background"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-4000"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="mb-8 animate-fade-in">
          <img
            src={LOGO_URL}
            alt="Success Inc."
            className="h-20 w-auto object-contain mx-auto mb-8"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Your Journey to Global Success
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Expert travel, visa, and immigration services to make your dreams a reality. Trusted by thousands of travelers worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8">
            <a href="#services" className="flex items-center gap-2">
              Explore Services <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            <a href="#contact">Get Started</a>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto text-center">
          <div>
            <p className="text-3xl font-bold text-accent">10K+</p>
            <p className="text-sm text-muted-foreground">Happy Travelers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent">98%</p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent">50+</p>
            <p className="text-sm text-muted-foreground">Destinations</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Services Showcase Section
function ServicesSection() {
  const { data: services, isLoading } = trpc.services.list.useQuery();

  const serviceIcons = {
    flight: <Plane className="w-8 h-8" />,
    visit_visa: <FileText className="w-8 h-8" />,
    work_permit: <Briefcase className="w-8 h-8" />,
  };

  const defaultServices = [
    {
      id: 1,
      name: "Flight Tickets",
      category: "flight",
      shortDescription: "Book international and domestic flights with ease",
      description: "We help you find and book the best flight options to your destination with competitive prices.",
    },
    {
      id: 2,
      name: "Canada Visit Visa",
      category: "visit_visa",
      shortDescription: "Complete visa assistance for Canada",
      description: "Expert guidance through the entire Canadian visa application process.",
    },
    {
      id: 3,
      name: "UK Visit Visa",
      category: "visit_visa",
      shortDescription: "Hassle-free UK visa services",
      description: "Professional support for your UK visa application with high approval rates.",
    },
    {
      id: 4,
      name: "Australia Visit Visa",
      category: "visit_visa",
      shortDescription: "Australian visa expertise",
      description: "Comprehensive assistance for Australian visitor visas.",
    },
    {
      id: 5,
      name: "Schengen Visa",
      category: "visit_visa",
      shortDescription: "Access to Europe with Schengen visa",
      description: "Navigate the Schengen visa process with our expert team.",
    },
    {
      id: 6,
      name: "Work Permit Visa",
      category: "work_permit",
      shortDescription: "Employment visa solutions",
      description: "Get the right work permit for your international career goals.",
    },
  ];

  const displayServices = services || defaultServices;

  return (
    <section id="services" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive travel and visa solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service: any) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <a>
                <Card className="h-full p-6 hover:shadow-lg hover:border-accent transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-accent group-hover:scale-110 transition-transform">
                      {serviceIcons[service.category as keyof typeof serviceIcons] || <Plane className="w-8 h-8" />}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.shortDescription}</p>
                  <p className="text-accent font-medium text-sm group-hover:underline">Learn more →</p>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const { data: testimonials } = trpc.testimonials.list.useQuery();

  const defaultTestimonials = [
    {
      id: 1,
      customerName: "Ahmed Hassan",
      customerTitle: "Software Engineer",
      rating: 5,
      quote: "Success Inc. made my visa process incredibly smooth. Highly recommended!",
      service: "Canada Visit Visa",
    },
    {
      id: 2,
      customerName: "Fatima Khan",
      customerTitle: "Student",
      rating: 5,
      quote: "Professional, reliable, and always helpful. Best experience ever!",
      service: "UK Visit Visa",
    },
    {
      id: 3,
      customerName: "Rajesh Patel",
      customerTitle: "Business Owner",
      rating: 5,
      quote: "Excellent service and fast processing. Highly satisfied with the results.",
      service: "Work Permit Visa",
    },
  ];

  const displayTestimonials = testimonials || defaultTestimonials;

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied travelers who trusted us with their journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayTestimonials.map((testimonial: any) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.customerName}</p>
                <p className="text-sm text-muted-foreground">{testimonial.customerTitle}</p>
                <p className="text-xs text-accent mt-1">{testimonial.service}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Address</h3>
                <p className="text-muted-foreground">
                  N.K. Tower (3rd Floor), Shahjalal Upashohor, Sylhet, Bangladesh
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <a href="mailto:info@successinc.pro.bd" className="text-accent hover:underline">
                  info@successinc.pro.bd
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <p className="text-muted-foreground">+880 (Phone Number)</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/success.inc24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-foreground transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.instagram.com/success.inc22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-foreground transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your message..."
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
