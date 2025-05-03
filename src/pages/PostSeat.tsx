
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const PostSeat = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    carType: "",
    eventName: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    price: "",
    requirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate the form
    if (!formData.carType || !formData.eventName || !formData.startDate || !formData.endDate || !formData.price) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call to create a new seat
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Race seat posted successfully!");
      navigate("/dashboard/team");
    } catch (error) {
      toast.error("Failed to post race seat. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Post a Race Seat" userType="team">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold mb-2">Post a New Race Seat</h2>
          <p className="text-gray-600">
            Fill in the details below to create a new race seat listing.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="carType">Car Type / Category <span className="text-red-500">*</span></Label>
                <Input
                  id="carType"
                  placeholder="e.g. GT4 - Mercedes AMG GT4"
                  value={formData.carType}
                  onChange={handleChange("carType")}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name <span className="text-red-500">*</span></Label>
                <Input
                  id="eventName"
                  placeholder="e.g. European GT Challenge"
                  value={formData.eventName}
                  onChange={handleChange("eventName")}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the race seat opportunity..."
                value={formData.description}
                onChange={handleChange("description")}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                placeholder="e.g. Spa-Francorchamps, Belgium"
                value={formData.location}
                onChange={handleChange("location")}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange("startDate")}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange("endDate")}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g. 15000"
                value={formData.price}
                onChange={handleChange("price")}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the requirements for this seat (e.g., license level, experience)..."
                value={formData.requirements}
                onChange={handleChange("requirements")}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Upload Images</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                multiple
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500">
                You can upload multiple images. Max file size: 5MB per image.
              </p>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/team")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-racing-red hover:bg-racing-red/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Seat"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostSeat;
