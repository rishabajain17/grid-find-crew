
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, userType, isLoading, getDashboardUrl } = useAuth();
  
  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from || "/";

  useEffect(() => {
    console.log("Login: Auth state check - User:", !!user, "UserType:", userType, "IsLoading:", isLoading);
    
    // If still loading authentication state, do nothing yet
    if (isLoading) {
      console.log("Login: Still loading auth state...");
      return;
    }
    
    // If no user is authenticated, nothing to do
    if (!user) {
      console.log("Login: No user authenticated yet");
      return;
    }
    
    // At this point we have a user but may not have userType yet
    console.log("Login: User authenticated, userType:", userType);
    
    // Only redirect when we have both user and userType
    if (user && userType) {
      // Determine redirect path
      let redirectPath;
      if (from && from !== "/") {
        redirectPath = from;
      } else {
        redirectPath = getDashboardUrl();
      }
      
      console.log(`Login: Redirecting to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
      toast.success(`Welcome! You've been signed in successfully.`);
    }
  }, [user, userType, navigate, from, isLoading, getDashboardUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Login: Attempting login with email:", email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || "Failed to sign in");
        setIsSubmitting(false);
        return;
      }
      
      // Don't set isSubmitting to false here as the redirect is handled by the useEffect
      // Success toast is shown after successful navigation
      
    } catch (error: any) {
      console.error("Login exception:", error);
      toast.error(error.message || "An error occurred");
      setIsSubmitting(false);
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
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
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
