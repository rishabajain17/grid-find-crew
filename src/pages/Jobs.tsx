
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

type JobData = {
  id: string;
  title: string;
  location: string;
  date_start: string;
  date_end?: string;
  pay_rate: number;
  payment_term: string;
  status: "open" | "pending" | "filled";
  team_id: string;
  team_name?: string;
  team_logo?: string;
};

const Jobs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [showFullTimeOnly, setShowFullTimeOnly] = useState(false);
  const [showContractOnly, setShowContractOnly] = useState(false);
  const { user, userType } = useAuth();

  // Fetch jobs from Supabase
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      // First fetch jobs 
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
          status,
          team_id
        `)
        .eq('status', 'open');
        
      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return [];
      }
      
      if (!jobsData || jobsData.length === 0) {
        return [];
      }
      
      // Process the jobs data with team information
      const processedJobs: JobData[] = [];
      
      for (const job of jobsData) {
        // Get team profile for each job
        const { data: teamData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', job.team_id)
          .single();
        
        processedJobs.push({
          ...job,
          team_name: teamData?.full_name || 'Unknown Team',
          team_logo: teamData?.avatar_url
        });
      }
      
      return processedJobs;
    },
    refetchOnWindowFocus: false
  });

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchQuery === "" 
      || job.title?.toLowerCase().includes(searchQuery.toLowerCase())
      || job.team_name?.toLowerCase().includes(searchQuery.toLowerCase())
      || job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === null || (job.title && job.title.includes(roleFilter));
    const matchesLocation = locationFilter === null || (job.location && job.location.includes(locationFilter));
    const isFullTime = job.payment_term === 'annual';
    const matchesEmploymentType = 
      (!showFullTimeOnly && !showContractOnly) || 
      (showFullTimeOnly && isFullTime) || 
      (showContractOnly && !isFullTime);

    return matchesSearch && matchesRole && matchesLocation && matchesEmploymentType;
  });

  // Derive roles and locations from actual data
  const roles = [...new Set(jobs
    .filter((job) => job.title)
    .map((job) => job.title.split(' ')[0])
  )];

  const locations = [...new Set(jobs
    .filter((job) => job.location)
    .map((job) => {
      const parts = job.location.split(',');
      return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    })
  )];

  const handlePostJob = () => {
    if (!user) {
      toast.error('Please sign in to post a job');
      navigate('/login', { state: { from: '/post-job' } });
      return;
    }
    
    if (userType !== 'team') {
      toast.error('Only team accounts can post jobs');
      return;
    }
    
    navigate('/post-job');
  };

  const handleApplyJob = (jobId: string) => {
    if (!user) {
      toast.error('Please sign in to apply for this job');
      navigate('/login', { state: { from: `/jobs/${jobId}` } });
      return;
    }
    
    if (userType !== 'engineer') {
      toast.error('Only engineer accounts can apply for jobs');
      return;
    }
    
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Engineering Jobs</h1>
            
            <Button 
              onClick={handlePostJob}
              className="bg-racing-blue hover:bg-racing-blue/90"
            >
              {userType === 'team' ? 'Post a Job' : 'Sign In to Post Jobs'}
            </Button>
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
              
              {roles.length > 0 && (
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
              )}
              
              {locations.length > 0 && (
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
              )}
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
                  {isLoading ? "Loading..." : `${filteredJobs.length} jobs found`}
                </Badge>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id}
                    id={job.id}
                    roleTitle={job.title}
                    teamName={job.team_name || 'Unknown Team'}
                    teamLogo={job.team_logo}
                    location={job.location}
                    startDate={job.date_start}
                    endDate={job.date_end || job.date_start}
                    payRate={job.pay_rate}
                    paymentTerm={job.payment_term as any}
                    isFullTime={job.payment_term === 'annual'}
                    status={job.status}
                    onApply={() => handleApplyJob(job.id)}
                    requiresAuth={true}
                  />
                ))
              ) : (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
