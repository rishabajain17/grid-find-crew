
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const PostManagementService = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Currently just simulating submission
    // This will be implemented once the database is ready
    setTimeout(() => {
      toast.success("Service posted successfully!");
      setIsLoading(false);
      navigate("/dashboard/management/services");
    }, 1000);
  };

  return (
    <div className="container max-w-4xl py-10">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-display">Post Management Service</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Full Driver Management Package"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your management service in detail..."
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servicesOffered">Services Offered (one per line)</Label>
              <Textarea
                id="servicesOffered"
                value={servicesOffered}
                onChange={(e) => setServicesOffered(e.target.value)}
                placeholder="Career Planning
Sponsor Negotiations
Race Entry Management
Media Relations"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Package Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="12 months"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="5000"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-racing-blue hover:bg-racing-blue/90"
              disabled={isLoading}
            >
              {isLoading ? "Posting..." : "Post Service"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PostManagementService;
