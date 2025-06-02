
import { useState } from "react";
import { Upload, FileAudio, CheckCircle, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HeroUploadZoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onTranscribe: () => void;
  isTranscribing: boolean;
}

export const HeroUploadZone = ({ file, setFile, onTranscribe, isTranscribing }: HeroUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/') || droppedFile.name.endsWith('.mp3') || droppedFile.name.endsWith('.wav')) {
        setFile(droppedFile);
        toast.success("Audio file ready for transcription!");
      } else {
        toast.error("Please select an audio file");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('audio/') || selectedFile.name.endsWith('.mp3') || selectedFile.name.endsWith('.wav')) {
        setFile(selectedFile);
        toast.success("Audio file ready for transcription!");
      } else {
        toast.error("Please select an audio file");
      }
    }
  };

  return (
    <div className="relative">
      {/* Upload Circle with AI-inspired design - Mobile Responsive */}
      <div
        className={`relative w-36 h-36 sm:w-48 sm:h-48 mx-auto rounded-full border-4 border-dashed transition-all duration-500 ${
          dragActive
            ? "border-ai-green-600 bg-white/90 scale-105 shadow-lg"
            : file
            ? "border-ai-green-600 bg-white/95 shadow-md"
            : "border-ai-neutral-400 bg-white/80 hover:border-ai-green-500 hover:scale-105 hover:shadow-md"
        } ${isTranscribing ? "animate-pulse shadow-lg" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          {file ? (
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="relative">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-ai-green-600 mx-auto animate-bounce" />
                {isTranscribing && (
                  <div className="absolute inset-0 border-4 border-ai-green-200 rounded-full animate-spin border-t-ai-green-600"></div>
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-ai-dark text-xs sm:text-sm truncate max-w-24 sm:max-w-32">{file.name}</p>
                <p className="text-ai-neutral-600 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {/* Mini Audio Visualization */}
                <div className="flex justify-center space-x-px mt-1 sm:mt-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-0.5 bg-ai-green-600 rounded-full transition-all duration-300 ${
                        isPlaying ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        height: `${Math.random() * 8 + 4}px`,
                        animationDelay: `${i * 100}ms`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Compact Play Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                  className="mt-1 h-5 w-5 sm:h-6 sm:w-6 p-0 bg-white hover:bg-ai-green-50 border-ai-neutral-400 text-ai-dark hover:border-ai-green-500"
                >
                  {isPlaying ? <Pause className="h-2 w-2 sm:h-3 sm:w-3" /> : <Play className="h-2 w-2 sm:h-3 sm:w-3" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-1 sm:space-y-2">
              <FileAudio className="h-8 w-8 sm:h-12 sm:w-12 text-ai-neutral-600 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-ai-dark">
                  Drop audio here
                </p>
                <p className="text-xs text-ai-neutral-600">
                  or click to browse
                </p>
                <p className="text-xs text-ai-neutral-500">
                  MP3, WAV, M4A
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button - Mobile Responsive */}
      {file && (
        <div className="flex justify-center mt-3">
          <Button
            onClick={onTranscribe}
            disabled={isTranscribing}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-ai-green-600 to-ai-green-700 hover:from-ai-green-700 hover:to-ai-green-800 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            size="sm"
          >
            {isTranscribing ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                Transcribing...
              </>
            ) : (
              <>
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Start Magic ✨
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
