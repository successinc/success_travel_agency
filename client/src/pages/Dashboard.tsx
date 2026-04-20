import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: userBookings, isLoading: bookingsLoading } = trpc.bookings.listUserBookings.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (loading || bookingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please Log In</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your dashboard and bookings.
          </p>
          <Button
            className="w-full"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Login Now
          </Button>
        </Card>
      </div>
    );
  }

  // Use real bookings from database, or empty array if none
  const bookings = userBookings || [];

  const getStatusColor = (status: string | null) => {
    const safeStatus = status || "pending";
    switch (safeStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string | null) => {
    const safeStatus = status || "pending";
    return safeStatus.replace("_", " ").charAt(0).toUpperCase() + safeStatus.slice(1).replace("_", " ");
  };

  const getServiceName = (serviceId: number) => {
    const serviceNames: Record<number, string> = {
      1: "Flight Tickets",
      2: "Canada Visit Visa",
      3: "UK Visit Visa",
      4: "Australia Visit Visa",
      5: "Schengen Visa",
      6: "Work Permit Visa",
    };
    return serviceNames[serviceId] || "Service";
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {user?.name}!</h1>
          <p className="text-lg text-muted-foreground">Manage your bookings and applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-foreground">{bookings.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Pending Applications</p>
            <p className="text-3xl font-bold text-accent">
              {bookings.filter((b: any) => b.status === "pending").length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter((b: any) => b.status === "completed").length}
            </p>
          </Card>
        </div>

        {/* Bookings List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Bookings</h2>

          {bookings.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your journey by booking a service with us
              </p>
              <Link href="/#services">
                <a>
                  <Button>
                    Browse Services <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {getServiceName(booking.serviceId)}
                        </h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Travel: {booking.travelDate || "Not specified"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span>To: {booking.destination || "Not specified"}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Track Status
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/#services">
              <a>
                <Card className="p-6 hover:shadow-lg hover:border-accent transition-all cursor-pointer">
                  <h3 className="text-lg font-semibold text-foreground mb-2">New Booking</h3>
                  <p className="text-muted-foreground text-sm">
                    Apply for a new service or booking
                  </p>
                </Card>
              </a>
            </Link>
            <Link href="/#contact">
              <a>
                <Card className="p-6 hover:shadow-lg hover:border-accent transition-all cursor-pointer">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Contact Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Get help with your bookings
                  </p>
                </Card>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
