import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProgressIndicator } from "./ProgressIndicator";
import { Step1BasicDetails } from "./listing-steps/Step1BasicDetails";
import { Step2AdditionalDetails } from "./listing-steps/Step2AdditionalDetails";
import { Step3Images } from "./listing-steps/Step3Images";
import { Step4Contact } from "./listing-steps/Step4Contact";
import { propertiesAPI, tokenStorage } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface ListPropertyFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PropertyFormData {
  // Basic Details
  propertyType: string;
  location: string;
  builtUpArea: string;
  monthlyRent: string;
  securityDeposit: string;
  availableFrom: string;
  
  // Additional Details
  bedrooms: string;
  bathrooms: string;
  furnishingStatus: string;
  floorNumber: string;
  totalFloors: string;
  facing: string;
  propertyAge: string;
  preferredTenants: string;
  amenities: string[];
  
  // Images
  images: File[];
  coverImageIndex: number;
  
  // Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  description: string;
}

const initialFormData: PropertyFormData = {
  propertyType: "",
  location: "",
  builtUpArea: "",
  monthlyRent: "",
  securityDeposit: "",
  availableFrom: "",
  bedrooms: "",
  bathrooms: "",
  furnishingStatus: "",
  floorNumber: "",
  totalFloors: "",
  facing: "",
  propertyAge: "",
  preferredTenants: "",
  amenities: [],
  images: [],
  coverImageIndex: 0,
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  description: "",
};

export const ListPropertyFlow = ({ isOpen, onClose }: ListPropertyFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    { number: 1, title: "Basic Details", percentage: 25 },
    { number: 2, title: "Additional Details", percentage: 50 },
    { number: 3, title: "Upload Images", percentage: 75 },
    { number: 4, title: "Contact & Submit", percentage: 100 },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!tokenStorage.isLoggedIn()) {
      setError("You must be logged in to submit a property");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Format data for API
      const propertyData = {
        title: `${formData.bedrooms} BHK ${formData.propertyType} in ${formData.location}`,
        type: formData.propertyType,
        location: formData.location,
        price: parseInt(formData.monthlyRent),
        deposit: parseInt(formData.securityDeposit),
        area: parseInt(formData.builtUpArea),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        furnishing_status: formData.furnishingStatus,
        floor_number: formData.floorNumber,
        total_floors: formData.totalFloors,
        facing: formData.facing,
        property_age: formData.propertyAge,
        available_from: formData.availableFrom,
        amenities: JSON.stringify(formData.amenities),
        preferences: JSON.stringify([formData.preferredTenants]),
        description: formData.description,
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
      };
      
      // Get authentication token
      const token = tokenStorage.getToken() || '';
      
      // Send data to API
      const response = await propertiesAPI.create(propertyData, token);
      
      if (response.error) {
        throw new Error(response.message || "Failed to create property listing");
      }
      
      // Handle image upload if needed (this would typically be a separate API call)
      // This is a placeholder for image handling
      if (formData.images.length > 0) {
        // Example image upload logic would go here
        console.log("Images would be uploaded here", formData.images);
      }
      
      // Show success message
      toast({
        title: "Success!",
        description: "Your property has been listed successfully.",
      });
      
      // Reset form and close modal
      onClose();
      setCurrentStep(1);
      setFormData(initialFormData);
      
    } catch (err) {
      console.error("Error submitting property:", err);
      setError(err instanceof Error ? err.message : "Failed to create property listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2AdditionalDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <Step3Images
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <Step4Contact
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            List Your Property for Rent
          </DialogTitle>
        </DialogHeader>
        
        <ProgressIndicator 
          steps={steps} 
          currentStep={currentStep} 
        />
        
        <div className="mt-6">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
