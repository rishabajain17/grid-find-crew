
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const TeamDashboard = () => {
  // Sample data for team dashboard
  const [seats] = useState([
    {
      id: "1",
      carType: "GT4 - Mercedes AMG",
      eventName: "European GT Challenge",
      location: "Spa-Francorchamps, Belgium",
      startDate: "2025-07-10",
      endDate: "2025-07-12",
      status: "open" as const,
      applicants: 4,
    },
    {
      id: "2",
      carType: "Formula 4",
      eventName: "F4 British Championship",
      location: "Silverstone, UK",
      startDate: "2025-06-05",
      endDate: "2025-06-07",
      status: "pending" as const,
      applicants: 7,
    },
  ]);

  const [jobs] = useState([
    {
      id: "1",
      roleTitle: "Race Engineer",
      location: "Milton Keynes, UK",
      startDate: "2025-06-01",
      endDate: "2025-10-30",
      status: "open" as const,
      applicants: 12,
    },
    {
      id: "2",
      roleTitle: "Data Analyst",
      location: "Stuttgart, Germany",
      startDate: "2025-05-15",
      endDate: "2025-09-15",
      status: "filled" as const,
      applicants: 9,
    },
  ]);

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
        <h2 className="text-2xl font-display font-bold mb-4">Welcome, Velocity Racing Team</h2>
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
            <div className="text-3xl font-bold text-racing-red">{seats.filter(seat => seat.status === "open").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Job Listings</CardTitle>
            <CardDescription>Currently posted job positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-blue">{jobs.filter(job => job.status === "open").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Applications</CardTitle>
            <CardDescription>Across all your listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-navy">
              {seats.reduce((total, seat) => total + seat.applicants, 0) + 
                jobs.reduce((total, job) => total + job.applicants, 0)}
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
        </TabsContent>
        
        <TabsContent value="jobs">
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TeamDashboard;
