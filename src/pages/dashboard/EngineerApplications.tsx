
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Banknote } from "lucide-react";
import { toast } from "sonner";

// A sample application interface
interface Application {
  id: string;
  jobId: string;
  teamName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  payRate: number;
  isFullTime: boolean;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
}

const EngineerApplications = () => {
  // In a real app, this would come from an API call
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app1",
      jobId: "job1",
      teamName: "Velocity Racing",
      jobTitle: "Race Engineer - Full Season",
      location: "Munich, Germany",
      startDate: "2025-03-01",
      endDate: "2025-10-30",
      payRate: 85000,
      isFullTime: true,
      status: "pending",
      appliedDate: "2025-05-01",
    },
    {
      id: "app2",
      jobId: "job2",
      teamName: "FastLane Racing",
      jobTitle: "Data Engineer - Weekend Contract",
      location: "Silverstone, UK",
      startDate: "2025-07-08",
      endDate: "2025-07-10",
      payRate: 500,
      isFullTime: false,
      status: "accepted",
      appliedDate: "2025-04-20",
    },
  ]);

  const handleWithdraw = (id: string) => {
    // In a real app, this would make an API call
    setApplications(applications.filter(app => app.id !== id));
    toast.success("Application withdrawn successfully");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatPayRate = (payRate: number, isFullTime: boolean) => {
    if (isFullTime) {
      return `$${payRate.toLocaleString()} / year`;
    } else {
      return `$${payRate.toLocaleString()} / day`;
    }
  };

  return (
    <DashboardLayout title="My Applications" userType="engineer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Job Applications</h2>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700">No applications yet</h3>
            <p className="text-gray-500 mt-2">Start browsing available jobs to apply</p>
            <Button className="mt-4 bg-racing-red hover:bg-racing-red/90">
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{app.jobTitle}</h3>
                    <p className="text-sm text-gray-600">{app.teamName}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{app.location}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Banknote className="mr-1 h-4 w-4" />
                      <span>{formatPayRate(app.payRate, app.isFullTime)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">{getStatusBadge(app.status)}</div>
                    <div className="text-xs text-gray-500">Applied on {new Date(app.appliedDate).toLocaleDateString()}</div>
                    {app.status === "pending" && (
                      <Button 
                        variant="outline" 
                        className="mt-4 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleWithdraw(app.id)}
                      >
                        Withdraw
                      </Button>
                    )}
                    {app.status === "accepted" && (
                      <Button 
                        variant="outline"
                        className="mt-4 text-racing-blue border-racing-blue hover:bg-racing-blue/10"
                      >
                        Contact Team
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EngineerApplications;
