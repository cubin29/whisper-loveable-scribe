
import { useState } from "react";
import { Upload, FileAudio, Loader2, CheckCircle, FileText, RotateCcw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("Welcome to our quarterly business review meeting. Today we'll be discussing the company's performance over the past three months, including revenue growth, market expansion strategies, and upcoming product launches. Our sales team has exceeded targets by 15%, particularly in the European market where we've seen a 23% increase in customer acquisition. The marketing department has successfully launched three major campaigns, resulting in improved brand recognition and customer engagement. Moving forward, we plan to invest heavily in research and development, with a focus on artificial intelligence and machine learning technologies. We anticipate launching two new products in the next quarter, pending final quality assurance testing. The financial outlook remains positive, with projected growth of 18% for the upcoming fiscal year.");
  const [dragActive, setDragActive] = useState(false);
  const [outputFormat, setOutputFormat] = useState("text");
  const [processedContent, setProcessedContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("original");

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
    setProcessedContent("");
    setActiveTab("original");
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', outputFormat);
      
      // Replace this URL with your actual API endpoint
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (outputFormat === 'json' || (contentType && contentType.includes('application/json'))) {
          const result = await response.json();
          setTranscription(JSON.stringify(result, null, 2));
        } else if (outputFormat === 'xml' || (contentType && contentType.includes('application/xml'))) {
          const xmlResult = await response.text();
          setTranscription(xmlResult);
        } else {
          const result = await response.json();
          setTranscription(result.text || result);
        }
        
        toast.success("Transcription completed!");
      } else {
        throw new Error('Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error("Transcription failed. Please try again.");
      // For demo purposes, let's add a mock transcription based on format
      setTimeout(() => {
        let demoText = "This is a demo transcription. Connect your WhisperAI API to see real results!";
        
        if (outputFormat === 'json') {
          setTranscription(JSON.stringify({
            text: demoText,
            timestamp: new Date().toISOString(),
            format: "json",
            confidence: 0.95
          }, null, 2));
        } else if (outputFormat === 'xml') {
          setTranscription(`<?xml version="1.0" encoding="UTF-8"?>
<transcription>
  <text>${demoText}</text>
  <timestamp>${new Date().toISOString()}</timestamp>
  <format>xml</format>
  <confidence>0.95</confidence>
</transcription>`);
        } else {
          setTranscription(demoText);
        }
        
        toast.success("Demo transcription completed!");
      }, 2000);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleContentProcessing = async (type: 'summarise' | 'paraphrase' | 'generate') => {
    if (!transcription) {
      toast.error("Please transcribe content first");
      return;
    }

    setIsProcessing(true);
    
    try {
      // This would be your actual API call to process the content
      // For demo purposes, we'll simulate the processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let processedText = "";
      const baseText = "This is a demo processed content. Connect your AI API to see real results!";
      
      switch (type) {
        case 'summarise':
          processedText = `Summary: ${baseText} This content has been summarized to highlight the key points.`;
          break;
        case 'paraphrase':
          processedText = `Paraphrased: ${baseText} The same ideas expressed in different words.`;
          break;
        case 'generate':
          processedText = `New Content: ${baseText} Fresh content inspired by the original transcription.`;
          break;
      }

      if (outputFormat === 'json') {
        setProcessedContent(JSON.stringify({
          type: type,
          content: processedText,
          timestamp: new Date().toISOString(),
          format: "json"
        }, null, 2));
      } else if (outputFormat === 'xml') {
        setProcessedContent(`<?xml version="1.0" encoding="UTF-8"?>
<processed>
  <type>${type}</type>
  <content>${processedText}</content>
  <timestamp>${new Date().toISOString()}</timestamp>
  <format>xml</format>
</processed>`);
      } else {
        setProcessedContent(processedText);
      }

      setActiveTab("processed");
      toast.success(`Content ${type}d successfully!`);
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(`Failed to ${type} content. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentContent = () => {
    return activeTab === "original" ? transcription : processedContent;
  };

  const copyToClipboard = () => {
    const content = getCurrentContent();
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard!");
  };

  const clearContent = () => {
    if (activeTab === "original") {
      setTranscription("");
    } else {
      setProcessedContent("");
    }
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

                {/* Output Format Selection */}
                <div className="mt-4 mb-4">
                  <Label className="text-sm font-medium text-stone-700 mb-3 block">
                    Output Format
                  </Label>
                  <RadioGroup 
                    value={outputFormat} 
                    onValueChange={setOutputFormat}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="result-text" />
                      <Label htmlFor="result-text" className="text-sm text-stone-600">Text</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="json" id="result-json" />
                      <Label htmlFor="result-json" className="text-sm text-stone-600">JSON</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="xml" id="result-xml" />
                      <Label htmlFor="result-xml" className="text-sm text-stone-600">XML</Label>
                    </div>
                  </RadioGroup>
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
                  {outputFormat !== 'text' && (
                    <Badge variant="secondary" className="ml-2">
                      {outputFormat.toUpperCase()}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-stone-600">
                  Your audio transcription and processed content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Output Format Selection */}
                  <div>
                    <Label className="text-sm font-medium text-stone-700 mb-3 block">
                      Output Format
                    </Label>
                    <RadioGroup 
                      value={outputFormat} 
                      onValueChange={setOutputFormat}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="text" id="result-text" />
                        <Label htmlFor="result-text" className="text-sm text-stone-600">Text</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="json" id="result-json" />
                        <Label htmlFor="result-json" className="text-sm text-stone-600">JSON</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="xml" id="result-xml" />
                        <Label htmlFor="result-xml" className="text-sm text-stone-600">XML</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Content Processing Options */}
                  {transcription && (
                    <div>
                      <Label className="text-sm font-medium text-stone-700 mb-3 block">
                        Content Processing
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => handleContentProcessing('summarise')}
                          disabled={isProcessing}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-3 w-3" />
                          Summarise
                        </Button>
                        <Button
                          onClick={() => handleContentProcessing('paraphrase')}
                          disabled={isProcessing}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Paraphrase
                        </Button>
                        <Button
                          onClick={() => handleContentProcessing('generate')}
                          disabled={isProcessing}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Lightbulb className="h-3 w-3" />
                          Generate New
                        </Button>
                      </div>
                      {isProcessing && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-stone-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Processing content...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content Tabs */}
                  {transcription && (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="original">Original</TabsTrigger>
                        <TabsTrigger value="processed" disabled={!processedContent}>
                          Processed
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="original">
                        <Textarea
                          value={transcription}
                          onChange={(e) => setTranscription(e.target.value)}
                          placeholder={`Original transcription in ${outputFormat} format...`}
                          className="min-h-[200px] resize-none bg-white/60 border-stone-200 text-stone-800 placeholder:text-stone-400 font-mono text-sm"
                          readOnly={isTranscribing}
                        />
                      </TabsContent>
                      <TabsContent value="processed">
                        <Textarea
                          value={processedContent}
                          onChange={(e) => setProcessedContent(e.target.value)}
                          placeholder={`Processed content in ${outputFormat} format...`}
                          className="min-h-[200px] resize-none bg-white/60 border-stone-200 text-stone-800 placeholder:text-stone-400 font-mono text-sm"
                          readOnly={isProcessing}
                        />
                      </TabsContent>
                    </Tabs>
                  )}

                  {!transcription && (
                    <Textarea
                      value=""
                      placeholder={`Transcription will appear here in ${outputFormat} format after processing...`}
                      className="min-h-[200px] resize-none bg-white/60 border-stone-200 text-stone-800 placeholder:text-stone-400 font-mono text-sm"
                      readOnly
                    />
                  )}
                  
                  {(transcription || processedContent) && (
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
                        onClick={clearContent}
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
