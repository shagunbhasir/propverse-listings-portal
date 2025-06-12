
import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { PropertyDetailModal } from "./PropertyDetailModal";
import { FilterOptions } from "./FilterPanel";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
  amenities: string[];
  contact: {
    name: string;
    phone: string;
    email?: string;
  };
  preferences?: string[];
}

interface PropertyGridProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  searchTerm: string;
  filters: FilterOptions;
}

const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Modern 2BHK Apartment",
    location: "Koramangala, Bangalore",
    price: 35000,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "/placeholder.svg",
    description: "Beautiful modern apartment with all amenities. Close to metro station and shopping centers.",
    amenities: ["Parking", "Lift", "Security", "Power Backup", "Gym"],
    contact: {
      name: "Rajesh Kumar",
      phone: "+91 9876543210",
      email: "rajesh@email.com"
    },
    preferences: ["family", "bachelor"]
  },
  {
    id: "2",
    title: "Spacious 3BHK Villa",
    location: "Whitefield, Bangalore",
    price: 55000,
    type: "flat",
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    image: "/placeholder.svg",
    description: "Independent villa with garden. Perfect for families. Quiet neighborhood with good connectivity.",
    amenities: ["Parking", "Garden", "Security", "Power Backup"],
    contact: {
      name: "Priya Sharma",
      phone: "+91 9876543211"
    },
    preferences: ["family"]
  },
  {
    id: "3",
    title: "Luxury PG for Working Professionals",
    location: "Indiranagar, Bangalore",
    price: 18000,
    type: "pg",
    bedrooms: 1,
    bathrooms: 1,
    area: 400,
    image: "/placeholder.svg",
    description: "Fully furnished PG with meals included. Perfect for working professionals.",
    amenities: ["Meals", "Laundry", "Security", "WiFi", "AC"],
    contact: {
      name: "Amit Patel",
      phone: "+91 9876543212",
      email: "amit@email.com"
    },
    preferences: ["bachelor", "female"]
  },
  {
    id: "4",
    title: "Student Hostel - Budget Friendly",
    location: "Electronic City, Bangalore",
    price: 12000,
    type: "hostel",
    bedrooms: 1,
    bathrooms: 1,
    area: 200,
    image: "/placeholder.svg",
    description: "Affordable hostel accommodation for students. Study room and mess facilities available.",
    amenities: ["Mess", "Study Room", "Security", "WiFi", "Laundry"],
    contact: {
      name: "Sunita Reddy",
      phone: "+91 9876543213"
    },
    preferences: ["students"]
  },
  {
    id: "5",
    title: "Comfortable Single Room",
    location: "HSR Layout, Bangalore",
    price: 15000,
    type: "room",
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    image: "/placeholder.svg",
    description: "Well-furnished single room with attached bathroom. Ideal for working professionals.",
    amenities: ["Furnished", "WiFi", "Security", "Power Backup"],
    contact: {
      name: "Rahul Singh",
      phone: "+91 9876543214"
    },
    preferences: ["bachelor", "female"]
  }
];

export const PropertyGrid = ({ isLoggedIn, onLoginRequired, searchTerm, filters }: PropertyGridProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = sampleProperties.filter(property => {
    // Search filter
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase());

    // Price filter
    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];

    // Property type filter
    const matchesType = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(property.type);

    // Preferences filter
    const matchesPreferences = filters.preferences.length === 0 || 
      (property.preferences && filters.preferences.some(pref => property.preferences!.includes(pref)));

    return matchesSearch && matchesPrice && matchesType && matchesPreferences;
  });

  const handlePropertyClick = (property: Property) => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    setSelectedProperty(property);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property, index) => (
          <div key={property.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <PropertyCard
              property={property}
              onClick={() => handlePropertyClick(property)}
              showLoginPrompt={!isLoggedIn}
            />
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-xl font-semibold text-rent-bee-black mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters to find more results.
          </p>
        </div>
      )}

      <PropertyDetailModal
        property={selectedProperty}
        isOpen={selectedProperty !== null}
        onClose={() => setSelectedProperty(null)}
      />
    </>
  );
};
