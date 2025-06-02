
import { useState } from "react";
import { FileText, RotateCcw, Lightbulb, Sparkles, Zap, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveProcessingHubProps {
  onProcess: (type: 'summarise' | 'paraphrase' | 'generate') => void;
  isProcessing: boolean;
  hasContent: boolean;
}

export const InteractiveProcessingHub = ({ onProcess, isProcessing, hasContent }: InteractiveProcessingHubProps) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const processingOptions = [
    {
      id: 'summarise',
      label: 'Summarise',
      description: 'Extract key points and main ideas',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
      particles: '💫'
    },
    {
      id: 'paraphrase',
      label: 'Paraphrase',
      description: 'Rewrite while keeping the same meaning',
      icon: RotateCcw,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
      particles: '🔄'
    },
    {
      id: 'generate',
      label: 'Generate New',
      description: 'Create fresh content based on the original',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'from-amber-600 to-orange-600',
      particles: '✨'
    }
  ];

  if (!hasContent) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Main Hub Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative group px-8 py-4 bg-gradient-to-r from-emerald-500 to-stone-600 text-white rounded-full shadow-2xl transition-all duration-300 ${
            isExpanded ? 'scale-110' : 'hover:scale-105'
          }`}
        >
          <div className="flex items-center gap-3">
            <Wand2 className="h-5 w-5" />
            <span className="font-semibold">AI Processing Hub</span>
            <Sparkles className="h-5 w-5" />
          </div>
          
          {/* Rotating border on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:animate-spin"></div>
          
          {/* Floating particles */}
          {isExpanded && (
            <div className="absolute -top-4 -left-4 w-16 h-16 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-xs animate-float"
                  style={{
                    left: `${Math.random() * 60}px`,
                    top: `${Math.random() * 60}px`,
                    animationDelay: `${i * 300}ms`,
                    animationDuration: '3s'
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}
        </button>
      </div>

      {/* Processing Options */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
          isExpanded 
            ? 'opacity-100 transform translate-y-0 max-h-96' 
            : 'opacity-0 transform translate-y-8 max-h-0 overflow-hidden'
        }`}
      >
        {processingOptions.map((option, index) => {
          const Icon = option.icon;
          const isHovered = hoveredOption === option.id;
          
          return (
            <div
              key={option.id}
              className={`relative transform transition-all duration-500 ${
                isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => onProcess(option.id as 'summarise' | 'paraphrase' | 'generate')}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
                disabled={isProcessing}
                className={`w-full p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                  isHovered
                    ? 'scale-105 shadow-2xl border-white/30'
                    : 'hover:scale-102 shadow-lg border-white/20'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  background: isHovered 
                    ? `linear-gradient(135deg, ${option.hoverColor.split(' ')[1]}, ${option.hoverColor.split(' ')[3]})`
                    : `linear-gradient(135deg, ${option.color.split(' ')[1]}, ${option.color.split(' ')[3]})`
                }}
              >
                <div className="text-white text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-white/20 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">{option.label}</h3>
                    <span className="text-xl">{option.particles}</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Processing Animation */}
                {isProcessing && (
                  <div className="absolute inset-0 rounded-2xl bg-white/10 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <Zap className="h-5 w-5 animate-pulse" />
                      <span className="text-sm font-medium">Processing...</span>
                    </div>
                  </div>
                )}

                {/* Hover Glow Effect */}
                {isHovered && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {isExpanded && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-8 text-center">
            <div className="text-stone-600">
              <div className="text-2xl font-bold text-emerald-600">3</div>
              <div className="text-xs">AI Models</div>
            </div>
            <div className="text-stone-600">
              <div className="text-2xl font-bold text-emerald-600">~2s</div>
              <div className="text-xs">Avg. Time</div>
            </div>
            <div className="text-stone-600">
              <div className="text-2xl font-bold text-emerald-600">95%</div>
              <div className="text-xs">Accuracy</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
