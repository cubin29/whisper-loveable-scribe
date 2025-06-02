
import { FileAudio, Wand2, Download, CheckCircle2 } from "lucide-react";

interface ProcessingPipelineProps {
  currentStep: 'upload' | 'transcribe' | 'process' | 'complete';
  isTranscribing: boolean;
  isProcessing: boolean;
}

export const ProcessingPipeline = ({ currentStep, isTranscribing, isProcessing }: ProcessingPipelineProps) => {
  const steps = [
    { id: 'upload', label: 'Upload', icon: FileAudio },
    { id: 'transcribe', label: 'Transcribe', icon: FileAudio },
    { id: 'process', label: 'Process', icon: Wand2 },
    { id: 'complete', label: 'Export', icon: Download },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) {
      if (stepId === 'transcribe' && isTranscribing) return 'active';
      if (stepId === 'process' && isProcessing) return 'active';
      return 'current';
    }
    return 'pending';
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-0">
      <div className="relative flex justify-between items-center">
        {/* Connection Lines - Mobile Responsive */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-ai-neutral-300 z-0">
          <div 
            className="h-full bg-gradient-to-r from-ai-green-600 to-ai-green-700 transition-all duration-1000 ease-out"
            style={{ 
              width: currentStep === 'upload' ? '0%' : 
                     currentStep === 'transcribe' ? '33%' : 
                     currentStep === 'process' ? '66%' : '100%' 
            }}
          ></div>
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step.id);
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  status === 'completed'
                    ? 'bg-ai-green-600 text-white scale-110 shadow-lg'
                    : status === 'current' || status === 'active'
                    ? 'bg-white border-2 sm:border-3 border-ai-green-600 text-ai-green-700 scale-110 shadow-md'
                    : 'bg-white border-2 border-ai-neutral-400 text-ai-neutral-600'
                } ${status === 'active' ? 'animate-pulse' : ''}`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Icon className="h-2 w-2 sm:h-3 sm:w-3" />
                )}
              </div>
              <span
                className={`mt-1 text-xs font-semibold transition-colors duration-300 ${
                  status === 'completed' || status === 'current' || status === 'active'
                    ? 'text-ai-green-700'
                    : 'text-ai-neutral-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
