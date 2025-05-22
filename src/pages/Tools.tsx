
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlignLeft, BookOpen, FileText, HelpCircle, FileSearch, MessageCircle, FilePen } from 'lucide-react';
import { Link } from "react-router-dom";

const Tools = () => {
  return (
    <div className="solvynai-page">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">AI Tools</h1>
          <p className="text-muted-foreground mt-1">
            Enhance your learning with these AI-powered assistants.
          </p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="feature-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <AlignLeft className="text-primary" size={24} />
              </div>
              <CardTitle>Summarizer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Quickly generate concise summaries from long texts, articles, or study materials.
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/tools/summarizer">Open Summarizer</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="feature-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="text-primary" size={24} />
              </div>
              <CardTitle>Practice Paper Generator</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Create custom practice tests and quizzes based on your study materials.
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/tools/generate-question-paper">Generate Practice Paper</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="feature-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileSearch className="text-primary" size={24} />
              </div>
              <CardTitle>Answer Sheet Analyzer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Get detailed feedback and improvement suggestions on your assignments.
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/tools/answer-sheet-analyzer">Analyze Answer Sheet</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="feature-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <HelpCircle className="text-primary" size={24} />
              </div>
              <CardTitle>Doubt Solver</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Get instant help with challenging concepts and homework problems.
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/tools/doubt-solver">Solve a Doubt</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="feature-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MessageCircle className="text-primary" size={24} />
              </div>
              
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Speak with virtual counselor for mental health and wellness support.
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/tools/student-wellness-ai">Speak with Counselor</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Added Notes Card */}
        <Card className="feature-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FilePen className="text-primary" size={24} />
              </div>
              <CardTitle>Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Create and manage your personal study notes.
            </CardDescription>
            <Button className="w-full" asChild>
              <Link to="/tools/notes">Open Notes</Link>
            </Button>
          </CardContent>
        </Card>
```
      </div>
    </div>
  );
};

export default Tools;
