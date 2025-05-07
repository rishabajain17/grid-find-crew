
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Banknote } from "lucide-react";
import { toast } from "sonner";

// A sample application interface
interface Application {
  id: string;
  seatId: string;
  teamName: string;
  eventName: string;
  carType: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "pending" | "accepted" | "rejected";
  appliedDate: string;
}

const DriverApplications = () => {
  // In a real app, this would come from an API call
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app1",
      seatId: "seat1",
      teamName: "Velocity Racing",
      eventName: "European GT Challenge",
      carType: "GT4 - Mercedes AMG GT4",
      location: "Spa-Francorchamps, Belgium",
      startDate: "2025-07-10",
      endDate: "2025-07-12",
      price: 15000,
      status: "pending",
      appliedDate: "2025-05-01",
    },
    {
      id: "app2",
      seatId: "seat2",
      teamName: "Apex Motorsport",
      eventName: "ADAC GT Masters",
      carType: "GT3 - Audi R8 LMS",
      location: "Nürburgring, Germany",
      startDate: "2025-06-15",
      endDate: "2025-06-17",
      price: 25000,
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

  return (
    <DashboardLayout title="My Applications" userType="driver">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Race Seat Applications</h2>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700">No applications yet</h3>
            <p className="text-gray-500 mt-2">Start browsing available race seats to apply</p>
            <Button className="mt-4 bg-racing-red hover:bg-racing-red/90">
              Browse Seats
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{app.eventName}</h3>
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
                      <span>${app.price.toLocaleString()}</span>
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

export default DriverApplications;
