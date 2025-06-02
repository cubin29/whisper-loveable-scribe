
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
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative flex justify-between items-center">
        {/* Connection Lines */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-stone-200 z-0">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-stone-600 transition-all duration-1000 ease-out"
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
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  status === 'completed'
                    ? 'bg-emerald-500 text-white scale-110'
                    : status === 'current' || status === 'active'
                    ? 'bg-white border-4 border-emerald-500 text-emerald-600 scale-110'
                    : 'bg-white border-2 border-stone-200 text-stone-400'
                } ${status === 'active' ? 'animate-pulse' : ''}`}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                  status === 'completed' || status === 'current' || status === 'active'
                    ? 'text-emerald-600'
                    : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
              
              {/* Floating particles for active steps */}
              {status === 'active' && (
                <div className="absolute -top-2 -left-2 w-16 h-16 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-ping"
                      style={{
                        left: `${Math.random() * 60}px`,
                        top: `${Math.random() * 60}px`,
                        animationDelay: `${i * 200}ms`,
                        animationDuration: '2s'
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
