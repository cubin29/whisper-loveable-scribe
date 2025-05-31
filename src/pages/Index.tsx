
import { useState } from "react";
import { Upload, FileAudio, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [dragActive, setDragActive] = useState(false);

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
        toast.success("Audio file selected successfully!");
      } else {
        toast.error("Please select an audio file (MP3, WAV, etc.)");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('audio/') || selectedFile.name.endsWith('.mp3') || selectedFile.name.endsWith('.wav')) {
        setFile(selectedFile);
        toast.success("Audio file selected successfully!");
      } else {
        toast.error("Please select an audio file (MP3, WAV, etc.)");
      }
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      toast.error("Please select an audio file first");
      return;
    }

    setIsTranscribing(true);
    setTranscription("");
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Replace this URL with your actual API endpoint
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setTranscription(result.text);
        toast.success("Transcription completed!");
      } else {
        throw new Error('Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error("Transcription failed. Please try again.");
      // For demo purposes, let's add a mock transcription
      setTimeout(() => {
        setTranscription("This is a demo transcription. Connect your WhisperAI API to see real results!");
        toast.success("Demo transcription completed!");
      }, 2000);
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    toast.success("Transcription copied to clipboard!");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-emerald-50"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-amber-200/20 to-stone-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-tr from-emerald-200/15 to-olive-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-stone-200/10 to-amber-100/15 rounded-full blur-2xl"></div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_#8b7355_1px,_transparent_0)] bg-[size:24px_24px]"></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-stone-800 mb-2">
              WhisperAI Transcription
            </h1>
            <p className="text-lg text-stone-600">
              Transform your audio into text with AI-powered transcription
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Upload Section */}
            <Card className="transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-white/80 border-stone-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stone-800">
                  <Upload className="h-5 w-5" />
                  Upload Audio File
                </CardTitle>
                <CardDescription className="text-stone-600">
                  Drag and drop your audio file or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50/50"
                      : file
                      ? "border-emerald-600 bg-emerald-50/30"
                      : "border-stone-300 hover:border-stone-400 hover:bg-stone-50/30"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {file ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
                      <p className="text-sm font-medium text-emerald-700">{file.name}</p>
                      <p className="text-xs text-emerald-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileAudio className="h-12 w-12 text-stone-500 mx-auto" />
                      <p className="text-sm text-stone-600">
                        Drop your audio file here or click to browse
                      </p>
                      <p className="text-xs text-stone-500">
                        Supports MP3, WAV, M4A and other audio formats
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleTranscribe}
                  disabled={!file || isTranscribing}
                  className="w-full mt-4 bg-gradient-to-r from-stone-600 to-emerald-700 hover:from-stone-700 hover:to-emerald-800 text-white"
                  size="lg"
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Transcribing...
                    </>
                  ) : (
                    "Start Transcription"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-white/80 border-stone-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stone-800">
                  <FileAudio className="h-5 w-5" />
                  Transcription Result
                </CardTitle>
                <CardDescription className="text-stone-600">
                  Your audio transcription will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    placeholder="Transcription will appear here after processing..."
                    className="min-h-[200px] resize-none bg-white/60 border-stone-200 text-stone-800 placeholder:text-stone-400"
                    readOnly={isTranscribing}
                  />
                  
                  {transcription && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-50"
                      >
                        Copy to Clipboard
                      </Button>
                      <Button 
                        onClick={() => setTranscription("")}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-stone-300 text-stone-700 hover:bg-stone-50"
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="text-center p-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm border border-stone-200/50">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-100 to-stone-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileAudio className="h-6 w-6 text-stone-700" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Multiple Formats</h3>
              <p className="text-sm text-stone-600">
                Supports MP3, WAV, M4A and other popular audio formats
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm border border-stone-200/50">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">High Accuracy</h3>
              <p className="text-sm text-stone-600">
                Powered by OpenAI's Whisper for accurate transcription
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-sm border border-stone-200/50">
              <div className="h-12 w-12 bg-gradient-to-br from-stone-100 to-amber-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-stone-700" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Easy Upload</h3>
              <p className="text-sm text-stone-600">
                Drag and drop interface for quick and easy file uploads
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
