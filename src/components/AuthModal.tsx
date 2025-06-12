
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
import { Phone, Mail } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSendOtp = () => {
    if (phoneNumber) {
      setIsOtpSent(true);
      console.log("OTP sent to:", phoneNumber);
    }
  };

  const handleVerifyOtp = () => {
    if (otp) {
      console.log("OTP verified:", otp);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Login / Sign Up
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Phone
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="phone" className="space-y-4 mt-6">
            {!isOtpSent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSendOtp} 
                  className="w-full"
                  disabled={!phoneNumber}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    OTP sent to {phoneNumber}
                  </p>
                </div>
                <Button 
                  onClick={handleVerifyOtp} 
                  className="w-full"
                  disabled={!otp}
                >
                  Verify OTP
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOtpSent(false)} 
                  className="w-full"
                >
                  Change Number
                </Button>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleEmailLogin} 
              className="w-full"
              disabled={!email || !password}
            >
              Login / Sign Up
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};
