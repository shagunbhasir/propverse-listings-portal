
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { FilterOptions } from "@/components/FilterPanel";

interface HeroSectionProps {
  scrollY: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFiltersCount: number;
  onFilterClick: () => void;
}

export const HeroSection = ({
  scrollY,
  searchTerm,
  setSearchTerm,
  activeFiltersCount,
  onFilterClick
}: HeroSectionProps) => {
  return (
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
              onClick={onFilterClick}
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
  );
};
