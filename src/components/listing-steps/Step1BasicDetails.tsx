
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyFormData } from "../ListPropertyFlow";

interface Step1BasicDetailsProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
}

export const Step1BasicDetails = ({ formData, updateFormData, onNext }: Step1BasicDetailsProps) => {
  const propertyTypes = [
    "Apartment",
    "Villa",
    "Independent House",
    "PG",
    "Commercial Space"
  ];

  const isFormValid = () => {
    return (
      formData.propertyType &&
      formData.location &&
      formData.builtUpArea &&
      formData.monthlyRent &&
      formData.securityDeposit &&
      formData.availableFrom
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type *</Label>
          <Select value={formData.propertyType} onValueChange={(value) => updateFormData({ propertyType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="City, Area, Locality"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="builtUpArea">Built-up Area (sq. ft.) *</Label>
          <Input
            id="builtUpArea"
            type="number"
            placeholder="1200"
            value={formData.builtUpArea}
            onChange={(e) => updateFormData({ builtUpArea: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent (₹) *</Label>
          <Input
            id="monthlyRent"
            type="number"
            placeholder="35000"
            value={formData.monthlyRent}
            onChange={(e) => updateFormData({ monthlyRent: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
          <Input
            id="securityDeposit"
            type="number"
            placeholder="70000"
            value={formData.securityDeposit}
            onChange={(e) => updateFormData({ securityDeposit: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableFrom">Available From *</Label>
          <Input
            id="availableFrom"
            type="date"
            value={formData.availableFrom}
            onChange={(e) => updateFormData({ availableFrom: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end">
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
