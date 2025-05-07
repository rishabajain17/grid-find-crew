
import { useState, useEffect } from "react";
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

interface Job {
  id: string;
  title: string;
  team_name?: string;
  team_logo?: string;
  location: string;
  date_start: string;
  date_end?: string;
  pay_rate: number;
  payment_term: string;
  is_full_time: boolean;
  status: "open" | "pending" | "filled";
}

const Jobs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [showFullTimeOnly, setShowFullTimeOnly] = useState(false);
  const [showContractOnly, setShowContractOnly] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        
        // Get user type
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
          setUserType(profile.user_type);
        }
      }
    };
    
    checkUser();
  }, []);

  // Fetch jobs from Supabase
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      // Join jobs with team profiles to get team info
      const { data, error } = await supabase
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
          team_id,
          profiles:team_id(full_name, avatar_url)
        `)
        .eq('status', 'open');
        
      if (error) {
        toast.error('Failed to load jobs');
        console.error('Error fetching jobs:', error);
        return [];
      }
      
      // Transform the data to match the Job interface
      return data.map((job: any) => ({
        id: job.id,
        roleTitle: job.title,
        teamName: job.profiles?.full_name || 'Unknown Team',
        teamLogo: job.profiles?.avatar_url,
        location: job.location,
        startDate: job.date_start,
        endDate: job.date_end || job.date_start, // Fallback to start date if no end date
        payRate: job.pay_rate,
        isFullTime: job.payment_term === 'annual',
        status: job.status
      }));
    }
  });

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter((job: any) => {
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
  const roles = [...new Set(jobs.map((job: any) => 
    job.roleTitle.split(' ')[0] // Just take the first word of the role
  ))];

  // Locations derived from data
  const locations = [...new Set(jobs.map((job: any) => {
    const parts = job.location.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim(); // Get country or full location
  }))];

  const handlePostJob = () => {
    if (!user) {
      toast.error('Please sign in to post a job');
      navigate('/login');
      return;
    }
    
    if (userType !== 'team') {
      toast.error('Only team accounts can post jobs');
      return;
    }
    
    navigate('/post-job');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Engineering Jobs</h1>
            
            {/* Only show Post Job button for team accounts */}
            {userType === 'team' && (
              <Button 
                onClick={handlePostJob}
                className="bg-racing-blue hover:bg-racing-blue/90"
              >
                Post a Job
              </Button>
            )}
            
            {/* Show login prompt for non-authenticated users */}
            {!user && (
              <Link to="/login">
                <Button variant="outline">
                  Sign In to Post Jobs
                </Button>
              </Link>
            )}
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
