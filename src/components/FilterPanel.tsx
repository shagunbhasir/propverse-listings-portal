
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";

export interface FilterOptions {
  priceRange: [number, number];
  propertyTypes: string[];
  preferences: string[];
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const propertyTypes = [
  { id: "pg", label: "PG" },
  { id: "apartment", label: "Apartment" },
  { id: "room", label: "Room" },
  { id: "flat", label: "Flat" },
  { id: "hostel", label: "Hostel" }
];

const preferences = [
  { id: "bachelor", label: "Only Bachelor" },
  { id: "female", label: "Only Female" },
  { id: "family", label: "Only Family" },
  { id: "students", label: "For Students Only" }
];

export const FilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters }: FilterPanelProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>(currentFilters.priceRange);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(currentFilters.propertyTypes);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(currentFilters.preferences);

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, typeId]);
    } else {
      setSelectedTypes(selectedTypes.filter(type => type !== typeId));
    }
  };

  const handlePreferenceChange = (prefId: string, checked: boolean) => {
    if (checked) {
      setSelectedPreferences([...selectedPreferences, prefId]);
    } else {
      setSelectedPreferences(selectedPreferences.filter(pref => pref !== prefId));
    }
  };

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      propertyTypes: selectedTypes,
      preferences: selectedPreferences
    });
    onClose();
  };

  const handleReset = () => {
    setPriceRange([5000, 100000]);
    setSelectedTypes([]);
    setSelectedPreferences([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold flex items-center">
            <Filter className="h-5 w-5 mr-2 text-rent-bee-green" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Budget Slider */}
          <div className="space-y-4">
            <h3 className="font-semibold text-rent-bee-black">Budget Range</h3>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={100000}
                min={5000}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h3 className="font-semibold text-rent-bee-black">Property Type</h3>
            <div className="space-y-2">
              {propertyTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                  />
                  <label htmlFor={type.id} className="text-sm font-medium leading-none">
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h3 className="font-semibold text-rent-bee-black">Preferences</h3>
            <div className="space-y-2">
              {preferences.map((pref) => (
                <div key={pref.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={pref.id}
                    checked={selectedPreferences.includes(pref.id)}
                    onCheckedChange={(checked) => handlePreferenceChange(pref.id, checked as boolean)}
                  />
                  <label htmlFor={pref.id} className="text-sm font-medium leading-none">
                    {pref.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply}
              className="flex-1 bg-rent-bee-green hover:bg-rent-bee-green/90"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
