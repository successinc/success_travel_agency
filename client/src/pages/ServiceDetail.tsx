import { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:id");
  const serviceId = parseInt(params?.id || "0");
  const { isAuthenticated, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    passportNumber: "",
    dateOfBirth: "",
    travelDate: "",
    destination: "",
    message: "",
  });

  const createBookingMutation = trpc.bookings.create.useMutation();

  // Mock service data - in production, fetch from API
  const services: Record<number, any> = {
    1: {
      id: 1,
      name: "Flight Tickets",
      category: "flight",
      description: "Book international and domestic flights with ease. We help you find the best routes and prices for your travel needs.",
      requirements: "Valid passport, travel dates, destination information",
      processingTime: "1-3 business days",
      highlights: [
        "Access to major airlines worldwide",
        "Competitive pricing",
        "24/7 customer support",
        "Flexible booking options",
      ],
    },
    2: {
      id: 2,
      name: "Canada Visit Visa",
      category: "visit_visa",
      description: "Complete visa assistance for visiting Canada. Our expert team will guide you through the entire application process.",
      requirements: "Valid passport, proof of funds, employment letter, travel itinerary",
      processingTime: "2-4 weeks",
      highlights: [
        "High approval rates",
        "Expert document preparation",
        "Interview coaching",
        "Fast-track processing available",
      ],
    },
    3: {
      id: 3,
      name: "UK Visit Visa",
      category: "visit_visa",
      description: "Hassle-free UK visa services with professional guidance. We ensure your application meets all UK requirements.",
      requirements: "Valid passport, proof of funds, accommodation details, return ticket",
      processingTime: "3-6 weeks",
      highlights: [
        "Comprehensive document review",
        "Visa application support",
        "Appointment scheduling assistance",
        "Post-visa support",
      ],
    },
    4: {
      id: 4,
      name: "Australia Visit Visa",
      category: "visit_visa",
      description: "Australian visa expertise with proven success. Get your Australian visitor visa with confidence.",
      requirements: "Valid passport, health requirements, financial proof, travel plans",
      processingTime: "2-3 weeks",
      highlights: [
        "Quick processing",
        "Expert guidance on requirements",
        "Health check coordination",
        "Visa approval support",
      ],
    },
    5: {
      id: 5,
      name: "Schengen Visa",
      category: "visit_visa",
      description: "Navigate the Schengen visa process with our expert team. Access to 27 European countries with one visa.",
      requirements: "Valid passport, travel insurance, accommodation, financial proof",
      processingTime: "2-4 weeks",
      highlights: [
        "Multi-country access",
        "Expert document preparation",
        "Embassy coordination",
        "Visa extension support",
      ],
    },
    6: {
      id: 6,
      name: "Work Permit Visa",
      category: "work_permit",
      description: "Employment visa solutions for your international career. Get the right work permit for your goals.",
      requirements: "Job offer letter, employment contract, qualifications, health check",
      processingTime: "4-8 weeks",
      highlights: [
        "Employer coordination",
        "Work permit processing",
        "Family visa support",
        "Career consultation",
      ],
    },
  };

  const service = services[serviceId];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Service Not Found</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBookingMutation.mutateAsync({
        serviceId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        passportNumber: formData.passportNumber || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        travelDate: formData.travelDate || undefined,
        destination: formData.destination || undefined,
        message: formData.message || undefined,
        userId: 0,
        status: "pending",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (result.success) {
        toast.success("Application submitted successfully! We will contact you soon.");
        setFormData({
          fullName: user?.name || "",
          email: user?.email || "",
          phone: "",
          passportNumber: "",
          dateOfBirth: "",
          travelDate: "",
          destination: "",
          message: "",
        });
        setShowForm(false);
      }
    } catch (error: any) {
      toast.error(`Error submitting application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-accent hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">{service.name}</h1>
              <p className="text-lg text-muted-foreground mb-8">{service.description}</p>

              {/* Key Information */}
              <div className="grid grid-cols-2 gap-6 mb-8 py-8 border-y border-border">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">PROCESSING TIME</h3>
                  <p className="text-2xl font-bold text-foreground">{service.processingTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">CATEGORY</h3>
                  <p className="text-2xl font-bold text-accent capitalize">{service.category.replace("_", " ")}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Requirements</h2>
                <p className="text-muted-foreground">{service.requirements}</p>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Us</h2>
                <ul className="space-y-3">
                  {service.highlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Booking Form Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-foreground mb-6">Get Started</h3>

              {!showForm ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Ready to apply for this service? Fill out the form to submit your inquiry.
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => setShowForm(true)}
                  >
                    Start Application
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center">
                      You'll need to be logged in to submit an application.
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      placeholder="+880..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Travel Date</label>
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Destination</label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                      placeholder="Where are you going?"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <Button
                      type="submit"
                      className="w-full"
                      size="sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => setShowForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
