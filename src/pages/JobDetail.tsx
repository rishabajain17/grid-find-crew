
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  team_name: string;
  team_logo?: string;
  team_description?: string;
  location: string;
  date_start: string;
  date_end?: string;
  pay_rate: number;
  payment_term: string;
  is_full_time: boolean;
  status: "open" | "pending" | "filled";
  team_id: string;
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user has already applied
  const { data: existingApplication, isLoading: isCheckingApplication } = useQuery({
    queryKey: ['application', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('listing_id', id)
        .eq('listing_type', 'job')
        .eq('applicant_id', user.id)
        .maybeSingle();
        
      return data;
    },
    enabled: !!user && !!id
  });

  // Fetch job details
  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      if (!id) throw new Error('Job ID is required');
      
      const { data: jobData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          team:team_id (
            id,
            profiles:id (
              full_name,
              avatar_url,
              bio
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!jobData) throw new Error('Job not found');
      
      return {
        id: jobData.id,
        title: jobData.title,
        description: jobData.description || '',
        responsibilities: jobData.responsibilities || '',
        requirements: Array.isArray(jobData.skills) ? jobData.skills.join('\n') : '',
        team_name: jobData.team?.profiles?.full_name || 'Unknown Team',
        team_logo: jobData.team?.profiles?.avatar_url,
        team_description: jobData.team?.profiles?.bio || 'No team description available.',
        location: jobData.location,
        date_start: jobData.date_start,
        date_end: jobData.date_end,
        pay_rate: jobData.pay_rate,
        payment_term: jobData.payment_term,
        is_full_time: jobData.payment_term === 'annual',
        status: jobData.status,
        team_id: jobData.team_id
      };
    },
    retry: 1
  });

  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('You must be logged in to apply');
      if (!id) throw new Error('Job ID is required');
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          listing_id: id,
          listing_type: 'job',
          applicant_id: user.id,
          message: message,
          status: 'pending'
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setMessage('');
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['application', id, user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to submit application: ${error.message}`);
    }
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to apply for this job');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    if (userType !== 'engineer') {
      toast.error('Only engineer accounts can apply for jobs');
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please include a cover letter with your application');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitApplication.mutateAsync();
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-blue"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
              <p className="mb-4">The job you're looking for doesn't exist or has been removed.</p>
              <Link to="/jobs">
                <Button>Back to All Jobs</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasApplied = !!existingApplication;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/jobs" className="text-gray-600 hover:text-racing-blue flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Jobs
            </Link>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-racing-blue to-racing-blue/70">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <h1 className="text-4xl font-display font-bold mb-2">{job.title}</h1>
                  <p className="text-xl">{job.team_name}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <Badge className="bg-racing-blue text-white">{job.status}</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-800">
                  {job.is_full_time ? "Full-time" : "Contract"}
                </Badge>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="md:flex md:items-start md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex-shrink-0 overflow-hidden">
                      {job.team_logo ? (
                        <img src={job.team_logo} alt={job.team_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-racing-blue text-white">
                          {job.team_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span>{job.team_name}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-2xl font-semibold text-racing-blue">
                    ${job.pay_rate.toLocaleString()}
                    {job.is_full_time ? "/yr" : 
                      job.payment_term === "per-day" ? "/day" : 
                      job.payment_term === "per-weekend" ? "/weekend" : 
                      "/event"}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {formatDate(job.date_start)}
                    {job.date_end ? ` - ${formatDate(job.date_end)}` : ' (Ongoing)'}
                  </span>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-display font-semibold mb-4">Job Description</h2>
                  <p className="text-gray-700 mb-6">{job.description}</p>
                  
                  {job.responsibilities && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                      <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">{job.responsibilities}</pre>
                      </div>
                    </>
                  )}
                  
                  {job.requirements && (
                    <>
                      <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">{job.requirements}</pre>
                      </div>
                    </>
                  )}
                </div>
                
                <div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">About the Team</h3>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        {job.team_logo ? (
                          <img src={job.team_logo} alt={job.team_name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-racing-blue rounded-full text-white font-semibold">
                            {job.team_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{job.team_name}</h4>
                        <p className="text-sm text-gray-500">Professional Race Team</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{job.team_description}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="bg-racing-navy/5 p-6 rounded-xl">
                <h2 className="text-xl font-display font-semibold mb-4">Apply for this Position</h2>
                
                {hasApplied ? (
                  <div className="text-center py-6">
                    <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
                      <h3 className="font-semibold mb-1">You have already applied for this position</h3>
                      <p>The team will contact you if they're interested in your application.</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dashboard/engineer')}
                    >
                      View Your Applications
                    </Button>
                  </div>
                ) : !user ? (
                  <div className="text-center py-6">
                    <p className="mb-4 text-gray-600">You must be logged in to apply for this position</p>
                    <Button
                      onClick={() => navigate('/login', { state: { from: `/jobs/${id}` } })}
                      className="bg-racing-blue hover:bg-racing-blue/90"
                    >
                      Sign In to Apply
                    </Button>
                  </div>
                ) : userType !== 'engineer' ? (
                  <div className="bg-amber-50 text-amber-700 p-4 rounded-md">
                    <h3 className="font-semibold mb-1">Only engineering accounts can apply for jobs</h3>
                    <p>If you're an engineer, please create an engineer account to apply.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="message" className="block mb-2 text-sm font-medium">
                        Cover Letter
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Introduce yourself and explain why you're interested in this position. Include relevant experience and qualifications."
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-racing-blue hover:bg-racing-blue/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
