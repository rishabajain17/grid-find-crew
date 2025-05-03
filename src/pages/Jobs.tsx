
import { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [showFullTimeOnly, setShowFullTimeOnly] = useState(false);
  const [showContractOnly, setShowContractOnly] = useState(false);

  // Mock data for jobs - in a real app, this would come from an API call
  const jobListings = [
    {
      id: "1",
      roleTitle: "Race Engineer",
      teamName: "Velocity Racing",
      teamLogo: undefined,
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
      teamLogo: undefined,
      location: "Munich, Germany",
      startDate: "2025-05-15",
      endDate: "2025-09-15",
      payRate: 350,
      isFullTime: false,
      status: "open" as const,
    },
    {
      id: "3",
      roleTitle: "Performance Engineer",
      teamName: "FastLane Racing",
      teamLogo: undefined,
      location: "Monza, Italy",
      startDate: "2025-07-01",
      endDate: "2025-07-10",
      payRate: 500,
      isFullTime: false,
      status: "open" as const,
    }
  ];

  // Filter jobs based on search query and filters
  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch = searchQuery === "" 
      || job.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
      || job.teamName.toLowerCase().includes(searchQuery.toLowerCase())
      || job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === null || job.roleTitle.includes(roleFilter);
    const matchesLocation = locationFilter === null || job.location.includes(locationFilter);
    const matchesEmploymentType = 
      (!showFullTimeOnly && !showContractOnly) || 
      (showFullTimeOnly && job.isFullTime) || 
      (showContractOnly && !job.isFullTime);

    return matchesSearch && matchesRole && matchesLocation && matchesEmploymentType;
  });

  // Roles derived from data
  const roles = [...new Set(jobListings.map(job => 
    job.roleTitle.split(' ')[0] // Just take the first word of the role
  ))];

  // Locations derived from data
  const locations = [...new Set(jobListings.map(job => 
    job.location.split(',')[1].trim() // Just take the country
  ))];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Engineering Jobs</h1>
            <Link to="/post-job">
              <Button className="bg-racing-blue hover:bg-racing-blue/90">
                Post a Job
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Select onValueChange={(value) => setRoleFilter(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select onValueChange={(value) => setLocationFilter(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center mt-4 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="full-time" 
                  checked={showFullTimeOnly}
                  onCheckedChange={(checked) => {
                    setShowFullTimeOnly(checked);
                    if (checked) setShowContractOnly(false);
                  }}
                />
                <Label htmlFor="full-time">Full-time only</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="contract" 
                  checked={showContractOnly}
                  onCheckedChange={(checked) => {
                    setShowContractOnly(checked);
                    if (checked) setShowFullTimeOnly(false);
                  }}
                />
                <Label htmlFor="contract">Contract/Per-event only</Label>
              </div>

              <div className="flex items-center ml-auto">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Showing all dates</span>
                <Badge variant="outline" className="ml-2">
                  {filteredJobs.length} jobs found
                </Badge>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
            
            {filteredJobs.length === 0 && (
              <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No jobs match your filters</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter(null);
                    setLocationFilter(null);
                    setShowFullTimeOnly(false);
                    setShowContractOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
