
import { useState } from "react";
import { Link } from "react-router-dom";
import SeatCard from "@/components/SeatCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

const Seats = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);

  // Mock data for seats - in a real app, this would come from an API call
  const seatListings = [
    {
      id: "1",
      carType: "GT4 - Mercedes AMG GT4",
      eventName: "European GT Challenge",
      location: "Spa-Francorchamps, Belgium",
      startDate: "2025-07-10",
      endDate: "2025-07-12",
      price: 15000,
      isPaid: true,
      teamName: "Velocity Racing",
      teamLogo: undefined,
      status: "open",
      imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "2",
      carType: "GT3 - Audi R8 LMS",
      eventName: "ADAC GT Masters",
      location: "Nürburgring, Germany",
      startDate: "2025-06-15",
      endDate: "2025-06-17",
      price: 25000,
      isPaid: true,
      teamName: "Apex Motorsport",
      teamLogo: undefined,
      status: "open",
      imageUrl: "https://images.unsplash.com/photo-1550614435-f093a3d9fdc6?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "3",
      carType: "Formula 4",
      eventName: "British F4 Championship",
      location: "Silverstone, UK",
      startDate: "2025-08-05",
      endDate: "2025-08-07",
      price: 18000,
      isPaid: true,
      teamName: "FastLane Racing",
      teamLogo: undefined,
      status: "open",
      imageUrl: "https://images.unsplash.com/photo-1626511718772-5254b8e9d603?auto=format&fit=crop&w=600&q=80",
    }
  ];

  // Filter seats based on search query and filters
  const filteredSeats = seatListings.filter((seat) => {
    const matchesSearch = searchQuery === "" 
      || seat.carType.toLowerCase().includes(searchQuery.toLowerCase())
      || seat.eventName.toLowerCase().includes(searchQuery.toLowerCase())
      || seat.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === null || seat.carType.includes(categoryFilter);
    const matchesLocation = locationFilter === null || seat.location.includes(locationFilter);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Categories derived from data
  const categories = [...new Set(seatListings.map(seat => 
    seat.carType.split(' ')[0] // Just take GT3, GT4, Formula 4, etc.
  ))];

  // Locations derived from data
  const locations = [...new Set(seatListings.map(seat => 
    seat.location.split(',')[1].trim() // Just take the country
  ))];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold">Available Race Seats</h1>
            <Link to="/post-seat">
              <Button className="bg-racing-red hover:bg-racing-red/90">
                Post a Seat
              </Button>
            </Link>
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
            
            <div className="flex items-center mt-4">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Showing all dates</span>
              <Badge variant="outline" className="ml-auto">
                {filteredSeats.length} seats found
              </Badge>
            </div>
          </div>

          {/* Seat Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeats.map((seat) => (
              <SeatCard key={seat.id} {...seat} />
            ))}
            
            {filteredSeats.length === 0 && (
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Seats;
