
import { useState } from "react";
import { PropertyGrid } from "@/components/PropertyGrid";
import { AuthModal } from "@/components/AuthModal";
import { ListPropertyFlow } from "@/components/ListPropertyFlow";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Search } from "lucide-react";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isListingFlowOpen, setIsListingFlowOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleListProperty = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      setIsListingFlowOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">RentPortal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleListProperty}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Property
              </Button>
              
              {!isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Login / Sign Up
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Welcome back!</span>
                  <Button
                    variant="outline"
                    onClick={() => setIsLoggedIn(false)}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Rental Property
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of properties for rent. From apartments to villas, 
            find your next home with ease.
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by location, property type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Available Properties</h3>
            <p className="text-muted-foreground">
              {isLoggedIn ? "Click any property to view details" : "Login to view property details"}
            </p>
          </div>
          
          <PropertyGrid 
            isLoggedIn={isLoggedIn} 
            onLoginRequired={() => setIsAuthModalOpen(true)}
            searchTerm={searchTerm}
          />
        </div>
      </section>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <ListPropertyFlow
        isOpen={isListingFlowOpen}
        onClose={() => setIsListingFlowOpen(false)}
      />
    </div>
  );
};

export default Index;
