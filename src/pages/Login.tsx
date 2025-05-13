
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
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, userType, isLoading: authLoading } = useAuth();
  
  const from = location.state?.from || "/";

  // Effect to handle redirect when authenticated
  useEffect(() => {
    if (authLoading) return; // Don't redirect while still loading auth state
    
    if (!user) return;
    
    console.log("Login: User authenticated, redirecting with userType:", userType);
    
    // Only redirect if user is authenticated
    if (from !== "/") {
      navigate(from, { replace: true });
    } else if (userType === 'team') {
      navigate('/dashboard/team', { replace: true });
    } else if (userType === 'driver') {
      navigate('/dashboard/driver', { replace: true });
    } else if (userType === 'engineer') {
      navigate('/dashboard/engineer', { replace: true });
    } else if (userType === 'management') {
      navigate('/dashboard/management', { replace: true });
    } else {
      // Fallback if userType is not yet available but user is authenticated
      console.log("Login: No specific userType available yet, redirecting to homepage");
      navigate('/', { replace: true });
    }
  }, [user, userType, navigate, from, authLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Login: Attempting login with email:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || "Failed to sign in");
        setIsLoading(false);
        return;
      }
      
      toast.success("Signed in successfully!");
      // Redirection is now handled by the useEffect
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      setIsLoading(false);
    }
  };

  // If already logged in and userType is available, redirect immediately
  if (!authLoading && user && userType) {
    console.log("Login: Already logged in with userType:", userType);
    if (userType === 'team') {
      navigate('/dashboard/team', { replace: true });
    } else if (userType === 'driver') {
      navigate('/dashboard/driver', { replace: true });
    } else if (userType === 'engineer') {
      navigate('/dashboard/engineer', { replace: true });
    } else if (userType === 'management') {
      navigate('/dashboard/management', { replace: true });
    }
    return null; // Don't render the login form if already logged in
  }

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
                disabled={isLoading || authLoading}
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
