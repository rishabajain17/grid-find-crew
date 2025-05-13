import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ManagementDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout
      title="Management Dashboard"
      subtitle="Manage your management services and client communications"
      userType="management"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Welcome to your Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your driver/team management services and communications
            </p>
          </div>
          <Button
            onClick={() => navigate("/post-management-service")}
            className="bg-racing-blue hover:bg-racing-blue/90"
          >
            Post New Service
          </Button>
        </div>

        <div className="grid gap-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Your Management Services</h3>
              <p className="text-muted-foreground">
                Create and manage your management services.
              </p>
              <div className="mt-4 flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard/management/services")}
                >
                  View Services
                </Button>
                <Button
                  onClick={() => navigate("/post-management-service")}
                >
                  Post New Service
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Messages</h3>
              <p className="text-muted-foreground">
                View and respond to messages from potential clients.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard/management/messages")}
                className="mt-4"
              >
                View Messages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagementDashboard;
