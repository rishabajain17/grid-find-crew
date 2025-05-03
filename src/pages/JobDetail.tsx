
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for the job detail - in a real app, this would be fetched based on the ID
  const job = {
    id: id || "1",
    roleTitle: "Race Engineer",
    description: "We are looking for an experienced Race Engineer to join our GT racing team for the upcoming European season. You will be responsible for vehicle setup, data analysis, and working directly with drivers to optimize performance. This is a full-time position with potential for long-term employment.",
    responsibilities: "- Lead the engineering setup of our GT4 cars\n- Analyze data and provide feedback to drivers\n- Collaborate with mechanics on car setup and maintenance\n- Attend all race weekends and selected test days\n- Develop performance improvement strategies\n- Maintain detailed documentation of setups and changes",
    requirements: "- Minimum 3 years experience as a race engineer in GT or formula series\n- Strong understanding of vehicle dynamics and data analysis\n- Proficiency with data acquisition systems (preferably AiM or MoTeC)\n- Excellent communication skills\n- Ability to travel extensively during the racing season\n- Degree in Mechanical Engineering or related field preferred",
    teamName: "Velocity Racing",
    teamLogo: undefined,
    teamDescription: "Velocity Racing is a professional GT team with over 10 years of experience in GT4 and GT3 championships. We've secured multiple podium finishes in European series and are known for our professional approach and technical excellence.",
    location: "Milton Keynes, UK",
    startDate: "2025-06-01",
    endDate: "2025-10-30",
    payRate: 85000,
    isFullTime: true,
    status: "open" as const,
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Application submitted successfully! The team will contact you soon.");
      setMessage("");
    }, 1000);
  };

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
            <div className="relative h-64 md:h-80">
              <img src={job.imageUrl} alt={job.roleTitle} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Badge className="bg-racing-blue text-white">{job.status}</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-800">
                  {job.isFullTime ? "Full-time" : "Contract"}
                </Badge>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="md:flex md:items-start md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-2">{job.roleTitle}</h1>
                  <div className="flex items-center text-gray-700">
                    <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex-shrink-0 overflow-hidden">
                      {job.teamLogo ? (
                        <img src={job.teamLogo} alt={job.teamName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-racing-blue text-white">
                          {job.teamName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span>{job.teamName}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-2xl font-semibold text-racing-blue">
                    ${job.payRate.toLocaleString()}{job.isFullTime ? "/yr" : "/day"}
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
                  <span>{formatDate(job.startDate)} - {formatDate(job.endDate)}</span>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-display font-semibold mb-4">Job Description</h2>
                  <p className="text-gray-700 mb-6">{job.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">{job.responsibilities}</pre>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">{job.requirements}</pre>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">About the Team</h3>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        {job.teamLogo ? (
                          <img src={job.teamLogo} alt={job.teamName} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-racing-blue rounded-full text-white font-semibold">
                            {job.teamName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{job.teamName}</h4>
                        <p className="text-sm text-gray-500">Professional Race Team</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{job.teamDescription}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="bg-racing-navy/5 p-6 rounded-xl">
                <h2 className="text-xl font-display font-semibold mb-4">Apply for this Position</h2>
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
