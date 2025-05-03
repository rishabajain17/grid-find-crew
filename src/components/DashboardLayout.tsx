
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarLinkProps {
  to: string;
  children: ReactNode;
  isActive: boolean;
}

const SidebarLink = ({ to, children, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? "bg-racing-red/10 text-racing-red"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userType: "team" | "driver" | "engineer";
}

const DashboardLayout = ({ children, title, userType }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Sidebar navigation links based on user type
  const getNavLinks = () => {
    switch (userType) {
      case "team":
        return (
          <>
            <SidebarLink
              to="/dashboard/team"
              isActive={isActive("/dashboard/team")}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink
              to="/post-seat"
              isActive={isActive("/post-seat")}
            >
              Post Race Seat
            </SidebarLink>
            <SidebarLink
              to="/post-job"
              isActive={isActive("/post-job")}
            >
              Post Job
            </SidebarLink>
            <SidebarLink
              to="/dashboard/team/applications"
              isActive={isActive("/dashboard/team/applications")}
            >
              Applications
            </SidebarLink>
            <SidebarLink
              to="/dashboard/team/messages"
              isActive={isActive("/dashboard/team/messages")}
            >
              Messages
            </SidebarLink>
          </>
        );
      case "driver":
        return (
          <>
            <SidebarLink
              to="/dashboard/driver"
              isActive={isActive("/dashboard/driver")}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink
              to="/seats"
              isActive={isActive("/seats")}
            >
              Browse Seats
            </SidebarLink>
            <SidebarLink
              to="/dashboard/driver/saved"
              isActive={isActive("/dashboard/driver/saved")}
            >
              Saved Seats
            </SidebarLink>
            <SidebarLink
              to="/dashboard/driver/applications"
              isActive={isActive("/dashboard/driver/applications")}
            >
              My Applications
            </SidebarLink>
            <SidebarLink
              to="/dashboard/driver/messages"
              isActive={isActive("/dashboard/driver/messages")}
            >
              Messages
            </SidebarLink>
          </>
        );
      case "engineer":
        return (
          <>
            <SidebarLink
              to="/dashboard/engineer"
              isActive={isActive("/dashboard/engineer")}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink
              to="/jobs"
              isActive={isActive("/jobs")}
            >
              Browse Jobs
            </SidebarLink>
            <SidebarLink
              to="/dashboard/engineer/saved"
              isActive={isActive("/dashboard/engineer/saved")}
            >
              Saved Jobs
            </SidebarLink>
            <SidebarLink
              to="/dashboard/engineer/applications"
              isActive={isActive("/dashboard/engineer/applications")}
            >
              My Applications
            </SidebarLink>
            <SidebarLink
              to="/dashboard/engineer/messages"
              isActive={isActive("/dashboard/engineer/messages")}
            >
              Messages
            </SidebarLink>
          </>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    // In a real app, we would handle logout logic here
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`bg-white border-r transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col`}
      >
        <div className="p-4 flex items-center">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-racing-red rounded-full flex items-center justify-center">
              <span className="text-white font-display font-bold">R</span>
            </div>
            {isSidebarOpen && (
              <span className="ml-2 text-xl font-display font-semibold text-racing-navy">
                Race<span className="text-racing-red">Platform</span>
              </span>
            )}
          </Link>
          <button
            className="ml-auto text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        
        <Separator />
        
        <div className="flex-1 py-4 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {getNavLinks()}
          </nav>

          <div className="px-2 py-4 mt-auto">
            <Separator className="mb-4" />
            {isSidebarOpen ? (
              <>
                <Link to="/settings">
                  <Button variant="outline" className="w-full mb-2">
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-gray-700"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Link to="/settings">
                  <Button size="icon" variant="ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleLogout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm11.707 5.707a1 1 0 00-1.414-1.414L9 11.586l-1.293-1.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l5-5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-display font-semibold text-gray-900">{title}</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
