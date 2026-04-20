import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const LOGO_URL = "/manus-storage/success-inc-logo_d6eee728.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="glass-card px-6 py-4 rounded-2xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                  src={LOGO_URL}
                  alt="Success Inc."
                  className="h-10 w-auto object-contain"
                />
                <span className="text-lg font-bold gradient-text hidden sm:inline">Success Inc.</span>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className="text-gray-300 hover:text-green-400 transition-colors font-medium">
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <a className="text-gray-300 hover:text-green-400 transition-colors font-medium">
                      {user?.name || "Dashboard"}
                    </a>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                    className="border-green-400 text-green-400 hover:bg-green-400/10"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="btn-premium"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className="block text-gray-300 hover:text-green-400 transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <a className="block text-gray-300 hover:text-green-400 transition-colors font-medium py-2">
                        Dashboard
                      </a>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-400 text-green-400 hover:bg-green-400/10"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="w-full btn-premium"
                    onClick={() => {
                      window.location.href = getLoginUrl();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
