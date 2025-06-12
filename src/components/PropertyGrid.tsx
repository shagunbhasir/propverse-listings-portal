
import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { PropertyDetailModal } from "./PropertyDetailModal";

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
}

interface PropertyGridProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  searchTerm: string;
}

const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Modern 2BHK Apartment",
    location: "Koramangala, Bangalore",
    price: 35000,
    type: "Apartment",
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
    }
  },
  {
    id: "2",
    title: "Spacious 3BHK Villa",
    location: "Whitefield, Bangalore",
    price: 55000,
    type: "Villa",
    bedrooms: 3,
    bathrooms: 3,
    area: 2000,
    image: "/placeholder.svg",
    description: "Independent villa with garden. Perfect for families. Quiet neighborhood with good connectivity.",
    amenities: ["Parking", "Garden", "Security", "Power Backup"],
    contact: {
      name: "Priya Sharma",
      phone: "+91 9876543211"
    }
  },
  {
    id: "3",
    title: "Luxury 1BHK Studio",
    location: "Indiranagar, Bangalore",
    price: 28000,
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    image: "/placeholder.svg",
    description: "Fully furnished luxury studio apartment. Perfect for working professionals.",
    amenities: ["Parking", "Lift", "Security", "Power Backup", "Swimming Pool"],
    contact: {
      name: "Amit Patel",
      phone: "+91 9876543212",
      email: "amit@email.com"
    }
  },
  {
    id: "4",
    title: "Commercial Office Space",
    location: "Electronic City, Bangalore",
    price: 80000,
    type: "Commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: 1500,
    image: "/placeholder.svg",
    description: "Modern office space with conference rooms. Ideal for IT companies and startups.",
    amenities: ["Parking", "Lift", "Security", "Power Backup", "Conference Room"],
    contact: {
      name: "Sunita Reddy",
      phone: "+91 9876543213"
    }
  }
];

export const PropertyGrid = ({ isLoggedIn, onLoginRequired, searchTerm }: PropertyGridProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = sampleProperties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePropertyClick = (property: Property) => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    setSelectedProperty(property);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => handlePropertyClick(property)}
            showLoginPrompt={!isLoggedIn}
          />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found matching your search.</p>
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
