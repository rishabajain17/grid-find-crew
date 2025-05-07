
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, userType } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Determine dashboard URL based on user type
  const getDashboardUrl = () => {
    switch (userType) {
      case 'team':
        return '/dashboard/team';
      case 'driver':
        return '/dashboard/driver';
      case 'engineer':
        return '/dashboard/engineer';
      default:
        return '/';
    }
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
                <Link to={getDashboardUrl()}>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User size={18} />
                    <span>Dashboard</span>
                  </Button>
                </Link>
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
                <Link
                  to={getDashboardUrl()}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-gray-50"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
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
