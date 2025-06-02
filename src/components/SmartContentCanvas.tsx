
import { useState, useEffect } from "react";
import { Copy, Trash2, Download, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    { id: 'text', label: 'Text', color: 'bg-blue-500' },
    { id: 'json', label: 'JSON', color: 'bg-green-500' },
    { id: 'xml', label: 'XML', color: 'bg-purple-500' }
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
    <div className="w-full space-y-6">
      {/* Header with Format Selection */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-stone-800">Content Canvas</h3>
          <Badge variant="outline" className="bg-white/50">
            {outputFormat.toUpperCase()}
          </Badge>
        </div>
        
        {/* Format Pills */}
        <div className="flex gap-2">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => setOutputFormat(format.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                outputFormat === format.id
                  ? `${format.color} text-white scale-105 shadow-lg`
                  : 'bg-white/60 text-stone-600 hover:bg-white/80 hover:scale-105'
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="relative">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('original')}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all duration-300 ${
              activeTab === 'original'
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-500'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setActiveTab('processed')}
            disabled={!processedContent}
            className={`px-6 py-3 rounded-t-lg font-medium transition-all duration-300 ${
              activeTab === 'processed' && processedContent
                ? 'bg-white text-emerald-600 border-b-2 border-emerald-500'
                : processedContent
                ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                : 'bg-stone-50 text-stone-400 cursor-not-allowed'
            }`}
          >
            Processed
            {processedContent && (
              <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="relative">
          <div
            className={`transition-all duration-500 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <div className="relative bg-white/70 backdrop-blur-sm rounded-lg border border-stone-200 overflow-hidden">
              {/* Content Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white/50">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${activeTab === 'original' ? 'bg-blue-500' : 'bg-emerald-500'} animate-pulse`}></div>
                  <span className="text-sm font-medium text-stone-600">
                    {activeTab === 'original' ? 'Original Transcription' : 'Processed Content'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(!isVisible)}
                    className="p-2"
                  >
                    {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <Textarea
                  value={getCurrentContent()}
                  className="min-h-[300px] resize-none border-0 bg-transparent focus:ring-0 font-mono text-sm p-6"
                  placeholder={`${activeTab === 'original' ? 'Original' : 'Processed'} content in ${outputFormat} format...`}
                  readOnly
                />
                
                {/* Syntax highlighting overlay for JSON/XML */}
                {(outputFormat === 'json' || outputFormat === 'xml') && getCurrentContent() && (
                  <div className="absolute top-6 left-6 right-6 bottom-6 pointer-events-none">
                    <pre className="text-sm font-mono h-full overflow-hidden">
                      <code className={`language-${outputFormat} opacity-50`}>
                        {getCurrentContent()}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className={`flex-1 transition-all duration-300 ${
              copySuccess 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                : 'hover:scale-105'
            }`}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
          
          <Button
            variant="outline"
            className="flex-1 hover:scale-105 transition-all duration-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            onClick={onClear}
            variant="outline"
            className="hover:scale-105 transition-all duration-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
