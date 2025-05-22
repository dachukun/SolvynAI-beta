
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileSearch, Upload, X, FileType, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { deepseekAI } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AnswerSheetAnalyzer = () => {
  const [question, setQuestion] = useState("");
  const [answerSheet, setAnswerSheet] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerSheetFile, setAnswerSheetFile] = useState<File | null>(null);
  const questionFileInputRef = useRef<HTMLInputElement>(null);
  const answerSheetFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if ((!question.trim() && !questionFile) || (!answerSheet.trim() && !answerSheetFile)) {
      toast({
        title: "Missing Information",
        description: "Please provide both the question and the answer sheet (text or file).",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage("Reading your input...");
      let questionText = question;
      let answerSheetText = answerSheet;
      if (questionFile) {
        if (questionFile.type.includes("image") || questionFile.type.includes("pdf")) {
          questionText = `[Question from uploaded file: ${questionFile.name}]\n\n${questionText}`;
        } else if (questionFile.type === "text/plain") {
          const text = await questionFile.text();
          questionText = text;
        }
      }
      if (answerSheetFile) {
        if (answerSheetFile.type.includes("image") || answerSheetFile.type.includes("pdf")) {
          answerSheetText = `[Answer sheet from uploaded file: ${answerSheetFile.name}]\n\n${answerSheetText}`;
        } else if (answerSheetFile.type === "text/plain") {
          const text = await answerSheetFile.text();
          answerSheetText = text;
        }
      }
      let prompt = `You are an expert teacher. Please analyze the provided answer sheet in relation to the question and provide detailed feedback.\n\nQuestion:\n${questionText}\n\nAnswer Sheet:\n${answerSheetText}\n\nPlease provide an analysis that includes:\n1. Whether the answer sheet addresses the question correctly, partially, or incorrectly\n2. Points that were correctly addressed\n3. Points that were missed or incorrect\n4. Suggestions for improvement\n5. A score out of 10`;
      setLoadingMessage("Thinking about it...");
      const result = await deepseekAI(prompt);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing answer sheet:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the answer sheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleQuestionFileSelect = (selectedFile: File) => {
    const acceptedTypes = ["text/plain", "application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!acceptedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a TXT, PDF, PNG, or JPG file.",
        variant: "destructive",
      });
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    setQuestionFile(selectedFile);
    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setQuestion(content);
      };
      reader.readAsText(selectedFile);
    }
    toast({
      title: "File Uploaded",
      description: `${selectedFile.name} has been uploaded as the question.`,
    });
  };

  const handleAnswerSheetFileSelect = (selectedFile: File) => {
    const acceptedTypes = ["text/plain", "application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!acceptedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a TXT, PDF, PNG, or JPG file.",
        variant: "destructive",
      });
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    setAnswerSheetFile(selectedFile);
    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setAnswerSheet(content);
      };
      reader.readAsText(selectedFile);
    }
    toast({
      title: "File Uploaded",
      description: `${selectedFile.name} has been uploaded as the answer sheet.`,
    });
  };

  const handleQuestionFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleQuestionFileSelect(e.target.files[0]);
    }
  };
  const handleAnswerSheetFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAnswerSheetFileSelect(e.target.files[0]);
    }
  };
  const removeQuestionFile = () => {
    setQuestionFile(null);
    if (questionFileInputRef.current) {
      questionFileInputRef.current.value = "";
    }
  };
  const removeAnswerSheetFile = () => {
    setAnswerSheetFile(null);
    if (answerSheetFileInputRef.current) {
      answerSheetFileInputRef.current.value = "";
    }
  };
  const renderAnalysisWithHighlights = () => {
    if (!analysis) return "Your analysis will appear here...";
    let formattedAnalysis = analysis;
    formattedAnalysis = formattedAnalysis
      .replace(/\bcorrect\b/gi, '<span class="text-green-500 font-medium">correct</span>')
      .replace(/\bincorrect\b/gi, '<span class="text-red-500 font-medium">incorrect</span>')
      .replace(/\bpartially correct\b/gi, '<span class="text-amber-500 font-medium">partially correct</span>')
      .replace(/\bScore:?\s*(\d+(?:\.\d+)?)\s*\/\s*10/gi, 'Score: <span class="text-primary font-bold text-lg">$1/10</span>')
      .replace(/\bmissed\b/gi, '<span class="text-red-500">missed</span>')
      .replace(/\bimprovement\b/gi, '<span class="text-blue-500">improvement</span>')
      .replace(/^\d+\.\s+(.*?)$/gm, '<div class="flex gap-2 items-start mb-2"><div class="bg-primary/10 p-1 rounded text-primary">•</div><div>$1</div></div>');
    return <div dangerouslySetInnerHTML={{ __html: formattedAnalysis }} />;
  };
  return (
    <div className="solvynai-page">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileSearch className="text-primary" size={24} />
            </div>
            <h1 className="text-3xl font-bold">Answer Sheet Analyzer</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Get detailed feedback on your answers and assignments
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
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="loader mb-4"></div>
                <div className="flex items-center gap-8 mb-4">
                  <div className="flex flex-col items-center">
                    <CheckCircle className="text-green-500" size={40} />
                    <span className="text-xs mt-1">Correct Points</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <XCircle className="text-red-500" size={40} />
                    <span className="text-xs mt-1">Errors Found</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <HelpCircle className="text-blue-500" size={40} />
                    <span className="text-xs mt-1">Suggestions</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{loadingMessage}</p>
                <p className="text-xs text-muted-foreground mt-2">Submit a question and answer sheet to receive detailed analysis</p>
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-wrap overflow-y-auto">
                  {renderAnalysisWithHighlights()}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    if (analysis) {
                      navigator.clipboard.writeText(analysis);
                      toast({
                        title: "Copied!",
                        description: "Analysis copied to clipboard",
                      });
                    }
                  }}
                  disabled={!analysis}
                >
                  Copy Analysis
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => setAnalysis("")}
                >
                  Analyze Another
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <CardTitle>Question</CardTitle>
                      <CardDescription>
                        Enter the question or upload a file
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea 
                        placeholder="Type or paste the question here..."
                        className="min-h-[150px]"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                      />
                      <div 
                        className="file-upload-area"
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("active"); }}
                        onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove("active"); }}
                        onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("active"); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { handleQuestionFileSelect(e.dataTransfer.files[0]); } }}
                        onClick={() => questionFileInputRef.current?.click()}
                      >
                        <input 
                          type="file" 
                          ref={questionFileInputRef}
                          className="hidden" 
                          accept=".txt,.pdf,.png,.jpg,.jpeg"
                          onChange={handleQuestionFileInputChange}
                        />
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          Drag & drop or click to upload a question
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports TXT, PDF, PNG, JPG files (max 10MB)
                        </p>
                      </div>
                      {questionFile && (
                        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <FileType size={16} className="text-primary" />
                            <span className="text-sm truncate max-w-[200px]">{questionFile.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={removeQuestionFile}>
                            <X size={16} />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <CardTitle>Answer Sheet</CardTitle>
                      <CardDescription>
                        Enter the answer sheet or upload a file
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea 
                        placeholder="Type or paste the answer sheet here..."
                        className="min-h-[150px]"
                        value={answerSheet}
                        onChange={(e) => setAnswerSheet(e.target.value)}
                      />
                      <div 
                        className="file-upload-area"
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("active"); }}
                        onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove("active"); }}
                        onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("active"); if (e.dataTransfer.files && e.dataTransfer.files.length > 0) { handleAnswerSheetFileSelect(e.dataTransfer.files[0]); } }}
                        onClick={() => answerSheetFileInputRef.current?.click()}
                      >
                        <input 
                          type="file" 
                          ref={answerSheetFileInputRef}
                          className="hidden" 
                          accept=".txt,.pdf,.png,.jpg,.jpeg"
                          onChange={handleAnswerSheetFileInputChange}
                        />
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          Drag & drop or click to upload an answer sheet
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports TXT, PDF, PNG, JPG files (max 10MB)
                        </p>
                      </div>
                      {answerSheetFile && (
                        <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center gap-2">
                            <FileType size={16} className="text-primary" />
                            <span className="text-sm truncate max-w-[200px]">{answerSheetFile.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={removeAnswerSheetFile}>
                            <X size={16} />
                          </Button>
                        </div>
                      )}
                      <Button 
                        className="w-full"
                        onClick={handleAnalyze}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="h-4 w-4 mr-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>Analyze Answer Sheet</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnswerSheetAnalyzer;
