
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PropertyFormData } from "../ListPropertyFlow";
import { Upload, X, Star } from "lucide-react";

interface Step3ImagesProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step3Images = ({ formData, updateFormData, onNext, onPrevious }: Step3ImagesProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    updateFormData({ images: [...formData.images, ...imageFiles] });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newCoverIndex = formData.coverImageIndex >= newImages.length ? 0 : formData.coverImageIndex;
    updateFormData({ 
      images: newImages,
      coverImageIndex: newCoverIndex
    });
  };

  const setCoverImage = (index: number) => {
    updateFormData({ coverImageIndex: index });
  };

  const isFormValid = () => {
    return formData.images.length > 0;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="space-y-2">
        <Label>Property Images *</Label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop images here or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Upload high-quality images (JPG, PNG). Max 10 images.
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {formData.images.length > 0 && (
        <div className="space-y-4">
          <Label>Uploaded Images ({formData.images.length})</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                
                {/* Cover Photo Badge */}
                {index === formData.coverImageIndex && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Cover
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {index !== formData.coverImageIndex && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setCoverImage(index)}
                        className="text-xs"
                      >
                        Set Cover
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Hover over images to set as cover photo or remove them.
          </p>
        </div>
      )}

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
