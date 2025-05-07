
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Banknote } from "lucide-react";
import { toast } from "sonner";

// A sample saved seat interface
interface SavedSeat {
  id: string;
  seatId: string;
  teamName: string;
  eventName: string;
  carType: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  imageUrl: string;
  savedDate: string;
}

const DriverSaved = () => {
  // In a real app, this would come from an API call
  const [savedSeats, setSavedSeats] = useState<SavedSeat[]>([
    {
      id: "saved1",
      seatId: "seat3",
      teamName: "FastLane Racing",
      eventName: "British F4 Championship",
      carType: "Formula 4",
      location: "Silverstone, UK",
      startDate: "2025-08-05",
      endDate: "2025-08-07",
      price: 18000,
      imageUrl: "https://images.unsplash.com/photo-1626511718772-5254b8e9d603?auto=format&fit=crop&w=600&q=80",
      savedDate: "2025-05-03",
    },
    {
      id: "saved2",
      seatId: "seat4",
      teamName: "Rapid Motorsports",
      eventName: "German Touring Car Masters",
      carType: "TCR",
      location: "Hockenheim, Germany",
      startDate: "2025-09-10",
      endDate: "2025-09-12",
      price: 12000,
      imageUrl: "https://images.unsplash.com/photo-1590674899484-d5a67951d59d?auto=format&fit=crop&w=600&q=80",
      savedDate: "2025-05-02",
    },
  ]);

  const handleRemove = (id: string) => {
    // In a real app, this would make an API call
    setSavedSeats(savedSeats.filter(seat => seat.id !== id));
    toast.success("Seat removed from saved list");
  };

  return (
    <DashboardLayout title="Saved Seats" userType="driver">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Saved Race Seats</h2>
        </div>

        {savedSeats.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700">No saved seats</h3>
            <p className="text-gray-500 mt-2">Start saving seats you're interested in</p>
            <Button className="mt-4 bg-racing-red hover:bg-racing-red/90">
              Browse Seats
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedSeats.map((seat) => (
              <div key={seat.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="h-48 relative">
                  <img src={seat.imageUrl} alt={seat.eventName} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 right-3 bg-racing-red">{seat.carType}</Badge>
                </div>
                <div className="p-6 flex-1">
                  <h3 className="text-lg font-medium">{seat.eventName}</h3>
                  <p className="text-sm text-gray-600">{seat.teamName}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {new Date(seat.startDate).toLocaleDateString()} - {new Date(seat.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{seat.location}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Banknote className="mr-1 h-4 w-4" />
                    <span>${seat.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleRemove(seat.id)}
                    >
                      Remove
                    </Button>
                    <Link to={`/seats/${seat.seatId}`}>
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

export default DriverSaved;
