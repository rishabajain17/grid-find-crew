
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobProps {
  id: string;
  roleTitle: string;
  teamName: string;
  teamLogo?: string;
  location: string;
  startDate: string;
  endDate: string;
  payRate: number;
  paymentTerm?: string;
  isFullTime: boolean;
  status: "open" | "pending" | "filled";
  onApply?: () => void;
  requiresAuth?: boolean;
}

const JobCard = ({
  id,
  roleTitle,
  teamName,
  teamLogo,
  location,
  startDate,
  endDate,
  payRate,
  paymentTerm,
  isFullTime,
  status,
  onApply,
  requiresAuth = false
}: JobProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (amount: number, isFullTime: boolean) => {
    if (isFullTime) {
      return `$${amount.toLocaleString()}/year`;
    } else {
      return `$${amount.toLocaleString()}/day`;
    }
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
              {roleTitle}
            </h3>
            <p className="text-sm text-gray-600">{location}</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          <div className="flex items-center text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatSalary(payRate, isFullTime)}</span>
          </div>
          <div className="flex items-center text-xs">
            <span className={`px-2 py-1 rounded-full ${isFullTime ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
              {isFullTime ? 'Full-Time' : 'Contract'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
          <div className="w-6 h-6 bg-gray-200 rounded-full mr-2 flex-shrink-0 overflow-hidden">
            {teamLogo ? (
              <img src={teamLogo} alt={teamName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700">
                {teamName?.charAt(0) || 'T'}
              </div>
            )}
          </div>
          <span>{teamName}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between">
        <Link
          to={`/jobs/${id}`}
          className="text-racing-blue hover:text-racing-blue/80 font-medium text-sm"
        >
          View Details
        </Link>
        {onApply && (
          <Button 
            variant="ghost" 
            className="text-sm text-racing-blue hover:text-racing-blue/80 p-0"
            onClick={onApply}
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
