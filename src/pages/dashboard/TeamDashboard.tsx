
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const TeamDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or not a team
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/dashboard/team' } });
      return;
    }
    
    if (profile && profile.user_type !== 'team') {
      toast.error("Only team accounts can access this dashboard");
      navigate('/');
    }
  }, [user, profile, navigate]);

  // Fetch team's race seats
  const { data: seats = [], isLoading: seatsLoading } = useQuery({
    queryKey: ['teamSeats', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('team_id', user.id);
        
      if (error) {
        toast.error('Failed to load race seat listings');
        console.error('Error fetching team seats:', error);
        return [];
      }
      
      return data.map(seat => ({
        id: seat.id,
        carType: seat.car_type,
        eventName: seat.event_name,
        location: seat.location,
        startDate: seat.date_start,
        endDate: seat.date_end,
        status: seat.status,
        // For a real app, fetch the actual count of applicants from a join table
        applicants: Math.floor(Math.random() * 10) // Placeholder - simulate random applicants
      }));
    },
    enabled: !!user?.id
  });

  // Fetch team's job listings
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['teamJobs', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('team_id', user.id);
        
      if (error) {
        toast.error('Failed to load job listings');
        console.error('Error fetching team jobs:', error);
        return [];
      }
      
      return data.map(job => ({
        id: job.id,
        roleTitle: job.title,
        location: job.location,
        startDate: job.date_start,
        endDate: job.date_end,
        status: job.status,
        // For a real app, fetch the actual count of applicants from a join table
        applicants: Math.floor(Math.random() * 15) // Placeholder - simulate random applicants
      }));
    },
    enabled: !!user?.id
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const statusBadge = (status: "open" | "pending" | "filled") => {
    const colors = {
      open: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      filled: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout title="Team Dashboard" userType="team">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold mb-4">
          Welcome, {profile?.full_name || "Team Member"}
        </h2>
        <p className="text-gray-600">
          Manage your race seat listings and engineering job postings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Race Seats</CardTitle>
            <CardDescription>Currently posted race seats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-red">
              {seatsLoading ? "..." : seats.filter(seat => seat.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Job Listings</CardTitle>
            <CardDescription>Currently posted job positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-blue">
              {jobsLoading ? "..." : jobs.filter(job => job.status === "open").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Applications</CardTitle>
            <CardDescription>Across all your listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-navy">
              {seatsLoading || jobsLoading ? "..." : 
                seats.reduce((total, seat) => total + seat.applicants, 0) + 
                jobs.reduce((total, job) => total + job.applicants, 0)
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-display font-bold">Your Listings</h3>
        <div className="flex gap-4">
          <Link to="/post-seat">
            <Button className="bg-racing-red hover:bg-racing-red/90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post Seat
            </Button>
          </Link>
          <Link to="/post-job">
            <Button className="bg-racing-blue hover:bg-racing-blue/90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Post Job
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="seats" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="seats">Race Seats</TabsTrigger>
          <TabsTrigger value="jobs">Engineering Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seats">
          {seatsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red"></div>
            </div>
          ) : seats.length > 0 ? (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Car & Event</th>
                      <th className="px-6 py-3 text-left font-medium">Date</th>
                      <th className="px-6 py-3 text-left font-medium">Location</th>
                      <th className="px-6 py-3 text-left font-medium">Status</th>
                      <th className="px-6 py-3 text-left font-medium">Applicants</th>
                      <th className="px-6 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {seats.map((seat) => (
                      <tr key={seat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{seat.carType}</div>
                          <div className="text-gray-500">{seat.eventName}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatDate(seat.startDate)} - {formatDate(seat.endDate)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{seat.location}</td>
                        <td className="px-6 py-4">{statusBadge(seat.status)}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium">{seat.applicants}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/seats/${seat.id}/manage`}
                            className="text-racing-red hover:text-racing-red/80 font-medium text-sm"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't posted any race seats yet.</p>
              <Link to="/post-seat">
                <Button className="bg-racing-red hover:bg-racing-red/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Post Your First Seat
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="jobs">
          {jobsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-blue"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium">Role</th>
                      <th className="px-6 py-3 text-left font-medium">Date</th>
                      <th className="px-6 py-3 text-left font-medium">Location</th>
                      <th className="px-6 py-3 text-left font-medium">Status</th>
                      <th className="px-6 py-3 text-left font-medium">Applicants</th>
                      <th className="px-6 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{job.roleTitle}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatDate(job.startDate)} - {formatDate(job.endDate)}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{job.location}</td>
                        <td className="px-6 py-4">{statusBadge(job.status)}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium">{job.applicants}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/jobs/${job.id}/manage`}
                            className="text-racing-blue hover:text-racing-blue/80 font-medium text-sm"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't posted any engineering jobs yet.</p>
              <Link to="/post-job">
                <Button className="bg-racing-blue hover:bg-racing-blue/90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Post Your First Job
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TeamDashboard;
