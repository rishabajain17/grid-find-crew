
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface SeatProps {
  id: string;
  carType: string;
  eventName: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  teamName: string;
  teamLogo?: string;
  status: "open" | "pending" | "filled";
}

const SeatCard = ({
  id,
  carType,
  eventName,
  location,
  startDate,
  endDate,
  price,
  teamName,
  teamLogo,
  status,
}: SeatProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const statusColors = {
    open: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    filled: "bg-gray-100 text-gray-800",
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-3 race-gradient" />
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold mb-1">
              {carType}
            </h3>
            <p className="text-sm text-gray-600">{eventName}</p>
          </div>
          <Badge
            className={statusColors[status]}
            variant="outline"
          >
            {status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          <div className="flex items-center text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>${price.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex-shrink-0 overflow-hidden">
            {teamLogo ? (
              <img src={teamLogo} alt={teamName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700">
                {teamName.charAt(0)}
              </div>
            )}
          </div>
          <span>{teamName}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <Link
          to={`/seats/${id}`}
          className="text-racing-red hover:text-racing-red/80 font-medium text-sm w-full text-center"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SeatCard;
