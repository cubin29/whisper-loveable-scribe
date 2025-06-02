
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background Design */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-emerald-50"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-amber-200/20 to-stone-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-tr from-emerald-200/15 to-stone-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-stone-200/10 to-amber-100/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-300/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-stone-800 mb-4 bg-gradient-to-r from-stone-700 via-emerald-600 to-stone-700 bg-clip-text text-transparent">
              WhisperAI Studio
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Transform your audio into intelligent content with AI-powered transcription and processing
            </p>
          </div>

          {/* Processing Pipeline */}
          <ProcessingPipeline 
            currentStep={currentStep}
            isTranscribing={isTranscribing}
            isProcessing={isProcessing}
          />

          {/* Main Content Area */}
          <div className="space-y-12">
            {/* Upload Zone */}
            <HeroUploadZone
              file={file}
              setFile={setFile}
              onTranscribe={handleTranscribe}
              isTranscribing={isTranscribing}
            />

            {/* Processing Hub */}
            <InteractiveProcessingHub
              onProcess={handleContentProcessing}
              isProcessing={isProcessing}
              hasContent={!!transcription}
            />

            {/* Content Canvas */}
            {transcription && (
              <SmartContentCanvas
                transcription={transcription}
                processedContent={processedContent}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onClear={clearContent}
              />
            )}
          </div>

          {/* Enhanced Features Section */}
          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "AI-Powered Accuracy",
                description: "Advanced machine learning models ensure precise transcription with 95%+ accuracy",
                icon: "🤖",
                gradient: "from-blue-100 to-blue-200"
              },
              {
                title: "Smart Processing",
                description: "Intelligent content transformation with summarization, paraphrasing, and generation",
                icon: "⚡",
                gradient: "from-purple-100 to-purple-200"
              },
              {
                title: "Multiple Formats",
                description: "Export in Text, JSON, or XML formats with real-time preview and syntax highlighting",
                icon: "📄",
                gradient: "from-emerald-100 to-emerald-200"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-stone-800 mb-3 text-lg">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;
