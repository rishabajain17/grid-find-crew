
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SeatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for the seat detail - in a real app, this would be fetched based on the ID
  const seat = {
    id: id || "1",
    carType: "GT4 - Mercedes AMG GT4",
    eventName: "European GT Challenge",
    description: "Opportunity to join our experienced team for the European GT Challenge at the legendary Spa-Francorchamps circuit. Looking for a driver with GT4 experience and a valid International C license. This is a paid seat with potential for season extension based on performance.",
    location: "Spa-Francorchamps, Belgium",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    price: 15000,
    requirements: "- Valid International C license or higher\n- Previous GT4 experience required\n- Clean racing record\n- Ability to work well with engineering team\n- Budget for the event",
    teamName: "Velocity Racing",
    teamLogo: undefined,
    teamDescription: "Velocity Racing is a professional GT team with over 10 years of experience in GT4 and GT3 championships. We've secured multiple podium finishes in European series and are known for our professional approach and technical excellence.",
    status: "open" as const,
    imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=1200&q=80",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
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
            <Link to="/seats" className="text-gray-600 hover:text-racing-red flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Seats
            </Link>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-md">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80">
              <img src={seat.imageUrl} alt={seat.carType} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-racing-red text-white">{seat.status}</Badge>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="md:flex md:items-start md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-display font-bold mb-2">{seat.carType}</h1>
                  <p className="text-gray-700 text-xl">{seat.eventName}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-2xl font-semibold text-racing-red">${seat.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{seat.location}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(seat.startDate)} - {formatDate(seat.endDate)}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{seat.teamName}</span>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-display font-semibold mb-4">Opportunity Details</h2>
                  <p className="text-gray-700 mb-6">{seat.description}</p>
                  
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">{seat.requirements}</pre>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">About the Team</h3>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        {seat.teamLogo ? (
                          <img src={seat.teamLogo} alt={seat.teamName} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-racing-red rounded-full text-white font-semibold">
                            {seat.teamName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{seat.teamName}</h4>
                        <p className="text-sm text-gray-500">Professional Race Team</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{seat.teamDescription}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="bg-racing-navy/5 p-6 rounded-xl">
                <h2 className="text-xl font-display font-semibold mb-4">Express Interest</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium">
                      Send a message to the team
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Introduce yourself and explain why you're interested in this seat. Include relevant experience and qualifications."
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
                      className="bg-racing-red hover:bg-racing-red/90"
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

export default SeatDetail;
