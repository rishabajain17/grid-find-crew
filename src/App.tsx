
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeamDashboard from "./pages/dashboard/TeamDashboard";
import DriverDashboard from "./pages/dashboard/DriverDashboard";
import EngineerDashboard from "./pages/dashboard/EngineerDashboard";
import TeamApplications from "./pages/dashboard/TeamApplications";
import TeamMessages from "./pages/dashboard/TeamMessages";
import DriverApplications from "./pages/dashboard/DriverApplications";
import DriverSaved from "./pages/dashboard/DriverSaved";
import DriverMessages from "./pages/dashboard/DriverMessages";
import EngineerApplications from "./pages/dashboard/EngineerApplications";
import EngineerSaved from "./pages/dashboard/EngineerSaved";
import EngineerMessages from "./pages/dashboard/EngineerMessages";
import Seats from "./pages/Seats";
import Jobs from "./pages/Jobs";
import SeatDetail from "./pages/SeatDetail";
import JobDetail from "./pages/JobDetail";
import PostSeat from "./pages/PostSeat";
import PostJob from "./pages/PostJob";
import About from "./pages/About";
import { ReactNode } from "react";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedUserTypes = null 
}: { 
  children: ReactNode, 
  allowedUserTypes?: string[] | null 
}) => {
  const { user, isLoading, userType } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType || '')) {
    // Redirect based on user type
    if (userType === 'team') {
      return <Navigate to="/dashboard/team" replace />;
    } else if (userType === 'driver') {
      return <Navigate to="/dashboard/driver" replace />;
    } else if (userType === 'engineer') {
      return <Navigate to="/dashboard/engineer" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
    {/* Team routes */}
    <Route path="/dashboard/team" element={
      <ProtectedRoute allowedUserTypes={['team', 'admin']}>
        <TeamDashboard />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/team/applications" element={
      <ProtectedRoute allowedUserTypes={['team', 'admin']}>
        <TeamApplications />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/team/messages" element={
      <ProtectedRoute allowedUserTypes={['team', 'admin']}>
        <TeamMessages />
      </ProtectedRoute>
    } />
    
    {/* Driver routes */}
    <Route path="/dashboard/driver" element={
      <ProtectedRoute allowedUserTypes={['driver', 'admin']}>
        <DriverDashboard />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/driver/applications" element={
      <ProtectedRoute allowedUserTypes={['driver', 'admin']}>
        <DriverApplications />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/driver/saved" element={
      <ProtectedRoute allowedUserTypes={['driver', 'admin']}>
        <DriverSaved />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/driver/messages" element={
      <ProtectedRoute allowedUserTypes={['driver', 'admin']}>
        <DriverMessages />
      </ProtectedRoute>
    } />
    
    {/* Engineer routes */}
    <Route path="/dashboard/engineer" element={
      <ProtectedRoute allowedUserTypes={['engineer', 'admin']}>
        <EngineerDashboard />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/engineer/applications" element={
      <ProtectedRoute allowedUserTypes={['engineer', 'admin']}>
        <EngineerApplications />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/engineer/saved" element={
      <ProtectedRoute allowedUserTypes={['engineer', 'admin']}>
        <EngineerSaved />
      </ProtectedRoute>
    } />
    <Route path="/dashboard/engineer/messages" element={
      <ProtectedRoute allowedUserTypes={['engineer', 'admin']}>
        <EngineerMessages />
      </ProtectedRoute>
    } />
    
    {/* Public routes */}
    <Route path="/seats" element={<Seats />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/seats/:id" element={<SeatDetail />} />
    <Route path="/jobs/:id" element={<JobDetail />} />
    
    {/* Protected action routes */}
    <Route path="/post-seat" element={
      <ProtectedRoute allowedUserTypes={['team', 'admin']}>
        <PostSeat />
      </ProtectedRoute>
    } />
    <Route path="/post-job" element={
      <ProtectedRoute allowedUserTypes={['team', 'admin']}>
        <PostJob />
      </ProtectedRoute>
    } />
    
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
