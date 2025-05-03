
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeatCard from "@/components/SeatCard";
import JobCard from "@/components/JobCard";

const Index = () => {
  // Sample data for featured listings
  const featuredSeats = [
    {
      id: "1",
      carType: "GT4 - Mercedes AMG",
      eventName: "European GT Challenge",
      location: "Spa-Francorchamps, Belgium",
      startDate: "2025-07-10",
      endDate: "2025-07-12",
      price: 15000,
      teamName: "Velocity Racing",
      status: "open" as const,
    },
    {
      id: "2",
      carType: "Formula 4",
      eventName: "F4 British Championship",
      location: "Silverstone, UK",
      startDate: "2025-06-05",
      endDate: "2025-06-07",
      price: 8500,
      teamName: "Apex Motorsport",
      status: "open" as const,
    },
    {
      id: "3",
      carType: "LMP3 Prototype",
      eventName: "European Le Mans Series",
      location: "Monza, Italy",
      startDate: "2025-08-15",
      endDate: "2025-08-17",
      price: 22000,
      teamName: "Endurance Pro Team",
      status: "open" as const,
    },
  ];

  const featuredJobs = [
    {
      id: "1",
      roleTitle: "Race Engineer",
      teamName: "Velocity Racing",
      location: "Milton Keynes, UK",
      startDate: "2025-06-01",
      endDate: "2025-10-30",
      payRate: 85000,
      isFullTime: true,
      status: "open" as const,
    },
    {
      id: "2",
      roleTitle: "Data Analyst",
      teamName: "Apex Motorsport",
      location: "Stuttgart, Germany",
      startDate: "2025-05-15",
      endDate: "2025-09-15",
      payRate: 450,
      isFullTime: false,
      status: "open" as const,
    },
    {
      id: "3",
      roleTitle: "Performance Engineer",
      teamName: "Endurance Pro Team",
      location: "Maranello, Italy",
      startDate: "2025-06-01",
      endDate: "2025-12-31",
      payRate: 92000,
      isFullTime: true,
      status: "open" as const,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-racing-navy text-white py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 checkered-flag"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                <span className="text-racing-red">Racing</span> Teams,{" "}
                <span className="text-racing-blue">Drivers</span> & Engineers
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-300">
                Connect with racing teams, find your next seat, discover engineering opportunities, 
                all in one dedicated motorsport marketplace.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-racing-red hover:bg-racing-red/90 text-white w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/seats">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Browse Race Seats
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                RacePlatform brings together all key stakeholders in motorsport to create
                a seamless experience for teams, drivers, and engineers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-racing-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-racing-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">For Teams</h3>
                <p className="text-gray-600">
                  Post available race seats or engineering positions, review applications, 
                  and connect directly with qualified candidates.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-racing-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-racing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">For Drivers</h3>
                <p className="text-gray-600">
                  Create your profile, showcase your experience, browse available race seats, 
                  and apply directly to opportunities that match your skillset.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-racing-navy/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-racing-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">For Engineers</h3>
                <p className="text-gray-600">
                  Highlight your technical expertise, find job opportunities across various racing categories,
                  and connect with teams looking for your specific skillset.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Race Seats */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Race Seats</h2>
              <Link to="/seats" className="text-racing-red hover:text-racing-red/80 font-medium">
                View All Seats
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSeats.map((seat) => (
                <SeatCard key={seat.id} {...seat} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Engineering Jobs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Engineering Jobs</h2>
              <Link to="/jobs" className="text-racing-blue hover:text-racing-blue/80 font-medium">
                View All Jobs
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} {...job} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-racing-navy text-white relative">
          <div className="absolute inset-0 opacity-10 checkered-flag"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Join the Racing Community?</h2>
              <p className="text-lg md:text-xl mb-8 text-gray-300">
                Create your profile today and start connecting with the global motorsport ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-racing-red hover:bg-racing-red/90 text-white w-full sm:w-auto">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
