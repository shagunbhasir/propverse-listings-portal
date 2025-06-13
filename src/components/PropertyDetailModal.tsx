import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Home, Bath, Maximize, Calendar, Loader2 } from "lucide-react";
import { propertiesAPI, tokenStorage } from "@/lib/api";

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

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyDetailModal = ({ property: initialProperty, isOpen, onClose }: PropertyDetailModalProps) => {
  const [property, setProperty] = useState<Property | null>(initialProperty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!isOpen || !initialProperty) return;
      
      // If we already have detailed property info, don't fetch again
      if (initialProperty.description) {
        setProperty(initialProperty);
        return;
      }
      
      setLoading(true);
      setError("");
      
      try {
        const token = tokenStorage.getToken() || '';
        const response = await propertiesAPI.getOne(initialProperty.id, token);
        
        if (response.error) {
          throw new Error(response.message || "Failed to fetch property details");
        }
        
        // Transform API response to match our Property interface
        const prop = response.property;
        const transformedProperty = {
          id: prop.id.toString(),
          title: prop.title,
          location: prop.location,
          price: parseInt(prop.price),
          type: prop.type,
          bedrooms: prop.bedrooms ? parseInt(prop.bedrooms) : 0,
          bathrooms: prop.bathrooms ? parseInt(prop.bathrooms) : 0,
          area: parseInt(prop.area),
          image: prop.image || "/placeholder.svg",
          description: prop.description || "",
          amenities: typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : [],
          contact: {
            name: prop.contact_name,
            phone: prop.contact_phone,
            email: prop.contact_email
          }
        };
        
        setProperty(transformedProperty);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch property details");
        // Fallback to initial property data
        setProperty(initialProperty);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [isOpen, initialProperty]);

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-rent-bee-green mb-4" />
              <p className="text-muted-foreground">Loading property details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">{error}</p>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Property Image */}
            <div className="space-y-4">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
              />
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Home className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-medium">{property.bedrooms} BHK</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Bath className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-medium">{property.bathrooms} Bath</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Maximize className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm font-medium">{property.area} sq ft</p>
                </div>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="space-y-6">
              {/* Price and Type */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{property.price.toLocaleString()}/month
                  </p>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {property.type}
                </Badge>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
              
              {/* Amenities */}
              <div>
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Contact Owner</h3>
                <div className="space-y-2">
                  <p className="font-medium">{property.contact.name}</p>
                  <div className="flex items-center space-x-4">
                    <Button size="sm" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Call {property.contact.phone}
                    </Button>
                    {property.contact.email && (
                      <Button size="sm" variant="outline" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
