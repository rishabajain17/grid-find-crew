
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/team" element={<TeamDashboard />} />
          <Route path="/dashboard/team/applications" element={<TeamApplications />} />
          <Route path="/dashboard/team/messages" element={<TeamMessages />} />
          <Route path="/dashboard/driver" element={<DriverDashboard />} />
          <Route path="/dashboard/driver/applications" element={<DriverApplications />} />
          <Route path="/dashboard/driver/saved" element={<DriverSaved />} />
          <Route path="/dashboard/driver/messages" element={<DriverMessages />} />
          <Route path="/dashboard/engineer" element={<EngineerDashboard />} />
          <Route path="/dashboard/engineer/applications" element={<EngineerApplications />} />
          <Route path="/dashboard/engineer/saved" element={<EngineerSaved />} />
          <Route path="/dashboard/engineer/messages" element={<EngineerMessages />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/seats/:id" element={<SeatDetail />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/post-seat" element={<PostSeat />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
