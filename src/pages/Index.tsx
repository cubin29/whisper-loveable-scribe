import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HeroUploadZone } from "@/components/HeroUploadZone";
import { ProcessingPipeline } from "@/components/ProcessingPipeline";
import { SmartContentCanvas } from "@/components/SmartContentCanvas";
import { InteractiveProcessingHub } from "@/components/InteractiveProcessingHub";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [outputFormat, setOutputFormat] = useState("text");
  const [processedContent, setProcessedContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("original");
  
  // Pipeline state
  const [currentStep, setCurrentStep] = useState<'upload' | 'transcribe' | 'process' | 'complete'>('upload');

  // Sample content for demonstration
  const sampleTranscription = "Welcome to our quarterly business review meeting. Today we'll be discussing the company's performance over the past three months, including revenue growth, market expansion strategies, and upcoming product launches. Our sales team has exceeded targets by 15%, particularly in the European market where we've seen a 23% increase in customer acquisition. The marketing department has successfully launched three major campaigns, resulting in improved brand recognition and customer engagement. Moving forward, we plan to invest heavily in research and development, with a focus on artificial intelligence and machine learning technologies. We anticipate launching two new products in the next quarter, pending final quality assurance testing. The financial outlook remains positive, with projected growth of 18% for the upcoming fiscal year.";

  // Set sample content on load for demo
  useEffect(() => {
    if (!transcription) {
      updateTranscriptionFormat(sampleTranscription);
      setCurrentStep('transcribe');
    }
  }, []);

  // Update format when outputFormat changes
  useEffect(() => {
    if (transcription) {
      updateTranscriptionFormat(sampleTranscription);
    }
  }, [outputFormat]);

  const updateTranscriptionFormat = (baseText: string) => {
    if (outputFormat === 'json') {
      setTranscription(JSON.stringify({
        text: baseText,
        timestamp: new Date().toISOString(),
        format: "json",
        confidence: 0.95,
        duration: "4:32",
        language: "en"
      }, null, 2));
    } else if (outputFormat === 'xml') {
      setTranscription(`<?xml version="1.0" encoding="UTF-8"?>
<transcription>
  <text>${baseText}</text>
  <timestamp>${new Date().toISOString()}</timestamp>
  <format>xml</format>
  <confidence>0.95</confidence>
  <duration>4:32</duration>
  <language>en</language>
</transcription>`);
    } else {
      setTranscription(baseText);
    }

    // Update processed content if it exists
    if (processedContent) {
      updateProcessedContentFormat();
    }
  };

  const updateProcessedContentFormat = () => {
    const baseProcessedText = processedContent.includes('Summary:') ? 
      "Summary: This quarterly business review highlights strong performance with 15% sales growth, 23% European market expansion, successful marketing campaigns, and positive 18% projected growth for next fiscal year." :
      processedContent.includes('Paraphrased:') ?
      "Paraphrased: During this quarterly business assessment, we reviewed our company's achievements over the previous three months, focusing on revenue increases, market development tactics, and forthcoming product releases." :
      "New Content: Building on our quarterly achievements, this comprehensive business analysis reveals exceptional performance metrics and strategic positioning for future growth initiatives.";

    if (outputFormat === 'json') {
      setProcessedContent(JSON.stringify({
        type: processedContent.includes('Summary:') ? 'summary' : processedContent.includes('Paraphrased:') ? 'paraphrase' : 'generated',
        content: baseProcessedText,
        timestamp: new Date().toISOString(),
        format: "json"
      }, null, 2));
    } else if (outputFormat === 'xml') {
      setProcessedContent(`<?xml version="1.0" encoding="UTF-8"?>
<processed>
  <type>${processedContent.includes('Summary:') ? 'summary' : processedContent.includes('Paraphrased:') ? 'paraphrase' : 'generated'}</type>
  <content>${baseProcessedText}</content>
  <timestamp>${new Date().toISOString()}</timestamp>
  <format>xml</format>
</processed>`);
    } else {
      setProcessedContent(baseProcessedText);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      toast.error("Please select an audio file first");
      return;
    }

    setIsTranscribing(true);
    setCurrentStep('transcribe');
    setTranscription("");
    setProcessedContent("");
    setActiveTab("original");
    
    try {
      // Simulate transcription process
      await new Promise(resolve => setTimeout(resolve, 3000));
      updateTranscriptionFormat(sampleTranscription);
      setCurrentStep('process');
      toast.success("Transcription completed!");
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error("Transcription failed. Please try again.");
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
    setCurrentStep('process');
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let processedText = "";
      
      switch (type) {
        case 'summarise':
          processedText = "Summary: This quarterly business review highlights strong performance with 15% sales growth, 23% European market expansion, successful marketing campaigns, and positive 18% projected growth for next fiscal year.";
          break;
        case 'paraphrase':
          processedText = "Paraphrased: During this quarterly business assessment, we reviewed our company's achievements over the previous three months, focusing on revenue increases, market development tactics, and forthcoming product releases.";
          break;
        case 'generate':
          processedText = "New Content: Building on our quarterly achievements, this comprehensive business analysis reveals exceptional performance metrics and strategic positioning for future growth initiatives.";
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
      setCurrentStep('complete');
      toast.success(`Content ${type}d successfully!`);
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(`Failed to ${type} content. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearContent = () => {
    if (activeTab === "original") {
      setTranscription("");
      setCurrentStep('upload');
    } else {
      setProcessedContent("");
      setActiveTab("original");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ai-neutral-50 via-ai-green-50 to-ai-neutral-100">
      {/* Enhanced Background Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-ai-green-200/20 to-ai-neutral-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-tr from-ai-green-100/15 to-ai-neutral-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content Container - Mobile Responsive */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 lg:p-6">
        {/* Compact Header */}
        <div className="text-center mb-4 lg:mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-ai-dark mb-2 bg-gradient-to-r from-ai-dark via-ai-green-600 to-ai-dark bg-clip-text text-transparent">
            WhisperAI Studio
          </h1>
          <p className="text-sm lg:text-base text-ai-neutral-600">
            Transform audio into intelligent content with AI
          </p>
        </div>

        {/* Processing Pipeline - Compact and Mobile Responsive */}
        <div className="mb-4 lg:mb-6">
          <ProcessingPipeline 
            currentStep={currentStep}
            isTranscribing={isTranscribing}
            isProcessing={isProcessing}
          />
        </div>

        {/* Main Layout - Responsive Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-0">
          {/* Left Column - Upload & Processing - Full width on mobile */}
          <div className="lg:col-span-5 flex flex-col space-y-4 order-1 lg:order-1">
            {/* Compact Upload Zone */}
            <div className="flex-shrink-0">
              <HeroUploadZone
                file={file}
                setFile={setFile}
                onTranscribe={handleTranscribe}
                isTranscribing={isTranscribing}
              />
            </div>

            {/* Processing Hub - Always Visible */}
            <div className="flex-shrink-0">
              <InteractiveProcessingHub
                onProcess={handleContentProcessing}
                isProcessing={isProcessing}
                hasContent={!!transcription}
              />
            </div>
          </div>

          {/* Right Column - Content Canvas - Full width on mobile, below other content */}
          <div className="lg:col-span-7 min-h-0 order-2 lg:order-2">
            {transcription && (
              <div className="h-full min-h-[400px] lg:min-h-0">
                <SmartContentCanvas
                  transcription={transcription}
                  processedContent={processedContent}
                  outputFormat={outputFormat}
                  setOutputFormat={setOutputFormat}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onClear={clearContent}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
