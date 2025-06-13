import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Mail, Eye, EyeOff } from "lucide-react";
import { authAPI, tokenStorage } from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneLogin = async () => {
    if (phoneNumber && password) {
      setLoading(true);
      setError("");
      try {
        const response = await authAPI.login({
          username: phoneNumber,
          password
        });
        
        if (response.error) {
          setError(response.message || "Login failed");
          return;
        }
        
        // Save token and user info
        tokenStorage.setToken(response.token);
        tokenStorage.setUser(response.user);
        
        // Clear form and close modal
        resetForm();
        onLogin();
      } catch (err) {
        console.error("Login error:", err);
        setError("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEmailLogin = async () => {
    if (email && password) {
      setLoading(true);
      setError("");
      try {
        const response = await authAPI.login({
          username: email,
          password
        });
        
        if (response.error) {
          setError(response.message || "Login failed");
          return;
        }
        
        // Save token and user info
        tokenStorage.setToken(response.token);
        tokenStorage.setUser(response.user);
        
        // Clear form and close modal
        resetForm();
        onLogin();
      } catch (err) {
        console.error("Login error:", err);
        setError("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleRegister = async () => {
    if (isRegistering && name && password && (email || phoneNumber)) {
      setLoading(true);
      setError("");
      try {
        const userData = {
          name,
          password,
          email: email || undefined,
          phone: phoneNumber || undefined
        };
        
        const response = await authAPI.register(userData);
        
        if (response.error) {
          setError(response.message || "Registration failed");
          return;
        }
        
        // Save token and user info
        tokenStorage.setToken(response.token);
        tokenStorage.setUser(response.user);
        
        // Clear form and close modal
        resetForm();
        onLogin();
      } catch (err) {
        console.error("Registration error:", err);
        setError("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  const resetForm = () => {
    setPhoneNumber("");
    setEmail("");
    setPassword("");
    setName("");
    setIsRegistering(false);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md border-2 border-rent-bee-yellow">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-rent-bee-black">
            {isRegistering ? "Create an Account" : "Welcome to Rent Bee"}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {isRegistering ? "Sign up to continue" : "Login or Sign up to continue"}
          </p>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-rent-bee-yellow/20">
            <TabsTrigger 
              value="email" 
              className="flex items-center data-[state=active]:bg-rent-bee-yellow data-[state=active]:text-rent-bee-black"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger 
              value="phone" 
              className="flex items-center data-[state=active]:bg-rent-bee-yellow data-[state=active]:text-rent-bee-black"
            >
              <Phone className="h-4 w-4 mr-2" />
              Phone
            </TabsTrigger>
          </TabsList>
          
          {isRegistering && (
            <div className="space-y-2 mt-6">
              <Label htmlFor="name" className="text-rent-bee-black font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 focus:border-rent-bee-green"
              />
            </div>
          )}
          
          <TabsContent value="email" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-rent-bee-black font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 focus:border-rent-bee-green"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-password" className="text-rent-bee-black font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="email-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 focus:border-rent-bee-green pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button 
              onClick={isRegistering ? handleRegister : handleEmailLogin} 
              className="w-full bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium"
              disabled={!email || !password || (isRegistering && !name) || loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isRegistering ? "Sign Up with Email" : "Continue with Email"}
            </Button>
          </TabsContent>
          
          <TabsContent value="phone" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-rent-bee-black font-medium">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-2 focus:border-rent-bee-green"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-password" className="text-rent-bee-black font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="phone-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 focus:border-rent-bee-green pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button 
              onClick={isRegistering ? handleRegister : handlePhoneLogin} 
              className="w-full bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium"
              disabled={!phoneNumber || !password || (isRegistering && !name) || loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isRegistering ? "Sign Up with Phone" : "Continue with Phone"}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm mt-4">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => setIsRegistering(false)}
                className="text-rent-bee-green hover:underline font-medium"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)}
                className="text-rent-bee-green hover:underline font-medium"
              >
                Create Account
              </button>
            </>
          )}
        </div>
        
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};
