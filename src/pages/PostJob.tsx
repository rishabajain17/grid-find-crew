
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const PostJob = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [formData, setFormData] = useState({
    roleTitle: "",
    description: "",
    responsibilities: "",
    requirements: "",
    location: "",
    startDate: "",
    endDate: "",
    payRate: "",
    employmentType: "full-time", // "full-time", "per-event", "per-weekend"
    paymentTerm: "annual", // "annual", "per-day", "per-weekend", "per-event"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in or not a team
  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to post a job");
      navigate("/login", { state: { from: "/post-job" } });
      return;
    }

    if (userType !== "team") {
      toast.error("Only team accounts can post jobs");
      navigate("/dashboard/team");
    }
  }, [user, userType, navigate]);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  const handleEmploymentTypeChange = (value: string) => {
    let paymentTerm = "annual";
    
    if (value === "per-event") {
      paymentTerm = "per-event";
    } else if (value === "per-weekend") {
      paymentTerm = "per-weekend";
    }
    
    setFormData({
      ...formData,
      employmentType: value,
      paymentTerm: paymentTerm,
    });
  };

  const handlePaymentTermChange = (value: string) => {
    setFormData({
      ...formData, 
      paymentTerm: value
    });
  };

  const getPayRatePlaceholder = () => {
    switch(formData.paymentTerm) {
      case "annual":
        return "e.g. 85000";
      case "per-day":
        return "e.g. 500";
      case "per-weekend":
        return "e.g. 1500";
      case "per-event":
        return "e.g. 2500";
      default:
        return "Enter amount";
    }
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

    try {
      // Prepare skills array
      const skills = formData.requirements
        .split('\n')
        .filter(item => item.trim() !== '')
        .map(item => item.trim());

      // Save to Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          team_id: user?.id,
          title: formData.roleTitle,
          description: formData.description,
          skills: skills,
          location: formData.location,
          date_start: new Date(formData.startDate).toISOString(),
          date_end: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          pay_rate: parseFloat(formData.payRate),
          payment_term: formData.paymentTerm,
          status: 'open'
        })
        .select();

      if (error) {
        console.error("Error posting job:", error);
        toast.error("Failed to post job: " + error.message);
        setIsSubmitting(false);
        return;
      }

      toast.success("Job posted successfully!");
      navigate("/dashboard/team");
    } catch (error: any) {
      console.error("Error posting job:", error);
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
                value={formData.employmentType}
                onValueChange={handleEmploymentTypeChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full-time" id="full-time" />
                  <Label htmlFor="full-time" className="cursor-pointer">Full-time</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="per-weekend" id="per-weekend" />
                  <Label htmlFor="per-weekend" className="cursor-pointer">Per-weekend</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="per-event" id="per-event" />
                  <Label htmlFor="per-event" className="cursor-pointer">Per-event</Label>
                </div>
              </RadioGroup>
            </div>
            
            {formData.employmentType === "full-time" && (
              <div className="space-y-4">
                <Label>Payment Term <span className="text-red-500">*</span></Label>
                <RadioGroup
                  value={formData.paymentTerm}
                  onValueChange={handlePaymentTermChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="annual" id="annual" />
                    <Label htmlFor="annual" className="cursor-pointer">Annual Salary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="per-day" id="per-day" />
                    <Label htmlFor="per-day" className="cursor-pointer">Day Rate</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="payRate">
                {formData.paymentTerm === "annual" && "Annual Salary (USD)"}
                {formData.paymentTerm === "per-day" && "Day Rate (USD)"}
                {formData.paymentTerm === "per-weekend" && "Weekend Rate (USD)"}
                {formData.paymentTerm === "per-event" && "Event Rate (USD)"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="payRate"
                type="number"
                placeholder={getPayRatePlaceholder()}
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
