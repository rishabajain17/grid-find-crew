
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import JobCard from "@/components/JobCard";

const EngineerDashboard = () => {
  // Sample data for engineer dashboard
  const recentApplications = [
    {
      id: "1",
      role: "Race Engineer",
      teamName: "Velocity Racing",
      location: "Milton Keynes, UK",
      date: "June 1 - October 30, 2025",
      status: "Under Review",
      appliedDate: "2025-04-12",
    },
    {
      id: "2",
      role: "Data Analyst",
      teamName: "Apex Motorsport",
      location: "Stuttgart, Germany",
      date: "May 15 - September 15, 2025",
      status: "Interview Scheduled",
      appliedDate: "2025-04-08",
    },
  ];

  // Recommended jobs for the engineer based on their profile
  const recommendedJobs = [
    {
      id: "3",
      roleTitle: "Aerodynamics Engineer",
      teamName: "Racing Dynamics",
      teamLogo: undefined,
      location: "Hinwil, Switzerland",
      startDate: "2025-06-15",
      endDate: "2025-12-15",
      payRate: 95000,
      isFullTime: true,
      status: "open" as const,
    },
    {
      id: "4",
      roleTitle: "Performance Engineer",
      teamName: "Speed Factor",
      teamLogo: undefined,
      location: "Oxford, UK",
      startDate: "2025-07-01",
      endDate: "2025-10-30",
      payRate: 650,
      isFullTime: false,
      status: "open" as const,
    },
    {
      id: "5",
      roleTitle: "Data Engineer",
      teamName: "GT Masters",
      teamLogo: undefined,
      location: "Munich, Germany",
      startDate: "2025-05-20",
      endDate: "2025-09-20",
      payRate: 78000,
      isFullTime: true,
      status: "open" as const,
    },
  ];

  return (
    <DashboardLayout title="Engineer Dashboard" userType="engineer">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold mb-4">Welcome, Jane Engineer</h2>
        <p className="text-gray-600">
          Find engineering opportunities and manage your applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Applications</CardTitle>
            <CardDescription>Jobs you've applied to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-blue">{recentApplications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Jobs</CardTitle>
            <CardDescription>Jobs you've bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-racing-red">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profile Completion</CardTitle>
            <CardDescription>Increase visibility to teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-racing-navy mr-2">70%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-racing-blue h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <Link to="/profile" className="text-sm text-racing-blue hover:text-racing-blue/80 mt-2 inline-block">
              Complete Profile
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-display font-bold">Recent Applications</h3>
          <Link to="/dashboard/engineer/applications" className="text-sm text-racing-blue hover:text-racing-blue/80">
            View All
          </Link>
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Role</th>
                  <th className="px-6 py-3 text-left font-medium">Team</th>
                  <th className="px-6 py-3 text-left font-medium">Location</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Applied</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{app.role}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{app.teamName}</td>
                    <td className="px-6 py-4 text-gray-700">{app.location}</td>
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
                        to={`/dashboard/engineer/applications/${app.id}`}
                        className="text-racing-blue hover:text-racing-blue/80 font-medium text-sm"
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
          <Link to="/jobs">
            <Button variant="outline">Browse All Jobs</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EngineerDashboard;
