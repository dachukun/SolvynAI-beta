
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download, Wand2, FileText } from "lucide-react";
import { deepseekAI } from '@/lib/deepseek';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const noteTakingMethods = [
  { value: 'cornell', label: 'Cornell Method' },
  { value: 'outline', label: 'Outline Method' },
  { value: 'mapping', label: 'Mapping Method' },
  { value: 'charting', label: 'Charting Method' },
  { value: 'sentence', label: 'Sentence Method' },
  { value: 'sketchnoting', label: 'Sketchnoting (Visual)' },
];

const Notes = () => {
  const [noteContent, setNoteContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { toast } = useToast();
  const outputRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setNoteContent('');
    }
  };

  const handleEnhance = async () => {
    setIsLoading(true);
    setLoadingMessage("Reading your input...");
    setOutput(null);
    let inputText = noteContent;
    if (selectedFile) {
      try {
        inputText = await selectedFile.text();
      } catch (error) {
        console.error("Error reading file:", error);
        toast({
          title: "Error Reading File",
          description: "Could not read the selected file. Please try again or paste the text.",
          variant: "destructive",
        });
        setIsLoading(false);
        setLoadingMessage("");
        return;
      }
    }
    if (!inputText) {
      toast({
        title: "No Input",
        description: "Please provide notes either by typing or uploading a file.",
        variant: "destructive",
      });
      setIsLoading(false);
      setLoadingMessage("");
      return;
    }
    const selectedMethodLabel = noteTakingMethods.find(m => m.value === selectedMethod)?.label || selectedMethod;
    const prompt = `Please take the following notes and enhance them using the ${selectedMethodLabel} method. Output ONLY plain text, no Markdown, no LaTeX, no code blocks, no formatting, just readable plain text.` +
      `\n\nNotes:\n---\n${inputText}\n---\n`;
    try {
      setLoadingMessage("Thinking about it...");
      const result = await deepseekAI(prompt);
      setLoadingMessage("Finalizing output...");
      setTimeout(() => {
        setOutput(result);
        setIsLoading(false);
        setLoadingMessage("");
        toast({
          title: "Enhancement Complete",
          description: `Notes enhanced using the ${selectedMethodLabel} method. You can now download the plain text.`,
        });
      }, 400);
    } catch (error) {
      console.error("Error calling DeepSeek API:", error);
      setOutput("Error generating enhanced notes. Please check the console for details.");
      setIsLoading(false);
      setLoadingMessage("");
      toast({
        title: "AI Error",
        description: "Failed to enhance notes. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadTxt = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `enhanced_notes_${selectedMethod || 'output'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canEnhance = (noteContent || selectedFile) && selectedMethod;

  return (
    <div className="solvynai-page">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Notes</h1>
          <p className="text-muted-foreground mt-1">
            Enhance your notes using various methods and export as plain text.
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
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>
              {isLoading ? "Enhancing..." : output ? "Enhanced Notes (Plain Text)" : "Input Your Notes"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <div className="loader mb-4"></div>
                <p className="text-muted-foreground">{loadingMessage}</p>
              </div>
            ) : output ? (
              <>
                <div ref={outputRef} className="whitespace-pre-wrap min-h-[200px] p-2 bg-muted rounded">
                  {output}
                </div>
                <Button
                  className="mt-4"
                  onClick={handleDownloadTxt}
                  disabled={!output}
                >
                  <Download className="mr-2 h-4 w-4" /> Download as .txt
                </Button>
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() => {
                    setOutput(null);
                    setNoteContent("");
                    setSelectedFile(null);
                    setSelectedMethod("");
                  }}
                >
                  Enhance Another
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="note-input">Type or Paste Notes</Label>
                  <Textarea
                    id="note-input"
                    placeholder="Enter your notes here..."
                    value={noteContent}
                    onChange={(e) => {
                      setNoteContent(e.target.value);
                      setSelectedFile(null);
                    }}
                    disabled={!!selectedFile}
                  />
                </div>
                <div>
                  <Label htmlFor="file-upload">Or Upload a Text File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    disabled={!!noteContent}
                  />
                  {selectedFile && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Selected file: {selectedFile.name}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="method-select">Select Note-Taking Method</Label>
                  <Select
                    value={selectedMethod}
                    onValueChange={setSelectedMethod}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="method-select">
                      <SelectValue placeholder="Choose a method" />
                    </SelectTrigger>
                    <SelectContent>
                      {noteTakingMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  onClick={handleEnhance}
                  disabled={!(noteContent || selectedFile) || !selectedMethod || isLoading}
                >
                  <Wand2 className="mr-2 h-4 w-4" /> Enhance Notes
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notes;
