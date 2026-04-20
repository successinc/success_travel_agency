import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Plane, Globe, Users, Star, MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import Globe3D from "@/components/Globe3D";
import "@/styles/premium-design.css";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// Image URLs from S3
const IMAGES = {
  destination1: "/manus-storage/Fh78b3YhtWWo_b963ea7f.jpg",
  destination2: "/manus-storage/8sbskcbi4mgx_9f8d83d2.jpg",
  destination3: "/manus-storage/oeC9CcbdCJDB_3e4549d3.jpg",
  sunset: "/manus-storage/rO8wJQADaX4e_be055e46.jpg",
  flight: "/manus-storage/spb4Bi0QMM0f_197afb76.jpg",
  visa: "/manus-storage/57IoVhPC4tdC.jpeg",
  passport: "/manus-storage/vTStkJGr2Qj3_6a8591d7.jpg",
  travel: "/manus-storage/3ELSwPsRZwl9_471038fc.jpg",
};

const services = [
  {
    id: 1,
    name: "Flight Tickets",
    icon: "✈️",
    shortDesc: "Book domestic and international flights",
    fullDesc: "Get the best deals on flights worldwide with our expert booking service",
    processing: "1-2 hours",
    requirements: "Valid ID, Passport",
    image: IMAGES.flight,
  },
  {
    id: 2,
    name: "Canada Visa",
    icon: "🍁",
    shortDesc: "Study, Work & Immigration",
    fullDesc: "Complete visa processing for Canada with high success rate",
    processing: "4-6 weeks",
    requirements: "Documents, Medical exam",
    image: IMAGES.visa,
  },
  {
    id: 3,
    name: "UK Visa",
    icon: "🇬🇧",
    shortDesc: "Student & Work Visas",
    fullDesc: "Expert guidance for UK visa applications",
    processing: "3-4 weeks",
    requirements: "Passport, Proof of funds",
    image: IMAGES.passport,
  },
  {
    id: 4,
    name: "Australia Visa",
    icon: "🦘",
    shortDesc: "Work & Skilled Migration",
    fullDesc: "Comprehensive Australia visa solutions",
    processing: "2-3 weeks",
    requirements: "Skills assessment, IELTS",
    image: IMAGES.destination2,
  },
  {
    id: 5,
    name: "Schengen Visa",
    icon: "🇪🇺",
    shortDesc: "Europe Travel & Work",
    fullDesc: "Access to 27 European countries",
    processing: "2-3 weeks",
    requirements: "Travel insurance, Itinerary",
    image: IMAGES.destination1,
  },
  {
    id: 6,
    name: "Work Permit",
    icon: "💼",
    shortDesc: "Employment Authorization",
    fullDesc: "Professional work permits globally",
    processing: "3-4 weeks",
    requirements: "Job offer, Qualifications",
    image: IMAGES.travel,
  },
];

const testimonials = [
  {
    name: "Ahmed Hassan",
    country: "Bangladesh",
    rating: 5,
    text: "Success Inc. made my Canada visa process so smooth. Highly recommended!",
    image: IMAGES.destination1,
  },
  {
    name: "Fatima Khan",
    country: "Bangladesh",
    rating: 5,
    text: "Professional service with excellent support. Got my UK visa in 3 weeks!",
    image: IMAGES.destination2,
  },
  {
    name: "Rajesh Patel",
    country: "India",
    rating: 5,
    text: "Best travel agency I've worked with. Amazing results!",
    image: IMAGES.sunset,
  },
];

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
                  <div className="flip-card h-96 cursor-pointer group overflow-hidden rounded-2xl">
                    <div className="flip-card-inner relative w-full h-full">
                      {/* Front */}
                      <div className="flip-card-front glass-card p-8 flex flex-col justify-between h-full bg-cover bg-center" style={{backgroundImage: `url(${service.image})`}}>
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all"></div>
                        <div className="relative z-10">
                          <div className="w-16 h-16 rounded-xl bg-gradient-accent mb-4 flex items-center justify-center text-white text-3xl">
                            {service.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                          <p className="text-gray-200 text-sm">{service.shortDesc}</p>
                        </div>
                        <div className="relative z-10 flex items-center text-green-400 group-hover:translate-x-2 transition-transform">
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
              <div key={idx} className="glass-card p-8 hover:shadow-lg transition-all overflow-hidden rounded-2xl">
                <div className="relative mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
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
            {/* Contact Info with Image */}
            <div className="space-y-8">
              <div className="rounded-2xl overflow-hidden h-64 mb-8">
                <img src={IMAGES.destination3} alt="Office Location" className="w-full h-full object-cover" />
              </div>

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
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/success.inc22"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-gradient-accent flex items-center justify-center text-white hover:shadow-lg transition-all hover:scale-110"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                    placeholder="Your phone"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 h-32 resize-none"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button className="btn-premium w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
