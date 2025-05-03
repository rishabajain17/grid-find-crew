
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roleTitle: "",
    description: "",
    responsibilities: "",
    requirements: "",
    location: "",
    startDate: "",
    endDate: "",
    payRate: "",
    isFullTime: "true", // string for radio buttons
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
    if (!formData.roleTitle || !formData.location || !formData.startDate || !formData.payRate) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call to create a new job
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Job posted successfully!");
      navigate("/dashboard/team");
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Post a Job" userType="team">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold mb-2">Post a New Engineering Job</h2>
          <p className="text-gray-600">
            Fill in the details below to create a new job listing.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roleTitle">Job Title <span className="text-red-500">*</span></Label>
              <Input
                id="roleTitle"
                placeholder="e.g. Race Engineer"
                value={formData.roleTitle}
                onChange={handleChange("roleTitle")}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the role..."
                value={formData.description}
                onChange={handleChange("description")}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder="List the key responsibilities for this role..."
                value={formData.responsibilities}
                onChange={handleChange("responsibilities")}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the qualifications and skills required..."
                value={formData.requirements}
                onChange={handleChange("requirements")}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                placeholder="e.g. Milton Keynes, UK"
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
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange("endDate")}
                  placeholder="Leave blank if ongoing"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Employment Type <span className="text-red-500">*</span></Label>
              <RadioGroup
                defaultValue="true"
                value={formData.isFullTime}
                onValueChange={(value) => setFormData({ ...formData, isFullTime: value })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="full-time" />
                  <Label htmlFor="full-time" className="cursor-pointer">Full-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="contract" />
                  <Label htmlFor="contract" className="cursor-pointer">Contract / Per-event</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payRate">
                {formData.isFullTime === "true" ? "Annual Salary (USD)" : "Day Rate (USD)"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="payRate"
                type="number"
                placeholder={formData.isFullTime === "true" ? "e.g. 85000" : "e.g. 500"}
                value={formData.payRate}
                onChange={handleChange("payRate")}
                required
              />
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
                className="bg-racing-blue hover:bg-racing-blue/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
