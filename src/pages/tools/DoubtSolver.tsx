
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Upload, X, FileType } from "lucide-react";
import { deepseekAI } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DoubtSolver = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSolveDoubt = async () => {
    if (!question.trim() && !file) {
      toast({
        title: "Empty Question",
        description: "Please enter your question or doubt, or upload a file.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage("Reading your input...");
      let fullQuestion = question;
      if (file) {
        if (file.type.includes("image") || file.type.includes("pdf")) {
          fullQuestion = `${fullQuestion}\n\n[Reference from file: ${file.name}]`;
        } else {
          const text = await file.text();
          fullQuestion = `${fullQuestion}\n\nReference material: ${text}`;
        }
      }
      setLoadingMessage("Thinking about it...");
      const prompt = `I'm a student with the following academic question or doubt. Please provide a clear, educational explanation: \n\n${fullQuestion}`;
      const result = await deepseekAI(prompt);
      setLoadingMessage("Finalizing answer...");
      await new Promise(resolve => setTimeout(resolve, 400));
      setAnswer(result);
    } catch (error) {
      console.error("Error solving doubt:", error);
      toast({
        title: "Error",
        description: "Failed to solve your doubt. Please try again.",
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
    
    // If it's a text file, we can read its contents
    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Optionally use content in your question
        if (!question.trim()) {
          setQuestion(`I need help understanding this: \n\n${content}`);
        }
      };
      reader.readAsText(selectedFile);
    }
    
    toast({
      title: "File Uploaded",
      description: `${selectedFile.name} has been uploaded for reference.`,
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
      <header className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <HelpCircle className="text-primary" size={24} />
            </div>
            <h1 className="text-3xl font-bold">Doubt Solver</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Get help with challenging concepts and problems
          </p>
        </div>
        <div className="cursor-pointer" onClick={() => navigate('/profile')}>
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.email || "User"} />
            <AvatarFallback>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isLoading ? "Solving..." : answer ? "Solution" : "Your Question"}</CardTitle>
            <CardDescription>
              {isLoading ? "Please wait while AI solves your doubt." : answer ? "AI-generated solution to your question" : "Ask any academic question or upload related materials"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="loader mb-4"></div>
                <p className="text-muted-foreground">{loadingMessage}</p>
              </div>
            ) : answer ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-wrap overflow-y-auto">
                  {answer}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    if (answer) {
                      navigator.clipboard.writeText(answer);
                      toast({
                        title: "Copied!",
                        description: "Solution copied to clipboard",
                      });
                    }
                  }}
                  disabled={!answer}
                >
                  Copy Solution
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => setAnswer("")}
                >
                  Solve Another
                </Button>
              </div>
            ) : (
              <>
                <Textarea 
                  placeholder="Explain the concept of photosynthesis..."
                  className="min-h-[200px]"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <div 
                  className="file-upload-area"
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("active"); }}
                  onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove("active"); }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("active"); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { handleFileSelect(e.dataTransfer.files[0]); } }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept=".txt,.pdf,.png,.jpg,.jpeg"
                    onChange={handleFileInputChange}
                  />
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    Drag & drop or click to upload a reference
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
                    <Button variant="ghost" size="icon" onClick={removeFile}>
                      <X size={16} />
                    </Button>
                  </div>
                )}
                <Button 
                  className="w-full"
                  onClick={handleSolveDoubt}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                      Solving...
                    </>
                  ) : (
                    <>Solve Doubt</>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoubtSolver;
