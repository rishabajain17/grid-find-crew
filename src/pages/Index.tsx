
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SeatCard from "@/components/SeatCard";
import JobCard from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  // Fetch featured seats from Supabase
  const { data: featuredSeats, isLoading: seatsLoading } = useQuery({
    queryKey: ['featuredSeats'],
    queryFn: async () => {
      const { data: seatsData, error: seatsError } = await supabase
        .from('seats')
        .select(`
          id,
          car_type,
          event_name,
          location,
          date_start,
          date_end,
          price,
          team_id,
          status
        `)
        .eq('status', 'open')
        .limit(3);

      if (seatsError) {
        console.error('Error fetching featured seats:', seatsError);
        toast.error('Failed to load featured race seats');
        return [];
      }

      // Get team info for each seat
      const seatsWithTeamInfo = await Promise.all(
        seatsData.map(async (seat) => {
          const { data: teamData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', seat.team_id)
            .single();

          return {
            id: seat.id,
            carType: seat.car_type,
            eventName: seat.event_name,
            location: seat.location,
            startDate: seat.date_start,
            endDate: seat.date_end,
            price: seat.price,
            teamName: teamData?.full_name || 'Unknown Team',
            teamLogo: teamData?.avatar_url,
            status: seat.status,
          };
        })
      );

      return seatsWithTeamInfo;
    },
    refetchOnWindowFocus: false
  });

  // Fetch featured jobs from Supabase
  const { data: featuredJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['featuredJobs'],
    queryFn: async () => {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          location,
          date_start,
          date_end,
          pay_rate,
          payment_term,
          team_id,
          status
        `)
        .eq('status', 'open')
        .limit(3);

      if (jobsError) {
        console.error('Error fetching featured jobs:', jobsError);
        toast.error('Failed to load featured engineering jobs');
        return [];
      }

      // Get team info for each job
      const jobsWithTeamInfo = await Promise.all(
        jobsData.map(async (job) => {
          const { data: teamData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', job.team_id)
            .single();

          return {
            id: job.id,
            roleTitle: job.title,
            teamName: teamData?.full_name || 'Unknown Team',
            teamLogo: teamData?.avatar_url,
            location: job.location,
            startDate: job.date_start,
            endDate: job.date_end,
            payRate: job.pay_rate,
            isFullTime: job.payment_term === 'annual',
            paymentTerm: job.payment_term,
            status: job.status,
          };
        })
      );

      return jobsWithTeamInfo;
    },
    refetchOnWindowFocus: false
  });

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
                RaceConnext brings together all key stakeholders in motorsport to create
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
              {seatsLoading ? (
                <div className="col-span-3 flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red"></div>
                </div>
              ) : featuredSeats && featuredSeats.length > 0 ? (
                featuredSeats.map((seat) => (
                  <SeatCard key={seat.id} {...seat} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No race seats available at the moment.</p>
                </div>
              )}
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
              {jobsLoading ? (
                <div className="col-span-3 flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-blue"></div>
                </div>
              ) : featuredJobs && featuredJobs.length > 0 ? (
                featuredJobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No engineering jobs available at the moment.</p>
                </div>
              )}
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
