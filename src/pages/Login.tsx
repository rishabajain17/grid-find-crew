
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, userType, user } = useAuth();
  
  const from = location.state?.from || "/";

  // Effect to handle redirect when user and userType become available
  useEffect(() => {
    if (!user || redirectAttempted) return;
    
    console.log("Login: Checking redirect conditions. UserType:", userType, "User:", !!user);
    
    // Only try to redirect if we're not already in the process of logging in
    if (!isLoading) {
      if (userType) {
        console.log("Login: Redirecting to dashboard for userType:", userType);
        setRedirectAttempted(true);
        
        if (from !== "/") {
          navigate(from);
        } else if (userType === 'team') {
          navigate('/dashboard/team');
        } else if (userType === 'driver') {
          navigate('/dashboard/driver');
        } else if (userType === 'engineer') {
          navigate('/dashboard/engineer');
        } else if (userType === 'management') {
          navigate('/dashboard/management');
        } else {
          navigate('/');
        }
      } else {
        console.log("Login: User logged in but userType not available yet");
      }
    }
  }, [user, userType, navigate, from, isLoading, redirectAttempted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setRedirectAttempted(false);
    
    try {
      console.log("Login: Attempting login with email:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || "Failed to sign in");
        setIsLoading(false);
        return;
      }
      
      toast.success("Signed in successfully!");
      // Wait a bit for the profile to be fetched
      setTimeout(() => {
        setIsLoading(false);
        // Redirection is now handled by the useEffect
      }, 500);
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="youremail@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-racing-blue hover:text-racing-blue/80"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-racing-blue hover:bg-racing-blue/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-racing-blue hover:text-racing-blue/80 font-medium">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
