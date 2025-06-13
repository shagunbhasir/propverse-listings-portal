import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormData } from "../ListPropertyFlow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Step4ContactProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
  error?: string;
}

export const Step4Contact = ({ 
  formData, 
  updateFormData, 
  onSubmit, 
  onPrevious, 
  isSubmitting = false,
  error = ""
}: Step4ContactProps) => {
  const isFormValid = () => {
    return (
      formData.contactName &&
      formData.contactPhone &&
      formData.description
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name *</Label>
            <Input
              id="contactName"
              placeholder="Your full name"
              value={formData.contactName}
              onChange={(e) => updateFormData({ contactName: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Mobile Number *</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.contactPhone}
              onChange={(e) => updateFormData({ contactPhone: e.target.value })}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactEmail">Email (Optional)</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="your@email.com"
              value={formData.contactEmail}
              onChange={(e) => updateFormData({ contactEmail: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Property Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Property Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your property, nearby landmarks, accessibility, unique selling points..."
          rows={4}
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          disabled={isSubmitting}
        />
        <p className="text-sm text-gray-500">
          Include details about nearby landmarks, transportation, and what makes your property special.
        </p>
      </div>

      {/* Preview Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Listing Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Property Type:</span> {formData.propertyType}
            </div>
            <div>
              <span className="font-medium">Location:</span> {formData.location}
            </div>
            <div>
              <span className="font-medium">Rent:</span> ₹{formData.monthlyRent}/month
            </div>
            <div>
              <span className="font-medium">Area:</span> {formData.builtUpArea} sq ft
            </div>
            <div>
              <span className="font-medium">Bedrooms:</span> {formData.bedrooms} BHK
            </div>
            <div>
              <span className="font-medium">Bathrooms:</span> {formData.bathrooms}
            </div>
          </div>
          
          {formData.amenities.length > 0 && (
            <div>
              <span className="font-medium">Amenities:</span> {formData.amenities.join(", ")}
            </div>
          )}
          
          <div>
            <span className="font-medium">Images:</span> {formData.images.length} uploaded
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Previous
        </Button>
        <Button 
          onClick={onSubmit} 
          disabled={!isFormValid() || isSubmitting}
          className="px-8 bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : "Submit Listing"}
        </Button>
      </div>
    </div>
  );
};
