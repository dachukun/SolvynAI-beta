
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BookOpen, Focus, Sparkles, FileText, Table, MessageCircle, School, Settings, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  to: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="feature-card h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Icon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-between">
        <CardDescription className="mb-4 text-sm text-muted-foreground">{description}</CardDescription>
        <Button onClick={() => navigate(to)} variant="default" size="sm" className="w-full mt-auto">
          Open
        </Button>
      </CardContent>
    </Card>
  );
};

const QuickAccessButton = ({ title, icon: Icon, to }: { title: string; icon: React.ElementType; to: string }) => {
  const navigate = useNavigate();
  return (
    <Button 
      variant="outline" 
      className="flex flex-col h-20 w-full gap-2 p-3" 
      onClick={() => navigate(to)}
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xs font-medium">{title}</span>
    </Button>
  );
};

const AiChatCard = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{text: string, isUser: boolean}[]>([
    {text: "Hello! How can I help with your studies today?", isUser: false}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, {text: message, isUser: true}]);
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        {text: "I'm your AI study assistant. I can help answer questions or explain concepts. What would you like to know?", isUser: false}
      ]);
      setIsLoading(false);
    }, 1000);
    
    setMessage("");
  };

  return (
    <Card className="shadow-md flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <MessageCircle className="text-primary" size={18} />
            </div>
            
          </div>
          <Badge variant="outline" className="text-xs">AI</Badge>
        </div>
        <CardDescription>Ask anything</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-grow">
        <div className="space-y-3 flex-grow overflow-y-auto pr-1">
          {chatMessages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-2 rounded-md text-sm ${
                  msg.isUser 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-muted rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full gap-2 items-center">
          <Input 
            placeholder="Ask a question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
            {isLoading ? "..." : "Ask"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.email?.split('@')[0] || 'Student';
  
  return (
    <div className="solvynai-page">
      <header className="mb-6 md:mb-10 flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <div className="bg-primary/10 p-2 rounded-lg mr-2">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {firstName}!</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Continue your learning journey with these powerful tools
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

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-fr"> {/* Added md:auto-rows-fr for equal height rows on md+ screens */}
        {/* Row 1: QuickAccessCard (full width) */}
        <div className="md:col-span-3 h-full"> {/* Contains QuickAccessCard, Added h-full */}
          {/* Quick Access with Focus Integration - MOVED HERE */}
          <Card className="shadow-sm h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="grid grid-cols-2 gap-3">
                <QuickAccessButton title="AI Tools" icon={Star} to="/tools" />
                <QuickAccessButton title="Focus Mode" icon={Focus} to="/focus" />
                <QuickAccessButton title="Notes" icon={BookOpen} to="/notes" />
                <QuickAccessButton title="Profile" icon={School} to="/profile" />
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-muted-foreground">
                    Focus Total: <span className="font-semibold text-primary">3h 45m</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sessions: <span className="font-semibold text-primary">12</span>
                  </div>
                </div>
                <Button onClick={() => navigate("/focus")} variant="default" size="sm" className="w-full">
                  Start Focus Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: PopularAIToolsCard (full width) */}
        <div className="md:col-span-3 mt-6"> {/* Added mt-6 for spacing */}
          {/* AI Tools Featured - MOVED HERE */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Popular AI Learning Tools</CardTitle>
              <CardDescription>
                Enhance your studies with our powerful AI tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FeatureCard 
                  title="Summarizer" 
                  description="Generate concise summaries from lengthy study materials."
                  icon={FileText} 
                  to="/tools/summarizer"
                />
                <FeatureCard 
                  title="Question Generator" 
                  description="Create custom practice tests and quizzes."
                  icon={Table} 
                  to="/tools/generate-question-paper"
                />
                <FeatureCard 
                  title="Student Wellness" 
                  description="Chat with an AI counselor for support and guidance."
                  icon={MessageCircle}
                  to="/tools/student-wellness-ai"
                />
                <FeatureCard 
                  title="Answer Analysis" 
                  description="Get feedback on your assignments and test answers."
                  icon={BookOpen}
                  to="/tools/answer-sheet-analyzer"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/tools")} variant="outline" className="w-full">
                View All AI Tools
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
