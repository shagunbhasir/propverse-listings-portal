
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Eye } from "lucide-react";

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
}

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  showLoginPrompt: boolean;
}

export const PropertyCard = ({ property, onClick, showLoginPrompt }: PropertyCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative group"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        
        {showLoginPrompt && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-center">
              <Eye className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Login to view details</p>
            </div>
          </div>
        )}
        
        <Badge className="absolute top-2 right-2 bg-blue-600">
          {property.type}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            ₹{property.price.toLocaleString()}/mo
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{property.bedrooms} BHK</span>
          <span>{property.area} sq ft</span>
          <span>{property.bathrooms} Bath</span>
        </div>
      </CardContent>
    </Card>
  );
};
