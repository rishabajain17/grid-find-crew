
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("driver");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    // Simulate registration - would connect to an auth system in a real app
    try {
      // Mock successful registration for demo purposes
      console.log("Registration attempt with:", { name, email, password, role });
      setTimeout(() => {
        setIsLoading(false);
        // Redirect to the appropriate dashboard based on role
        navigate(`/dashboard/${role}`);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join the racing community today</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>I am a:</Label>
                <RadioGroup defaultValue="driver" value={role} onValueChange={setRole} className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`border rounded-lg p-4 w-full flex flex-col items-center justify-center cursor-pointer ${
                      role === "driver" ? "border-racing-red bg-racing-red/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="w-10 h-10 bg-racing-red/10 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-racing-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <Label htmlFor="driver" className="cursor-pointer font-medium text-sm text-center">
                        Driver
                      </Label>
                    </div>
                    <RadioGroupItem value="driver" id="driver" className="sr-only" />
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <div className={`border rounded-lg p-4 w-full flex flex-col items-center justify-center cursor-pointer ${
                      role === "engineer" ? "border-racing-blue bg-racing-blue/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="w-10 h-10 bg-racing-blue/10 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-racing-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <Label htmlFor="engineer" className="cursor-pointer font-medium text-sm text-center">
                        Engineer
                      </Label>
                    </div>
                    <RadioGroupItem value="engineer" id="engineer" className="sr-only" />
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <div className={`border rounded-lg p-4 w-full flex flex-col items-center justify-center cursor-pointer ${
                      role === "team" ? "border-racing-navy bg-racing-navy/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="w-10 h-10 bg-racing-navy/10 rounded-full flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-racing-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <Label htmlFor="team" className="cursor-pointer font-medium text-sm text-center">
                        Team
                      </Label>
                    </div>
                    <RadioGroupItem value="team" id="team" className="sr-only" />
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-racing-red"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link to="/terms" className="text-racing-red hover:text-racing-red/80">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-racing-red hover:text-racing-red/80">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-racing-red hover:bg-racing-red/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="my-6">
              <div className="flex items-center">
                <Separator className="flex-grow" />
                <span className="px-4 text-sm text-gray-400">OR</span>
                <Separator className="flex-grow" />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => console.log("Google sign-in")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => console.log("Apple sign-in")}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16.6725 1C16.7305 1 16.7885 1 16.8465 1.00167C16.9915 1.4965 17.0735 1.87317 17.0735 2.129C17.0735 2.3705 17.0148 2.6295 16.8975 2.9045C16.7848 3.1795 16.607 3.45117 16.3651 3.719C16.1278 3.98117 15.9088 4.16483 15.7005 4.28667C15.4968 4.40117 15.2888 4.4585 15.0795 4.4585C14.9015 4.4585 14.7095 4.417 14.5015 4.33117C14.2988 4.25117 14.0788 4.12183 13.8468 3.95117C13.6195 3.7855 13.4015 3.59617 13.1968 3.38933C12.9875 3.17483 12.8015 2.95883 12.6275 2.73267C12.4581 2.5065 12.3225 2.2895 12.2148 2.08167C12.1071 1.8785 12.0345 1.7045 11.9951 1.5585C11.9558 1.41783 11.9408 1.30333 11.9408 1.21667L16.6725 1ZM16.9818 13.0332C16.9818 14.0288 16.6655 14.9702 16.0342 15.8547C15.5142 16.5932 14.8348 17.0772 13.9982 17.3067H13.9818C13.7818 17.3067 13.5818 17.267 13.3865 17.1888C13.1912 17.1188 13.0105 17.0292 12.8442 16.9245C12.6778 16.8245 12.5162 16.7188 12.3592 16.611C12.2068 16.5087 12.0615 16.4087 11.9258 16.3257C11.7948 16.241 11.6625 16.1608 11.5268 16.087C11.3935 16.018 11.2625 15.9613 11.1362 15.9168C11.0098 15.8713 10.8812 15.85 10.7525 15.85C10.6285 15.85 10.5022 15.8688 10.3805 15.9063C10.2495 15.9438 10.1212 16.0003 9.99217 16.0745C9.86867 16.146 9.7405 16.2297 9.61233 16.3257C9.48867 16.4087 9.35117 16.5087 9.20217 16.611C9.0485 16.7188 8.89 16.8245 8.72983 16.9245C8.5695 17.0292 8.3915 17.1188 8.19617 17.1888C8.0055 17.267 7.805 17.3067 7.60033 17.3067C7.60033 17.3067 7.5895 17.3067 7.57867 17.3052C7.5655 17.3052 7.55467 17.305 7.5485 17.3035C6.7115 17.075 5.9805 16.452 5.4625 15.4293C5.065 14.652 4.8695 13.844 4.8695 13.0035C4.8695 12.2332 5.0485 11.5392 5.4065 10.9212C5.76467 10.3082 6.22667 9.8525 6.7935 9.5525C7.1345 9.3775 7.49433 9.29 7.87217 9.29C7.98683 9.29 8.1085 9.3075 8.2335 9.34117C8.3635 9.37483 8.5005 9.42533 8.6445 9.493C8.793 9.5575 8.9463 9.6485 9.1045 9.76C9.267 9.8715 9.4365 9.98733 9.6125 10.1037C9.79883 10.22 9.98967 10.3282 10.185 10.4235C10.385 10.5235 10.5802 10.5732 10.7662 10.5732C10.9802 10.5732 11.1965 10.516 11.4152 10.404C11.6315 10.2872 11.8502 10.1633 12.0712 10.0338C12.2875 9.90433 12.5062 9.7755 12.7272 9.65033C12.9435 9.52983 13.1575 9.46933 13.3668 9.46933C13.7928 9.46933 14.1935 9.58517 14.5715 9.81633C14.9542 10.05 15.2458 10.3642 15.4502 10.7595C15.1802 10.8767 14.945 11.0375 14.7475 11.242C14.549 11.442 14.3852 11.677 14.2555 11.9427C14.1258 12.2132 14.06 12.5097 14.06 12.8352C14.06 13.1532 14.123 13.4423 14.2502 13.7103C14.3822 13.9783 14.5472 14.2108 14.7455 14.408C14.9392 14.608 15.1698 14.7587 15.4362 14.8595C15.6098 14.9335 15.7928 14.979 15.9828 14.995C16.3208 14.7328 16.6052 14.4035 16.8388 14.007C16.9338 13.8303 17.0078 13.6408 17.0615 13.4442C17.02 13.465 16.9778 13.4797 16.9352 13.4933C16.7478 13.5617 16.5582 13.5932 16.3625 13.5932C16.1715 13.5932 15.9782 13.56 15.7862 13.4932C15.5988 13.4218 15.4325 13.3278 15.2825 13.2115C15.1372 13.0952 15.0165 12.9612 14.9182 12.811C14.8198 12.6608 14.7698 12.499 14.7698 12.3278C14.7698 12.142 14.8245 11.9705 14.9345 11.8137C15.0445 11.6615 15.1868 11.534 15.3615 11.4312C15.5362 11.333 15.7258 11.2593 15.9308 11.2105C16.1358 11.1617 16.3478 11.1372 16.5668 11.1372C16.6882 11.1372 16.8048 11.145 16.9145 11.1607C16.9412 11.7818 16.9818 12.433 16.9818 13.0332Z"
                    fill="currentColor"
                  />
                </svg>
                Sign up with Apple
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-racing-red hover:text-racing-red/80 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
