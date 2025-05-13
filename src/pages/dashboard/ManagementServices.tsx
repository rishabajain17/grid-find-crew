import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ManagementServices = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout
      title="Management Services"
      subtitle="View and manage your offered management services"
      userType="management"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Your Management Services</h2>
            <p className="text-muted-foreground">
              View and manage all your management service listings
            </p>
          </div>
          <Button
            onClick={() => navigate("/post-management-service")}
            className="bg-racing-blue hover:bg-racing-blue/90"
          >
            Post New Service
          </Button>
        </div>

        <div className="rounded-lg border shadow-sm p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You don't have any management services listed yet.
            </p>
            <Button
              onClick={() => navigate("/post-management-service")}
              className="mt-4"
            >
              Post Your First Service
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagementServices;
