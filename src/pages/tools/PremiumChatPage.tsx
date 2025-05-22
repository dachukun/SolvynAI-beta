import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { deepseekAI } from '@/lib/deepseek';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const PremiumChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('ChatGPT-4.5');
  const models = ['ChatGPT-4.5', 'Gemini 2.5 pro', 'claude 3.7 sonnet', 'gemini 2.5 flash', 'DeepSeek'];
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate using the selected model name in the response, but still use deepseekAI for the actual call
      const botResponseText = await deepseekAI(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `(${selectedModel}) ${botResponseText}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem))] bg-background">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Premium Chat</h1>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map(model => (
              <SelectItem key={model} value={model}>{model}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>
      <ScrollArea className="flex-1 p-4 space-y-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-start gap-3',
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.sender === 'bot' && (
              <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                <Bot size={18} />
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-[70%] p-3 rounded-lg shadow-sm',
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-muted rounded-bl-none'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.sender === 'user' && user && (
              <Avatar className="h-8 w-8 bg-secondary text-secondary-foreground flex items-center justify-center">
                <User size={18} />
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
              <Bot size={18} />
            </Avatar>
            <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-muted rounded-bl-none">
              <p className="text-sm italic">Typing...</p>
            </div>
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Enter a prompt here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''} size="icon">
            <Send size={18} />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          The AI may display inaccurate info, including about people, so double-check its responses.
        </p>
      </div>
    </div>
  );
};

export default PremiumChatPage;