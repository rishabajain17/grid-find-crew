
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Banknote } from "lucide-react";
import { toast } from "sonner";

// A sample saved job interface
interface SavedJob {
  id: string;
  jobId: string;
  teamName: string;
  roleTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  payRate: number;
  isFullTime: boolean;
  savedDate: string;
}

const EngineerSaved = () => {
  // In a real app, this would come from an API call
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([
    {
      id: "saved1",
      jobId: "job3",
      teamName: "Apex Motorsport",
      roleTitle: "Data Engineer - Weekend Contract",
      location: "Nürburgring, Germany",
      startDate: "2025-08-10",
      endDate: "2025-08-12",
      payRate: 600,
      isFullTime: false,
      savedDate: "2025-05-03",
    },
    {
      id: "saved2",
      jobId: "job4",
      teamName: "Winner Racing",
      roleTitle: "Race Strategist",
      location: "Monaco",
      startDate: "2025-05-25",
      endDate: "2025-05-27",
      payRate: 700,
      isFullTime: false,
      savedDate: "2025-05-02",
    },
  ]);

  const handleRemove = (id: string) => {
    // In a real app, this would make an API call
    setSavedJobs(savedJobs.filter(job => job.id !== id));
    toast.success("Job removed from saved list");
  };

  const formatPayRate = (payRate: number, isFullTime: boolean) => {
    if (isFullTime) {
      return `$${payRate.toLocaleString()} / year`;
    } else {
      return `$${payRate.toLocaleString()} / day`;
    }
  };

  return (
    <DashboardLayout title="Saved Jobs" userType="engineer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Saved Engineering Jobs</h2>
        </div>

        {savedJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700">No saved jobs</h3>
            <p className="text-gray-500 mt-2">Start saving jobs you're interested in</p>
            <Button className="mt-4 bg-racing-red hover:bg-racing-red/90">
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">{job.roleTitle}</h3>
                    {job.isFullTime ? (
                      <Badge className="bg-racing-blue">Full Time</Badge>
                    ) : (
                      <Badge className="bg-indigo-500">Contract</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{job.teamName}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Banknote className="mr-1 h-4 w-4" />
                    <span>{formatPayRate(job.payRate, job.isFullTime)}</span>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Saved on {new Date(job.savedDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleRemove(job.id)}
                    >
                      Remove
                    </Button>
                    <Link to={`/jobs/${job.jobId}`}>
                      <Button 
                        variant="default"
                        className="bg-racing-red hover:bg-racing-red/90"
                      >
                        View Details
                      </Button>
                    </Link>
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

export default EngineerSaved;
