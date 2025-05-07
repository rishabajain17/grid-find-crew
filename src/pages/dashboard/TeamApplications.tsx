
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Banknote, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";

// A sample application interface
interface Application {
  id: string;
  listingId: string;
  listingType: "seat" | "job";
  listingTitle: string;
  location: string;
  dates: string;
  applicantId: string;
  applicantName: string;
  applicantPhoto?: string;
  applicantDetails: string;
  message: string;
  appliedDate: string;
  status: "pending" | "accepted" | "rejected";
}

const TeamApplications = () => {
  // In a real app, this would come from an API call
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "app1",
      listingId: "seat1",
      listingType: "seat",
      listingTitle: "European GT Challenge - GT4 Mercedes AMG GT4",
      location: "Spa-Francorchamps, Belgium",
      dates: "July 10-12, 2025",
      applicantId: "driver1",
      applicantName: "John Smith",
      applicantPhoto: undefined,
      applicantDetails: "GT4 Driver with 3 years experience",
      message: "I'm very interested in this opportunity. I have extensive experience with GT4 machinery and have raced at Spa multiple times.",
      appliedDate: "2025-05-01",
      status: "pending",
    },
    {
      id: "app2",
      listingId: "job1",
      listingType: "job",
      listingTitle: "Race Engineer - Full Season",
      location: "Munich, Germany",
      dates: "2025 Season",
      applicantId: "engineer1",
      applicantName: "Emily Johnson",
      applicantPhoto: undefined,
      applicantDetails: "F3 and GT Race Engineer",
      message: "I have 5 years of experience as a race engineer in various categories including F3 and GT racing. I'd love to join your team for the upcoming season.",
      appliedDate: "2025-04-28",
      status: "pending",
    },
    {
      id: "app3",
      listingId: "job2",
      listingType: "job",
      listingTitle: "Data Engineer - Weekend Contract",
      location: "Silverstone, UK",
      dates: "Aug 5-7, 2025",
      applicantId: "engineer2",
      applicantName: "Michael Chen",
      applicantPhoto: undefined,
      applicantDetails: "Data Engineer with 7 years experience",
      message: "I specialize in data analysis for racing teams and have worked with various telemetry systems. I'm available for the Silverstone event.",
      appliedDate: "2025-04-30",
      status: "accepted",
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "seats") return app.listingType === "seat";
    if (activeTab === "jobs") return app.listingType === "job";
    if (activeTab === "pending") return app.status === "pending";
    if (activeTab === "accepted") return app.status === "accepted";
    if (activeTab === "rejected") return app.status === "rejected";
    return true;
  });

  const handleAccept = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: "accepted" } : app
    ));
    toast.success("Application accepted");
  };

  const handleReject = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: "rejected" } : app
    ));
    toast.success("Application rejected");
  };

  const handleMessage = (id: string) => {
    // In a real app, this would open a chat with the applicant
    toast.success("Message thread opened");
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

  const getListingTypeBadge = (listingType: string) => {
    switch (listingType) {
      case "seat":
        return <Badge className="bg-racing-red">Race Seat</Badge>;
      case "job":
        return <Badge className="bg-racing-blue">Engineering Job</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout title="Applications" userType="team">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Applications</h2>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="seats">Seats</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700">No applications found</h3>
                <p className="text-gray-500 mt-2">No applications match your current filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          {getListingTypeBadge(app.listingType)}
                          <span className="mx-2 text-gray-500">•</span>
                          {getStatusBadge(app.status)}
                        </div>
                        <h3 className="text-lg font-medium">{app.listingTitle}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{app.dates}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1 h-4 w-4" />
                          <span>{app.location}</span>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <div className="bg-racing-blue/20 h-full w-full flex items-center justify-center rounded-full">
                                <span className="font-medium text-racing-blue">{app.applicantName.charAt(0)}</span>
                              </div>
                            </Avatar>
                            <div className="ml-3">
                              <h4 className="text-md font-medium">{app.applicantName}</h4>
                              <p className="text-sm text-gray-500">{app.applicantDetails}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-gray-50 p-3 rounded-md">
                            <p className="text-sm">{app.message}</p>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            Applied on {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {app.status === "pending" && (
                          <>
                            <Button 
                              className="bg-racing-red hover:bg-racing-red/90"
                              onClick={() => handleAccept(app.id)}
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              className="text-gray-700"
                              onClick={() => handleReject(app.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          variant={app.status === "pending" ? "outline" : "default"}
                          className={app.status === "pending" ? "text-racing-blue border-racing-blue hover:bg-racing-blue/10" : "bg-racing-blue hover:bg-racing-blue/90"}
                          onClick={() => handleMessage(app.id)}
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeamApplications;
