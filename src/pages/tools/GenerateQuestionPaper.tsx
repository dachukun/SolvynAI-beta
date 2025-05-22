
import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { deepseekAI } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GenerateQuestionPaper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [grade, setGrade] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(60);
  const [questionTypes, setQuestionTypes] = useState({
    mcq: true,
    shortAnswer: true,
    essay: false,
    trueOrFalse: false,
    matching: false,
  });
  const [totalMarks, setTotalMarks] = useState(100);
  const [result, setResult] = useState("");
  const [includeAnswers, setIncludeAnswers] = useState(true);
  const { toast } = useToast();
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingMessage("Preparing your request...");
    // Create a prompt for the AI
    const selectedTypes = Object.entries(questionTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type)
      .join(", ");
    const prompt = `Generate a ${difficulty} difficulty ${subject} question paper for grade ${grade} \n      on the topics: ${topics}. Include ${selectedTypes} questions. \n      The paper should be designed for ${duration} minutes with a total of ${totalMarks} marks.\n      ${includeAnswers ? "Include answer key." : "Do not include answers."}`;
    try {
      setLoadingMessage("Thinking about the best questions...");
      const generatedPaper = await deepseekAI(prompt);
      setLoadingMessage("Formatting your paper...");
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadingMessage("Final touches...");
      await new Promise(resolve => setTimeout(resolve, 500));
      setResult(generatedPaper);
      toast({
        title: "Success!",
        description: "Your question paper has been generated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating question paper:", error);
      toast({
        title: "Error",
        description: "Failed to generate question paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="solvynai-page">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Question Paper Generator</h1>
          <p className="text-muted-foreground mt-1">
            Create custom question papers for tests, exams, and practice sessions.
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
                <p className="text-muted-foreground">{loadingMessage}</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-wrap overflow-y-auto">
                  {result}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    if (result) {
                      navigator.clipboard.writeText(result);
                      toast({
                        title: "Copied!",
                        description: "Paper copied to clipboard",
                      });
                    }
                  }}
                  disabled={!result}
                >
                  Copy Paper
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => setResult("")}
                >
                  Generate Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics, English"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topics">Topics to Include</Label>
                  <Textarea
                    id="topics"
                    placeholder="e.g., Algebra, Trigonometry, Calculus"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Class Level</Label>
                    <Input
                      id="grade"
                      placeholder="e.g., 10, 12, College 1st year"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      id="duration"
                      min={15}
                      max={180}
                      step={5}
                      value={[duration]}
                      onValueChange={(values) => setDuration(values[0])}
                    />
                    <span className="w-12 text-center">{duration}</span>
                  </div>
                </div>
                <Collapsible className="space-y-2 border rounded-lg p-3 bg-muted/10">
                  <CollapsibleTrigger className="flex justify-between items-center w-full">
                    <Label>Question Types</Label>
                    <span className="text-xs text-muted-foreground">Click to expand</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mcq"
                        checked={questionTypes.mcq}
                        onCheckedChange={(checked) => 
                          setQuestionTypes({ ...questionTypes, mcq: Boolean(checked) })
                        }
                      />
                      <label htmlFor="mcq" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Multiple Choice Questions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shortAnswer"
                        checked={questionTypes.shortAnswer}
                        onCheckedChange={(checked) => 
                          setQuestionTypes({ ...questionTypes, shortAnswer: Boolean(checked) })
                        }
                      />
                      <label htmlFor="shortAnswer" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Short Answer Questions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="essay"
                        checked={questionTypes.essay}
                        onCheckedChange={(checked) => 
                          setQuestionTypes({ ...questionTypes, essay: Boolean(checked) })
                        }
                      />
                      <label htmlFor="essay" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Essay Questions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trueOrFalse"
                        checked={questionTypes.trueOrFalse}
                        onCheckedChange={(checked) => 
                          setQuestionTypes({ ...questionTypes, trueOrFalse: Boolean(checked) })
                        }
                      />
                      <label htmlFor="trueOrFalse" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">True or False Questions</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="matching"
                        checked={questionTypes.matching}
                        onCheckedChange={(checked) => 
                          setQuestionTypes({ ...questionTypes, matching: Boolean(checked) })
                        }
                      />
                      <label htmlFor="matching" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Matching Questions</label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input 
                    id="totalMarks" 
                    type="number" 
                    value={totalMarks}
                    min={10}
                    max={500}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeAnswers"
                    checked={includeAnswers}
                    onCheckedChange={(checked) => setIncludeAnswers(Boolean(checked))}
                  />
                  <label htmlFor="includeAnswers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Include Answer Key</label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
                      Generating...
                    </>
                  ) : (
                    <>Generate Question Paper</>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateQuestionPaper;
