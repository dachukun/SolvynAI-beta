import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Send, Bot, User, Loader2, BrainCircuit } from 'lucide-react';

const OPENROUTER_API_KEY = "<YOUR_OPENROUTER_API_KEY>"; // Replace with your actual key or manage securely
const YOUR_SITE_URL = "https://your-site-url.com"; // Replace with your site URL
const YOUR_SITE_NAME = "Solvyn AI"; // Replace with your site name

interface Message {
  role: "user" | "assistant";
  content: string;
}

const models = [
  { name: "TNGTech DeepSeek R1T Chimera (Free)", id: "tngtech/deepseek-r1t-chimera:free", apiKey: "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" },
  { name: "Microsoft MAI DS R1 (Free)", id: "microsoft/mai-ds-r1:free", apiKey: "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" },
  { name: "Meta Llama 4 Maverick (Free)", id: "meta-llama/llama-4-maverick:free", apiKey: "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" },
  { name: "Qwen Qwen3 14B (Free)", id: "qwen/qwen3-14b:free", apiKey: "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" },
  { name: "Google Gemini 2.0 Flash Exp (Free)", id: "google/gemini-2.0-flash-exp:free", apiKey: "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" },
  { name: "Qwen QWQ 32B (Free)", id: "qwen/qwq-32b:free", apiKey: "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" },
  { name: "Qwen Qwen2.5 VL 3B Instruct (Free)", id: "qwen/qwen2.5-vl-3b-instruct:free", apiKey: "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" },
];

const PremiumChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!selectedModel) {
      toast({
        title: "No Model Selected",
        description: "Please select an AI model to chat with.",
        variant: "destructive",
      });
      return;
    }

    const currentModel = models.find(m => m.id === selectedModel);
    if (!currentModel) {
        toast({
            title: "Error",
            description: "Selected model not found.",
            variant: "destructive",
        });
        return;
    }

    const newMessage: Message = { role: "user", content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentModel.apiKey}`,
          "HTTP-Referer": YOUR_SITE_URL,
          "X-Title": YOUR_SITE_NAME,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": selectedModel,
          "messages": [...messages, newMessage].map(msg => ({ role: msg.role, content: msg.content })) // Send full history
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0]?.message?.content || "Sorry, I couldn't get a response."
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Optionally add the user's message back to input if API call fails
      // setInputMessage(newMessage.content);
      // setMessages(prev => prev.slice(0, -1)); // Remove the user message that failed to send
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="solvynai-page flex flex-col h-[calc(100vh-4rem)]">
      <header className="mb-6 flex justify-between items-start shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              <BrainCircuit className="text-primary" size={24} />
            </div>
            <h1 className="text-3xl font-bold">Premium LLM Chat</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Chat with various advanced AI models.
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

      <Card className="flex-grow flex flex-col overflow-hidden">
        <CardHeader className="shrink-0">
          <CardTitle>Select AI Model</CardTitle>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-grow p-4 space-y-4" ref={scrollAreaRef}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageSquare size={48} className="mb-2" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[75%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="h-8 w-8 shrink-0">
                     <AvatarImage src="" alt={user?.email || "U"} />
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback><Bot size={18} /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] p-3 rounded-lg bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <p className="text-sm">Thinking...</p>
                    </div>
                </div>
            )}
          </ScrollArea>
          <div className="border-t p-4 shrink-0">
            <div className="flex items-center gap-2">
              <Textarea
                placeholder={`Message ${models.find(m => m.id === selectedModel)?.name || 'selected model'}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-grow resize-none"
                rows={1}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim() || !selectedModel} className="shrink-0">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumChatPage;