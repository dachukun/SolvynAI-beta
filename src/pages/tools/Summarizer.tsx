
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, Upload, X, FileType } from "lucide-react";
import { deepseekAI } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Summarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summaryGoal, setSummaryGoal] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!inputText.trim() && !file) {
      toast({
        title: "Empty Input",
        description: "Please enter some text or upload a file to summarize.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage("Reading your input...");
      
      let textToSummarize = inputText;
      
      if (file) {
        // For image files, we would normally use OCR here
        // For PDFs, we would use a PDF parser
        // For now, we'll just acknowledge the file
        if (file.type.includes("image") || file.type.includes("pdf")) {
          textToSummarize = `${textToSummarize}\n\n[Contents from file: ${file.name}]`;
        } else {
          const text = await file.text();
          textToSummarize = `${textToSummarize}\n\n${text}`;
        }
      }
      
      let prompt = `Please provide a concise summary of the following text.`;
      if (summaryGoal.trim()) {
        prompt += ` Focus on the main points and key information, specifically addressing: ${summaryGoal}`; 
      } else {
        prompt += ` Focus on the main points and key information:`;
      }
      prompt += ` \n\n${textToSummarize}`;
      setLoadingMessage("Thinking about it...");
      const result = await deepseekAI(prompt);
      setLoadingMessage("Compiling it together...");
      // Simulate some delay for sequential messages
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadingMessage("Final stages...");
      await new Promise(resolve => setTimeout(resolve, 500));
      setSummary(result);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("active");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("active");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("active");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const acceptedTypes = ["text/plain", "application/pdf", "image/png", "image/jpeg", "image/jpg"];
    
    if (!acceptedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a TXT, PDF, PNG, or JPG file.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
    
    // If it's a text file, read and add content to textarea
    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputText((prev) => prev ? `${prev}\n\n${content}` : content);
      };
      reader.readAsText(selectedFile);
    }
    
    toast({
      title: "File Uploaded",
      description: `${selectedFile.name} has been uploaded.`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="solvynai-page">
      <header className="mb-8 flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-lg">
          <AlignLeft className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Summarizer</h1>
          <p className="text-muted-foreground">
            Generate concise summaries from lengthy content
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isLoading ? "Summarizing..." : summary ? "Summary" : "Input Text"}</CardTitle>
            <CardDescription>
              {isLoading ? "Please wait while AI generates the summary." : summary ? "AI-generated summary of your text" : "Paste the text you want to summarize or upload a file"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="loader mb-4"></div>
                <p className="text-muted-foreground">{loadingMessage}</p>
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-wrap overflow-y-auto">
                  {summary}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    if (summary) {
                      navigator.clipboard.writeText(summary);
                      toast({
                        title: "Copied!",
                        description: "Summary copied to clipboard",
                      });
                    }
                  }}
                  disabled={!summary}
                >
                  Copy Summary
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => setSummary("")}
                >
                  Summarize Another
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  placeholder="Paste or type your text here..." 
                  className="min-h-[200px]"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                />
                <Input 
                  placeholder="Optional: What should the summary focus on? (e.g., main points, key facts, etc.)"
                  value={summaryGoal}
                  onChange={(e) => setSummaryGoal(e.target.value)}
                  disabled={isLoading}
                />
                <div 
                  className="file-upload-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".txt,.pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInputChange}
                    disabled={isLoading}
                  />
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    Drag & drop or click to upload a file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports TXT, PDF, PNG, JPG files (max 10MB)
                  </p>
                </div>
                {file && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileType size={16} className="text-primary" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeFile} disabled={isLoading}>
                      <X size={16} />
                    </Button>
                  </div>
                )}
                <Button 
                  className="w-full"
                  onClick={handleSummarize}
                  disabled={isLoading}
                >
                  Summarize
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Summarizer;
