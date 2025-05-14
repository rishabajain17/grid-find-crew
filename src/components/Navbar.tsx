
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, userType, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced debug effect to track auth state
  useEffect(() => {
    console.log("Navbar: Auth state updated - User:", !!user, "UserType:", userType, "Profile:", profile);
  }, [user, userType, profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Determine dashboard URL based on user type
  const getDashboardUrl = () => {
    console.log("Navbar: Getting dashboard URL for userType:", userType);
    switch (userType) {
      case 'team':
        return '/dashboard/team';
      case 'driver':
        return '/dashboard/driver';
      case 'engineer':
        return '/dashboard/engineer';
      case 'management':
        return '/dashboard/management';
      default:
        console.warn("No valid user type found for dashboard redirection, using fallback");
        return '/';
    }
  };

  // Add a direct navigation handler for dashboard
  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be signed in to access your dashboard");
      navigate("/login");
      return;
    }
    
    if (!userType) {
      toast.error("Could not determine your user type. Please try signing out and back in.");
      return;
    }
    
    const url = getDashboardUrl();
    console.log("Navigating to dashboard:", url);
    
    navigate(url);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-racing-red rounded-full flex items-center justify-center">
                <span className="text-white font-display font-bold">R</span>
              </div>
              <span className="ml-2 text-xl font-display font-semibold text-racing-navy">
                Race<span className="text-racing-red">connect</span>
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-racing-red px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/seats" className="text-gray-700 hover:text-racing-red px-3 py-2 text-sm font-medium">
                Race Seats
              </Link>
              <Link to="/jobs" className="text-gray-700 hover:text-racing-red px-3 py-2 text-sm font-medium">
                Engineering Jobs
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-racing-red px-3 py-2 text-sm font-medium">
                About
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  onClick={handleDashboardClick}
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-racing-red flex items-center space-x-2"
                  onClick={handleSignOut}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" className="bg-racing-red hover:bg-racing-red/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-racing-red focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/seats"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Race Seats
            </Link>
            <Link
              to="/jobs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Engineering Jobs
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {user ? (
              <>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleDashboardClick}
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-gray-50"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-racing-red"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
