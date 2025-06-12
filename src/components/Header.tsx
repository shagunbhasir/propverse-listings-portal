
import { Button } from "@/components/ui/button";
import { Plus, Menu, X } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onListProperty: () => void;
}

export const Header = ({
  isLoggedIn,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLoginClick,
  onLogout,
  onListProperty
}: HeaderProps) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-rent-bee-yellow sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rent-bee-yellow rounded-full flex items-center justify-center">
              <span className="text-2xl">🐝</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-rent-bee-black">Rent Bee</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Find Your Perfect Home</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={onListProperty}
              className="bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              List Property
            </Button>
            
            {!isLoggedIn ? (
              <Button
                variant="outline"
                onClick={onLoginClick}
                className="border-2 border-rent-bee-black hover:bg-rent-bee-yellow/20"
              >
                Login / Sign Up
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-rent-bee-black">Welcome back!</p>
                  <p className="text-xs text-muted-foreground">Happy house hunting! 🏠</p>
                </div>
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="border-rent-bee-red text-rent-bee-red hover:bg-rent-bee-red/10"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-3 pt-4">
              <Button
                onClick={onListProperty}
                className="bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Property
              </Button>
              
              {!isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="border-2 border-rent-bee-black hover:bg-rent-bee-yellow/20 w-full"
                >
                  Login / Sign Up
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="border-rent-bee-red text-rent-bee-red hover:bg-rent-bee-red/10 w-full"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
