
import { useState, useEffect } from "react";
import { PropertyGrid } from "@/components/PropertyGrid";
import { AuthModal } from "@/components/AuthModal";
import { ListPropertyFlow } from "@/components/ListPropertyFlow";
import { FilterPanel, FilterOptions } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Menu, X } from "lucide-react";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isListingFlowOpen, setIsListingFlowOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [5000, 100000],
    propertyTypes: [],
    preferences: []
  });

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const activeFiltersCount = filters.propertyTypes.length + filters.preferences.length + 
    (filters.priceRange[0] !== 5000 || filters.priceRange[1] !== 100000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rent-bee-yellow/10 to-rent-bee-green/10">
      {/* Header */}
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
                onClick={handleListProperty}
                className="bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Property
              </Button>
              
              {!isLoggedIn ? (
                <Button
                  variant="outline"
                  onClick={() => setIsAuthModalOpen(true)}
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
                    onClick={() => setIsLoggedIn(false)}
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
                  onClick={handleListProperty}
                  className="bg-rent-bee-green hover:bg-rent-bee-green/90 text-white font-medium w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List Property
                </Button>
                
                {!isLoggedIn ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="border-2 border-rent-bee-black hover:bg-rent-bee-yellow/20 w-full"
                  >
                    Login / Sign Up
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsLoggedIn(false)}
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

      {/* Hero Section with Parallax */}
      <section className="relative bg-gradient-to-r from-rent-bee-yellow/90 to-rent-bee-green/90 py-12 md:py-20 overflow-hidden">
        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)'
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 
            className="text-3xl md:text-5xl font-bold text-rent-bee-black mb-4 drop-shadow-lg"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            Find Your Perfect Rental with Rent Bee
          </h2>
          <p 
            className="text-lg md:text-xl text-rent-bee-black/80 mb-8 max-w-3xl mx-auto drop-shadow font-medium"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            🏠 Discover thousands of properties for rent. From PGs to apartments, 
            find your next home with ease and buzzing efficiency! 🐝
          </p>
          
          {/* Search and Filter Bar */}
          <div 
            className="max-w-2xl mx-auto"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <div className="flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by location, property type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rent-bee-green focus:border-transparent bg-white"
                />
              </div>
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
                className="relative border-2 border-rent-bee-green text-rent-bee-green hover:bg-rent-bee-green hover:text-white font-medium px-6 py-3"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rent-bee-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-rent-bee-black">Available Properties</h3>
              <p className="text-muted-foreground mt-1">
                {isLoggedIn ? "Click any property to view details" : "Login to view property details"}
              </p>
            </div>
            
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{activeFiltersCount} filters applied</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ priceRange: [5000, 100000], propertyTypes: [], preferences: [] })}
                  className="text-rent-bee-red hover:text-rent-bee-red/80"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
          
          <PropertyGrid 
            isLoggedIn={isLoggedIn} 
            onLoginRequired={() => setIsAuthModalOpen(true)}
            searchTerm={searchTerm}
            filters={filters}
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

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default Index;
