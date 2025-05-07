
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-racing-navy text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-display font-bold sm:text-5xl">About Raceconnect</h1>
              <p className="mt-4 text-xl max-w-3xl mx-auto">
                Connecting racing teams with drivers and engineering talent
                to create the ultimate motorsport ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-racing-navy">Our Mission</h2>
              <div className="mt-2 h-1 w-20 bg-racing-red mx-auto"></div>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-gray-700">
                Raceconnect was founded with a simple mission: to solve the fragmented nature of 
                racing team recruitment. We provide a centralized platform where teams can find 
                qualified drivers and engineering talent quickly, while helping racing professionals 
                discover opportunities that match their skills and ambitions.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-racing-navy">How It Works</h2>
              <div className="mt-2 h-1 w-20 bg-racing-red mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-racing-red/10 rounded-full flex items-center justify-center text-racing-red font-bold text-2xl mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
                <p className="text-gray-600">
                  Sign up as a team, driver, or engineer and create a detailed profile showcasing your experience and requirements.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-racing-blue/10 rounded-full flex items-center justify-center text-racing-blue font-bold text-2xl mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect & Apply</h3>
                <p className="text-gray-600">
                  Teams post race seats or engineering jobs, while drivers and engineers browse and apply to relevant opportunities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-racing-navy/10 rounded-full flex items-center justify-center text-racing-navy font-bold text-2xl mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaborate</h3>
                <p className="text-gray-600">
                  Use our in-platform messaging to communicate, negotiate terms, and finalize arrangements for successful partnerships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Teams */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:space-x-12">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-display font-bold text-racing-navy">For Racing Teams</h2>
                <div className="mt-2 h-1 w-20 bg-racing-red"></div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-red flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Post available race seats for any category or event</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-red flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Find qualified engineering talent for full-time or weekend contracts</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-red flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Review detailed profiles to find the perfect match for your team</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-red flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Manage all applications and communications in one place</p>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link to="/register">
                    <Button className="bg-racing-red hover:bg-racing-red/90">Register as a Team</Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1541446654331-def41325e92c?auto=format&fit=crop&w=800&q=80" 
                  alt="Racing team" 
                  className="rounded-lg shadow-md w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* For Drivers & Engineers */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:flex-row-reverse md:space-x-reverse md:space-x-12">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-display font-bold text-racing-navy">For Drivers & Engineers</h2>
                <div className="mt-2 h-1 w-20 bg-racing-blue"></div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-blue flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Browse race seats and engineering jobs from top teams</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-blue flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Create a professional profile to showcase your skills and experience</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-blue flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Apply directly to opportunities that match your criteria</p>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-racing-blue flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Receive notifications when new relevant listings are posted</p>
                  </li>
                </ul>
                <div className="mt-6 flex space-x-4">
                  <Link to="/register">
                    <Button className="bg-racing-red hover:bg-racing-red/90">Register as a Driver</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-racing-blue hover:bg-racing-blue/90">Register as an Engineer</Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1604187332302-24ba15d0130e?auto=format&fit=crop&w=800&q=80" 
                  alt="Racing driver and engineer" 
                  className="rounded-lg shadow-md w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-racing-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold">Ready to Join the Raceconnect Community?</h2>
            <p className="mt-4 text-xl max-w-3xl mx-auto">
              Whether you're a team looking for talent or a racing professional seeking opportunities,
              Raceconnect is your platform for motorsport connections.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-racing-red hover:bg-racing-red/90 w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
              <Link to="/seats">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Browse Seats
                </Button>
              </Link>
              <Link to="/jobs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
