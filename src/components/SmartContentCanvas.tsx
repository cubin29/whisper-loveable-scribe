
import { useState } from "react";
import { Copy, Trash2, Download, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface SmartContentCanvasProps {
  transcription: string;
  processedContent: string;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClear: () => void;
}

export const SmartContentCanvas = ({
  transcription,
  processedContent,
  outputFormat,
  setOutputFormat,
  activeTab,
  setActiveTab,
  onClear
}: SmartContentCanvasProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  const formats = [
    { id: 'text', label: 'Text', color: 'bg-ai-green-500' },
    { id: 'json', label: 'JSON', color: 'bg-ai-green-600' },
    { id: 'xml', label: 'XML', color: 'bg-ai-green-700' }
  ];

  const getCurrentContent = () => {
    return activeTab === "original" ? transcription : processedContent;
  };

  const copyToClipboard = async () => {
    const content = getCurrentContent();
    await navigator.clipboard.writeText(content);
    setCopySuccess(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!transcription) return null;

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Compact Header with Format Selection - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-ai-dark">Content Canvas</h3>
          <Badge variant="outline" className="bg-white/50 text-xs border-ai-neutral-300">
            {outputFormat.toUpperCase()}
          </Badge>
        </div>
        
        {/* Compact Format Pills - Stack on mobile */}
        <div className="flex gap-1">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setOutputFormat(format.id)}
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                outputFormat === format.id
                  ? `${format.color} text-white scale-105 shadow-md`
                  : 'bg-white/60 text-ai-neutral-600 hover:bg-white/80 hover:scale-105 border border-ai-neutral-200'
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Content Tabs - Mobile Responsive */}
      <div className="flex gap-1">
        <button
          onClick={() => setActiveTab('original')}
          className={`px-3 sm:px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'original'
              ? 'bg-white text-ai-green-600 border-b-2 border-ai-green-500 shadow-sm'
              : 'bg-ai-neutral-100 text-ai-neutral-600 hover:bg-ai-neutral-200'
          }`}
        >
          Original
        </button>
        <button
          onClick={() => setActiveTab('processed')}
          disabled={!processedContent}
          className={`px-3 sm:px-4 py-2 rounded-t-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'processed' && processedContent
              ? 'bg-white text-ai-green-600 border-b-2 border-ai-green-500 shadow-sm'
              : processedContent
              ? 'bg-ai-neutral-100 text-ai-neutral-600 hover:bg-ai-neutral-200'
              : 'bg-ai-neutral-50 text-ai-neutral-400 cursor-not-allowed'
          }`}
        >
          Processed
          {processedContent && (
            <span className="ml-1 w-1.5 h-1.5 bg-ai-green-500 rounded-full inline-block animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Content Area - Full Height and Mobile Responsive */}
      <div className="flex-1 min-h-0">
        <div className="h-full bg-white/80 backdrop-blur-sm rounded-lg border border-ai-neutral-200 overflow-hidden flex flex-col shadow-sm">
          {/* Content Header */}
          <div className="flex items-center justify-between p-3 border-b border-ai-neutral-200 bg-white/60 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${activeTab === 'original' ? 'bg-ai-green-500' : 'bg-ai-green-600'} animate-pulse`}></div>
              <span className="text-xs font-medium text-ai-neutral-600">
                {activeTab === 'original' ? 'Original Transcription' : 'Processed Content'}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="p-1 h-6 w-6 hover:bg-ai-neutral-100"
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 min-h-0">
            {isVisible && (
              <ScrollArea className="h-full">
                <Textarea
                  value={getCurrentContent()}
                  className="min-h-full resize-none border-0 bg-transparent focus:ring-0 font-mono text-xs p-4 text-ai-dark"
                  placeholder={`${activeTab === 'original' ? 'Original' : 'Processed'} content in ${outputFormat} format...`}
                  readOnly
                />
              </ScrollArea>
            )}
          </div>
        </div>
      </div>

      {/* Compact Action Buttons - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className={`flex-1 transition-all duration-300 border-ai-neutral-300 ${
            copySuccess 
              ? 'bg-ai-green-50 border-ai-green-300 text-ai-green-700' 
              : 'hover:scale-105 hover:bg-ai-green-50 hover:border-ai-green-400'
          }`}
        >
          <Copy className="h-3 w-3 mr-1" />
          {copySuccess ? 'Copied!' : 'Copy'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:scale-105 transition-all duration-300 border-ai-neutral-300 hover:bg-ai-green-50 hover:border-ai-green-400"
        >
          <Download className="h-3 w-3 mr-1" />
          Export
        </Button>
        
        <Button
          onClick={onClear}
          variant="outline"
          size="sm"
          className="sm:flex-none hover:scale-105 transition-all duration-300 hover:bg-ai-red-50 hover:border-ai-red-300 hover:text-ai-red-600 border-ai-neutral-300"
        >
          <Trash2 className="h-3 w-3 sm:mr-0 mr-1" />
          <span className="sm:hidden">Clear</span>
        </Button>
      </div>
    </div>
  );
};
