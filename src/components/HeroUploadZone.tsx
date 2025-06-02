
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
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-stone-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-amber-200/15 to-emerald-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Upload Circle */}
      <div className="relative z-10">
        <div
          className={`relative w-80 h-80 rounded-full border-4 border-dashed transition-all duration-500 backdrop-blur-sm ${
            dragActive
              ? "border-emerald-400 bg-emerald-50/30 scale-105"
              : file
              ? "border-emerald-500 bg-emerald-50/20 scale-100"
              : "border-stone-300 bg-white/10 hover:border-stone-400 hover:scale-105"
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
              <div className="text-center space-y-4">
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
                  {isTranscribing && (
                    <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600"></div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-emerald-700 text-lg">{file.name}</p>
                  <p className="text-emerald-600 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {/* Audio Waveform Visualization Placeholder */}
                  <div className="flex justify-center space-x-1 mt-4">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 bg-emerald-500 rounded-full transition-all duration-300 ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          height: `${Math.random() * 20 + 10}px`,
                          animationDelay: `${i * 100}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Play/Pause Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="mt-2 bg-white/50 hover:bg-white/70"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className={`transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`}>
                  <FileAudio className="h-20 w-20 text-stone-500 mx-auto" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-stone-700">
                    Drop your audio here
                  </p>
                  <p className="text-stone-500">
                    or click to browse files
                  </p>
                  <p className="text-xs text-stone-400">
                    MP3, WAV, M4A supported
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ripple Effect on Hover */}
          {!file && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        {file && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={onTranscribe}
              disabled={isTranscribing}
              className="relative px-8 py-6 bg-gradient-to-r from-emerald-600 to-stone-700 hover:from-emerald-700 hover:to-stone-800 text-white rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              size="lg"
            >
              {isTranscribing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Transcribing...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-3" />
                  Start Magic ✨
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
