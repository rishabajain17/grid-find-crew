
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import SeatCard from "@/components/SeatCard";

const DriverDashboard = () => {
  // Sample data for driver dashboard
  const recentApplications = [
    {
      id: "1",
      carType: "GT4 - Mercedes AMG",
      eventName: "European GT Challenge",
      location: "Spa-Francorchamps, Belgium",
      date: "July 10-12, 2025",
      teamName: "Velocity Racing",
      status: "Under Review",
      appliedDate: "2025-04-15",
    },
    {
      id: "2",
      carType: "Formula 4",
      eventName: "F4 British Championship",
      location: "Silverstone, UK",
      date: "June 5-7, 2025",
      teamName: "Apex Motorsport",
      status: "Interview Scheduled",
      appliedDate: "2025-04-10",
    },
  ];

  // Recommended seats for the driver based on their profile
  const recommendedSeats = [
    {
      id: "3",
      carType: "GT3 - Ferrari 488",
      eventName: "International GT Open",
      location: "Barcelona, Spain",
      startDate: "2025-09-15",
      endDate: "2025-09-17",
      price: 18000,
      teamName: "ProRacing GT",
      status: "open" as const,
    },
    {
      id: "4",
      carType: "Formula Regional",
      eventName: "Formula Regional European Championship",
      location: "Monza, Italy",
      startDate: "2025-07-22",
      endDate: "2025-07-24",
      price: 12500,
      teamName: "European Racing",
      status: "open" as const,
    },
    {
      id: "5",
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

  return (
    <DashboardLayout title="Driver Dashboard" userType="driver">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold mb-4">Welcome, John Driver</h2>
        <p className="text-gray-600">
          Find race seats and manage your applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Applications</CardTitle>
            <CardDescription>Seats you've applied to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-red">{recentApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Seats</CardTitle>
            <CardDescription>Seats you've bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-blue">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile Completion</CardTitle>
            <CardDescription>Increase visibility to teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-racing-navy mr-2">80%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-racing-red h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <Link to="/profile" className="text-sm text-racing-red hover:text-racing-red/80 mt-2 inline-block">
              Complete Profile
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Recent Applications</h3>
          <Link to="/dashboard/driver/applications" className="text-sm text-racing-red hover:text-racing-red/80">
            View All
          </Link>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Car & Event</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Team</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Applied</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{app.carType}</div>
                      <div className="text-gray-500">{app.eventName}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{app.date}</td>
                    <td className="px-6 py-4 text-gray-700">{app.teamName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        app.status === "Under Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/dashboard/driver/applications/${app.id}`}
                        className="text-racing-red hover:text-racing-red/80 font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Recommended For You</h3>
          <Link to="/seats">
            <Button variant="outline">Browse All Seats</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedSeats.map((seat) => (
            <SeatCard key={seat.id} {...seat} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;
