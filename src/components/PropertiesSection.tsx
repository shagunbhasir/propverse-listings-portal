
import { PropertyGrid } from "@/components/PropertyGrid";
import { FilterOptions } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";

interface PropertiesSectionProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  searchTerm: string;
  filters: FilterOptions;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export const PropertiesSection = ({
  isLoggedIn,
  onLoginRequired,
  searchTerm,
  filters,
  activeFiltersCount,
  onClearFilters
}: PropertiesSectionProps) => {
  return (
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
                onClick={onClearFilters}
                className="text-rent-bee-red hover:text-rent-bee-red/80"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        <PropertyGrid 
          isLoggedIn={isLoggedIn} 
          onLoginRequired={onLoginRequired}
          searchTerm={searchTerm}
          filters={filters}
        />
      </div>
    </section>
  );
};
