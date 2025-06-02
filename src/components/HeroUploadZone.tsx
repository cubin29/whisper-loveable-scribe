
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
      {/* Upload Circle with better contrast */}
      <div
        className={`relative w-48 h-48 mx-auto rounded-full border-4 border-dashed transition-all duration-500 ${
          dragActive
            ? "border-emerald-600 bg-white/80 scale-105"
            : file
            ? "border-emerald-600 bg-white/90"
            : "border-stone-500 bg-white/70 hover:border-emerald-600 hover:scale-105"
        } ${isTranscribing ? "animate-pulse" : ""}`}
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
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {file ? (
            <div className="text-center space-y-2">
              <div className="relative">
                <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
                {isTranscribing && (
                  <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600"></div>
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-stone-900 text-sm truncate max-w-32">{file.name}</p>
                <p className="text-stone-700 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {/* Mini Audio Visualization */}
                <div className="flex justify-center space-x-px mt-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-0.5 bg-emerald-600 rounded-full transition-all duration-300 ${
                        isPlaying ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        height: `${Math.random() * 12 + 6}px`,
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
                  className="mt-1 h-6 w-6 p-0 bg-white hover:bg-stone-50 border-stone-400 text-stone-800"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <FileAudio className="h-12 w-12 text-stone-700 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-stone-900">
                  Drop audio here
                </p>
                <p className="text-xs text-stone-700">
                  or click to browse
                </p>
                <p className="text-xs text-stone-600">
                  MP3, WAV, M4A
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {file && (
        <div className="flex justify-center mt-3">
          <Button
            onClick={onTranscribe}
            disabled={isTranscribing}
            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-stone-700 hover:from-emerald-700 hover:to-stone-800 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            size="sm"
          >
            {isTranscribing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Transcribing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Start Magic ✨
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
