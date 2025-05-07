
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SeatCard from "@/components/SeatCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; 
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type SeatData = {
  id: string;
  car_type: string;
  event_name: string;
  location: string;
  date_start: string;
  date_end: string;
  price: number;
  status: "open" | "pending" | "filled";
  team_id: string;
  team_name?: string;
  team_logo?: string;
};

const Seats = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  // Fetch seats from Supabase
  const { data: seats = [], isLoading } = useQuery({
    queryKey: ['seats'],
    queryFn: async () => {
      // First fetch seats
      const { data: seatsData, error: seatsError } = await supabase
        .from('seats')
        .select(`
          id,
          car_type,
          event_name,
          location,
          date_start,
          date_end,
          price,
          status,
          team_id
        `)
        .eq('status', 'open');
        
      if (seatsError) {
        console.error('Error fetching seats:', seatsError);
        return [];
      }
      
      if (!seatsData || seatsData.length === 0) {
        return [];
      }
      
      // Process the seats data with team information
      const processedSeats: SeatData[] = [];
      
      for (const seat of seatsData) {
        // Get team profile for each seat
        const { data: teamData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', seat.team_id)
          .single();
        
        processedSeats.push({
          ...seat,
          team_name: teamData?.full_name || 'Unknown Team',
          team_logo: teamData?.avatar_url
        });
      }
      
      return processedSeats;
    },
    refetchOnWindowFocus: false
  });

  // Filter seats based on search query and filters
  const filteredSeats = seats.filter((seat) => {
    const matchesSearch = searchQuery === "" 
      || seat.car_type?.toLowerCase().includes(searchQuery.toLowerCase())
      || seat.event_name?.toLowerCase().includes(searchQuery.toLowerCase())
      || seat.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === null || seat.car_type?.includes(categoryFilter);
    const matchesLocation = locationFilter === null || seat.location?.includes(locationFilter);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Categories derived from data
  const categories = [...new Set(seats
    .filter(seat => seat.car_type)
    .map(seat => seat.car_type.split(' ')[0]) // Just take GT3, GT4, Formula 4, etc.
  )];

  // Locations derived from data
  const locations = [...new Set(seats
    .filter(seat => seat.location)
    .map(seat => {
      const parts = seat.location.split(',');
      return parts.length > 1 ? parts[1].trim() : parts[0].trim(); // Just take the country
    })
  )];

  const handlePostSeat = () => {
    if (!user) {
      toast.error('Please sign in to post a seat');
      navigate('/login', { state: { from: '/post-seat' } });
      return;
    }
    
    if (userType !== 'team') {
      toast.error('Only team accounts can post seats');
      return;
    }
    
    navigate('/post-seat');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Available Race Seats</h1>
            <Button 
              onClick={handlePostSeat}
              className="bg-racing-red hover:bg-racing-red/90"
            >
              {userType === 'team' ? 'Post a Seat' : 'Sign In to Post Seats'}
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search seats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {categories.length > 0 && (
                <div>
                  <Select onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Car Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
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
            
            <div className="flex items-center mt-4">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Showing all dates</span>
              <Badge variant="outline" className="ml-auto">
                {isLoading ? "Loading..." : `${filteredSeats.length} seats found`}
              </Badge>
            </div>
          </div>

          {/* Seat Listings */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeats.length > 0 ? (
                filteredSeats.map((seat) => (
                  <SeatCard 
                    key={seat.id}
                    id={seat.id}
                    carType={seat.car_type}
                    eventName={seat.event_name}
                    location={seat.location}
                    startDate={seat.date_start}
                    endDate={seat.date_end}
                    price={parseFloat(seat.price.toString())}
                    teamName={seat.team_name || 'Unknown Team'}
                    teamLogo={seat.team_logo}
                    status={seat.status}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <h3 className="text-xl font-semibold mb-2">No seats match your filters</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter(null);
                      setLocationFilter(null);
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

export default Seats;
