
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User } from "lucide-react";

const Profile = () => {
  const { user, profile, signOut, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Profile form states
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setLicenseNumber(profile.license_number || "");
      setExperienceYears(profile.experience_years?.toString() || "");
    }
  }, [profile]);
  
  // If not logged in, redirect to login page
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Profile: No user authenticated, redirecting to login");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);
  
  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  // Handle profile update
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const updates = {
        full_name: fullName,
        bio,
        location,
        license_number: licenseNumber,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
      };
      
      const { error } = await updateProfile(updates);
      
      if (error) {
        toast.error("Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error loading profile</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-display">Your Profile</h1>
          <Button 
            variant="outline" 
            className="text-gray-700 flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio || ''}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={location || ''}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-racing-blue hover:bg-racing-blue/90"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="additional">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  {profile.user_type === 'driver' ? 
                    "Add your driver-specific information" : 
                    "Add additional details to your profile"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.user_type === 'driver' && (
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input 
                      id="licenseNumber" 
                      value={licenseNumber || ''}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="Your racing license number"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input 
                    id="experienceYears" 
                    type="number"
                    value={experienceYears || ''}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-racing-blue hover:bg-racing-blue/90"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
