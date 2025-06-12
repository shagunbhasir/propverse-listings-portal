
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Eye } from "lucide-react";

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

const getPropertyTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    'pg': 'PG',
    'apartment': 'Apartment',
    'room': 'Room',
    'flat': 'Flat',
    'hostel': 'Hostel'
  };
  return types[type] || type;
};

const getPropertyTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'pg': 'bg-blue-500',
    'apartment': 'bg-rent-bee-green',
    'room': 'bg-purple-500',
    'flat': 'bg-orange-500',
    'hostel': 'bg-pink-500'
  };
  return colors[type] || 'bg-gray-500';
};

export const PropertyCard = ({ property, onClick, showLoginPrompt }: PropertyCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative group border-2 hover:border-rent-bee-yellow bg-white overflow-hidden"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        
        {showLoginPrompt && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-center p-4">
              <Eye className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Login to view details</p>
            </div>
          </div>
        )}
        
        <Badge className={`absolute top-3 right-3 text-white font-medium ${getPropertyTypeColor(property.type)}`}>
          {getPropertyTypeLabel(property.type)}
        </Badge>

        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-lg font-bold text-rent-bee-green">
            ₹{property.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">/mo</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-rent-bee-black">{property.title}</h3>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 text-rent-bee-red" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area} sq ft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
