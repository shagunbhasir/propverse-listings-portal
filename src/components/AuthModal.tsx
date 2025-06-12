
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePhoneLogin = () => {
    if (phoneNumber && password) {
      console.log("Phone login:", phoneNumber);
      onLogin();
    }
  };

  const handleEmailLogin = () => {
    if (email && password) {
      console.log("Email login:", email);
      onLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-2 border-rent-bee-yellow">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-rent-bee-black">
            Welcome to Rent Bee
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Login or Sign up to continue
          </p>
        </DialogHeader>
        
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
              onClick={handleEmailLogin} 
              className="w-full bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium"
              disabled={!email || !password}
            >
              Continue with Email
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
              onClick={handlePhoneLogin} 
              className="w-full bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium"
              disabled={!phoneNumber || !password}
            >
              Continue with Phone
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};
