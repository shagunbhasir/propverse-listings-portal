
interface Step {
  number: number;
  title: string;
  percentage: number;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressIndicator = ({ steps, currentStep }: ProgressIndicatorProps) => {
  const currentStepData = steps.find(step => step.number === currentStep);
  
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${currentStepData?.percentage || 0}%` }}
        />
      </div>
      
      {/* Step Information */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </div>
        <div className="text-sm font-medium text-blue-600">
          {currentStepData?.percentage}% Complete
        </div>
      </div>
      
      {/* Step Title */}
      <h3 className="text-lg font-semibold text-center mb-6">
        {currentStepData?.title}
      </h3>
      
      {/* Step Dots */}
      <div className="flex justify-center space-x-2 mb-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              step.number <= currentStep 
                ? 'bg-blue-600' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
