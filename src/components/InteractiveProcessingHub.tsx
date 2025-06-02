
import { useState } from "react";
import { FileText, RotateCcw, Lightbulb, Sparkles, Zap, Wand2 } from "lucide-react";

interface InteractiveProcessingHubProps {
  onProcess: (type: 'summarise' | 'paraphrase' | 'generate') => void;
  isProcessing: boolean;
  hasContent: boolean;
}

export const InteractiveProcessingHub = ({ onProcess, isProcessing, hasContent }: InteractiveProcessingHubProps) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const processingOptions = [
    {
      id: 'summarise',
      label: 'Summarise',
      description: 'Extract key points',
      icon: FileText,
      color: 'from-blue-600 to-blue-700',
      particles: '💫'
    },
    {
      id: 'paraphrase',
      label: 'Paraphrase',
      description: 'Rewrite content',
      icon: RotateCcw,
      color: 'from-purple-600 to-purple-700',
      particles: '🔄'
    },
    {
      id: 'generate',
      label: 'Generate',
      description: 'Create new content',
      icon: Lightbulb,
      color: 'from-amber-600 to-orange-600',
      particles: '✨'
    }
  ];

  if (!hasContent) {
    return (
      <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-400 shadow-sm">
        <Wand2 className="h-8 w-8 text-stone-700 mx-auto mb-2" />
        <p className="text-stone-900 text-sm font-semibold">AI Processing Hub</p>
        <p className="text-stone-700 text-xs">Upload and transcribe first</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hub Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-stone-700 text-white rounded-full text-sm shadow-lg">
          <Wand2 className="h-4 w-4" />
          <span className="font-medium">AI Processing Hub</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {/* Processing Options - Compact Grid */}
      <div className="grid grid-cols-1 gap-2">
        {processingOptions.map((option, index) => {
          const Icon = option.icon;
          const isHovered = hoveredOption === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onProcess(option.id as 'summarise' | 'paraphrase' | 'generate')}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={isProcessing}
              className={`relative w-full p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                isHovered
                  ? 'scale-105 shadow-lg border-white/30'
                  : 'hover:scale-102 shadow-sm border-white/20'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${option.color.split(' ')[1]}, ${option.color.split(' ')[3]})`
              }}
            >
              <div className="text-white text-left">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-white/20 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{option.label}</h3>
                    <p className="text-white/90 text-xs">{option.description}</p>
                  </div>
                  <span className="text-sm">{option.particles}</span>
                </div>
              </div>

              {/* Processing Animation */}
              {isProcessing && (
                <div className="absolute inset-0 rounded-xl bg-white/10 flex items-center justify-center">
                  <div className="flex items-center gap-1 text-white">
                    <Zap className="h-3 w-3 animate-pulse" />
                    <span className="text-xs">Processing...</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
