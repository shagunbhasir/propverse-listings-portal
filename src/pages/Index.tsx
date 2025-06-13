import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { ListPropertyFlow } from "@/components/ListPropertyFlow";
import { FilterPanel, FilterOptions } from "@/components/FilterPanel";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PropertiesSection } from "@/components/PropertiesSection";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import { tokenStorage } from "@/lib/api";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isListingFlowOpen, setIsListingFlowOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [5000, 100000],
    propertyTypes: [],
    preferences: []
  });

  const scrollY = useScrollParallax();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(tokenStorage.isLoggedIn());
    };
    
    checkAuth();
    
    // Listen for storage events (in case user logs in/out in another tab)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    tokenStorage.removeToken();
    tokenStorage.removeUser();
    setIsLoggedIn(false);
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

  const handleClearFilters = () => {
    setFilters({ priceRange: [5000, 100000], propertyTypes: [], preferences: [] });
  };

  const activeFiltersCount = filters.propertyTypes.length + filters.preferences.length + 
    (filters.priceRange[0] !== 5000 || filters.priceRange[1] !== 100000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rent-bee-yellow/10 to-rent-bee-green/10">
      <Header
        isLoggedIn={isLoggedIn}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onListProperty={handleListProperty}
      />

      <HeroSection
        scrollY={scrollY}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFiltersCount={activeFiltersCount}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      <PropertiesSection
        isLoggedIn={isLoggedIn}
        onLoginRequired={() => setIsAuthModalOpen(true)}
        searchTerm={searchTerm}
        filters={filters}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={handleClearFilters}
      />

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
