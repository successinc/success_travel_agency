import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plane, Globe, Users, Star, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import Globe3D from "@/components/Globe3D";
import "@/styles/premium-design.css";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const createContactMutation = trpc.bookings.create.useMutation();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createContactMutation.mutateAsync({
        serviceId: 0,
        fullName: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone || undefined,
        message: contactForm.message || undefined,
        userId: 0,
        status: "pending",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success("Message sent! We'll contact you soon.");
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with 3D Globe */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-in">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  <span className="gradient-text">Your Journey to</span>
                  <br />
                  <span className="text-white">Global Success</span>
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  Expert travel, visa, and immigration services to make your dreams a reality. Trusted by thousands of travelers worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/#services">
                  <a>
                    <Button className="btn-premium w-full sm:w-auto">
                      Explore Services <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto glass border-green-400 text-white hover:bg-green-500/20"
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = getLoginUrl();
                    }
                  }}
                >
                  {isAuthenticated ? "View Dashboard" : "Get Started"}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold gradient-text">10K+</div>
                  <div className="text-sm text-gray-400">Happy Travelers</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold gradient-text">98%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-bold gradient-text">50+</div>
                  <div className="text-sm text-gray-400">Destinations</div>
                </div>
              </div>
            </div>

            {/* Right - 3D Globe */}
            <div className="relative h-96 lg:h-full min-h-96 rounded-2xl overflow-hidden glass-lg">
              <Globe3D />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-5xl font-bold mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-400">Choose from our comprehensive range of travel and visa solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Link key={idx} href={`/services/${service.id}`}>
                <a>
                  <div className="flip-card h-96 cursor-pointer group">
                    <div className="flip-card-inner relative w-full h-full">
                      {/* Front */}
                      <div className="flip-card-front glass-card p-8 flex flex-col justify-between h-full">
                        <div>
                          <div className="w-16 h-16 rounded-xl bg-gradient-accent mb-4 flex items-center justify-center text-white text-2xl">
                            {service.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                          <p className="text-gray-400 text-sm">{service.shortDesc}</p>
                        </div>
                        <div className="flex items-center text-green-400 group-hover:translate-x-2 transition-transform">
                          Learn More <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>

                      {/* Back */}
                      <div className="flip-card-back glass-card p-8 flex flex-col justify-center h-full">
                        <p className="text-gray-200 text-sm mb-4">{service.fullDesc}</p>
                        <div className="space-y-2">
                          <p className="text-sm"><span className="text-green-400 font-semibold">Processing:</span> {service.processing}</p>
                          <p className="text-sm"><span className="text-green-400 font-semibold">Requirements:</span> {service.requirements}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-5xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-400">Real stories from successful travelers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="glass-card p-8 hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-5xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-400">Have questions? We're here to help</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">Address</h3>
                    <p className="text-gray-400">N.K. Tower (3rd Floor), Shahjalal Upashohor, Sylhet, Bangladesh</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">Phone</h3>
                    <p className="text-gray-400">+8801613076654</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">Email</h3>
                    <p className="text-gray-400">info@successinc.pro.bd</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/success.inc24"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center text-white hover:shadow-lg transition-all hover:scale-110"
                  >
                    f
                  </a>
                  <a
                    href="https://www.instagram.com/success.inc22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center text-white hover:shadow-lg transition-all hover:scale-110"
                  >
                    📷
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="glass-card p-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Phone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="+880..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                      rows={4}
                      placeholder="Your message..."
                    ></textarea>
                  </div>

                  <Button className="btn-premium w-full">Send Message</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Success Inc.</h3>
              <p className="text-gray-400 text-sm">Your trusted partner for global travel and immigration services.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-green-400 transition">Flight Tickets</a></li>
                <li><a href="#services" className="hover:text-green-400 transition">Visit Visas</a></li>
                <li><a href="#services" className="hover:text-green-400 transition">Work Permits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#contact" className="hover:text-green-400 transition">Contact</a></li>
                <li><a href="#testimonials" className="hover:text-green-400 transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Success Inc. All rights reserved. | On Travel Agency</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const services = [
  {
    id: 1,
    name: "Flight Tickets",
    icon: "✈️",
    shortDesc: "Book international and domestic flights with ease",
    fullDesc: "Access to major airlines worldwide with competitive pricing and flexible booking options.",
    processing: "1-3 business days",
    requirements: "Valid passport, travel dates",
  },
  {
    id: 2,
    name: "Canada Visa",
    icon: "🍁",
    shortDesc: "Complete visa assistance for visiting Canada",
    fullDesc: "Expert guidance through the entire Canadian visa application process with high approval rates.",
    processing: "2-4 weeks",
    requirements: "Passport, proof of funds, employment letter",
  },
  {
    id: 3,
    name: "UK Visa",
    icon: "🇬🇧",
    shortDesc: "Hassle-free UK visa services",
    fullDesc: "Professional guidance ensuring your application meets all UK requirements.",
    processing: "3-6 weeks",
    requirements: "Passport, accommodation details, return ticket",
  },
  {
    id: 4,
    name: "Australia Visa",
    icon: "🇦🇺",
    shortDesc: "Australian visa expertise with proven success",
    fullDesc: "Get your Australian visitor visa with confidence and expert guidance.",
    processing: "2-3 weeks",
    requirements: "Passport, health requirements, financial proof",
  },
  {
    id: 5,
    name: "Schengen Visa",
    icon: "🇪🇺",
    shortDesc: "Navigate the Schengen visa process",
    fullDesc: "Access to 27 European countries with one visa and expert support.",
    processing: "2-4 weeks",
    requirements: "Passport, travel insurance, accommodation",
  },
  {
    id: 6,
    name: "Work Permit",
    icon: "💼",
    shortDesc: "Employment visa solutions",
    fullDesc: "Get the right work permit for your international career goals.",
    processing: "4-8 weeks",
    requirements: "Job offer, employment contract, qualifications",
  },
];

const testimonials = [
  {
    name: "Ahmed Hassan",
    country: "Bangladesh",
    rating: 5,
    text: "Success Inc. made my Canada visa process incredibly smooth. Highly recommended!",
  },
  {
    name: "Fatima Khan",
    country: "Bangladesh",
    rating: 5,
    text: "Professional team, quick processing, and excellent support throughout the journey.",
  },
  {
    name: "Karim Rahman",
    country: "Bangladesh",
    rating: 5,
    text: "Got my UK visa approved on first attempt. Success Inc. knows exactly what they're doing!",
  },
];
