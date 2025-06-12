
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFormData } from "../ListPropertyFlow";

interface Step2AdditionalDetailsProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step2AdditionalDetails = ({ formData, updateFormData, onNext, onPrevious }: Step2AdditionalDetailsProps) => {
  const amenitiesList = [
    "Lift", "Parking", "Security", "Power Backup", "Gym", 
    "Swimming Pool", "Garden", "Club House", "Children's Play Area"
  ];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = checked
      ? [...formData.amenities, amenity]
      : formData.amenities.filter(a => a !== amenity);
    updateFormData({ amenities: updatedAmenities });
  };

  const isFormValid = () => {
    return (
      formData.bedrooms &&
      formData.bathrooms &&
      formData.furnishingStatus &&
      formData.floorNumber &&
      formData.totalFloors &&
      formData.facing &&
      formData.propertyAge &&
      formData.preferredTenants
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Number of Bedrooms *</Label>
          <Select value={formData.bedrooms} onValueChange={(value) => updateFormData({ bedrooms: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} BHK
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Number of Bathrooms *</Label>
          <Select value={formData.bathrooms} onValueChange={(value) => updateFormData({ bathrooms: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select bathrooms" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Bathroom{num > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="furnishingStatus">Furnishing Status *</Label>
          <Select value={formData.furnishingStatus} onValueChange={(value) => updateFormData({ furnishingStatus: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select furnishing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unfurnished">Unfurnished</SelectItem>
              <SelectItem value="semi-furnished">Semi-furnished</SelectItem>
              <SelectItem value="fully-furnished">Fully-furnished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floorNumber">Floor Number *</Label>
          <Input
            id="floorNumber"
            placeholder="Ground, 1st, 2nd..."
            value={formData.floorNumber}
            onChange={(e) => updateFormData({ floorNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalFloors">Total Floors *</Label>
          <Input
            id="totalFloors"
            type="number"
            placeholder="10"
            value={formData.totalFloors}
            onChange={(e) => updateFormData({ totalFloors: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facing">Facing Direction *</Label>
          <Select value={formData.facing} onValueChange={(value) => updateFormData({ facing: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select facing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="north-east">North-East</SelectItem>
              <SelectItem value="north-west">North-West</SelectItem>
              <SelectItem value="south-east">South-East</SelectItem>
              <SelectItem value="south-west">South-West</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyAge">Property Age *</Label>
          <Select value={formData.propertyAge} onValueChange={(value) => updateFormData({ propertyAge: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="1-5">1-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10-15">10-15 years</SelectItem>
              <SelectItem value="15+">15+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredTenants">Preferred Tenants *</Label>
          <Select value={formData.preferredTenants} onValueChange={(value) => updateFormData({ preferredTenants: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="bachelors">Bachelors</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="any">Any</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={amenity} className="text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isFormValid()}
          className="px-8"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};
