import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const AiDocumentCreatorPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateDocument = async () => {
    if (!prompt.trim()) {
      // Maybe show a toast notification here
      alert('Please enter a prompt for your document.');
      return;
    }
    setIsLoading(true);
    setGeneratedDocument('');

    // Simulate API call to DeepSeek AI
    try {
      // Replace with actual API call
      // const response = await fetch('/api/deepseek/generate-document', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to generate document');
      // }
      // const data = await response.json();
      // setGeneratedDocument(data.document);

      // Simulated delay and response
      await new Promise(resolve => setTimeout(resolve, 3000));
      const exampleDocument = `This is a document generated based on the prompt: "${prompt}".\n\nIt includes several paragraphs and demonstrates the kind of content your DeepSeek AI might produce.\n\nFurther sections could elaborate on specific points, include lists, or even tables, depending on the AI's capabilities and the nature of the prompt.`;
      setGeneratedDocument(exampleDocument);

    } catch (error) {
      console.error('Error generating document:', error);
      // Show error to user, e.g., via toast
      alert('Sorry, an error occurred while generating the document.');
      setGeneratedDocument('Failed to load document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedDocument) return;
    navigator.clipboard.writeText(generatedDocument)
      .then(() => {
        // Show success (e.g., toast)
        alert('Document copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy document: ', err);
        alert('Failed to copy document.');
      });
  };

  const handleDownloadAsTxt = () => {
    if (!generatedDocument) return;
    const blob = new Blob([generatedDocument], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ai-generated-document.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Document Creator</h1>
        <p className="text-muted-foreground mt-2">
          Generate various types of documents by providing a prompt to our AI.
        </p>
      </header>

      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg shadow">
          <label htmlFor="document-prompt" className="block text-sm font-medium text-foreground mb-2">
            What kind of document do you want to create?
          </label>
          <Textarea
            id="document-prompt"
            placeholder="e.g., 'A formal complaint letter about a faulty product', 'A short story about a space explorer', 'A marketing plan for a new coffee shop'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-sm"
            rows={4}
          />
          <Button onClick={handleGenerateDocument} disabled={isLoading} className="mt-4 w-full sm:w-auto">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              'Generate Document'
            )}
          </Button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center bg-card p-6 rounded-lg shadow min-h-[200px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-lg font-medium">AI is crafting your document...</p>
            <p className="text-sm text-muted-foreground mt-1">This might take a moment.</p>
            {/* You can add more creative loading animations/text here */}
          </div>
        )}

        {generatedDocument && !isLoading && (
          <div className="bg-card p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-foreground mb-3">Generated Document</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-4 rounded-md min-h-[200px] whitespace-pre-wrap">
              {generatedDocument}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button onClick={handleCopyToClipboard} variant="outline" className="w-full sm:w-auto">
                Copy to Clipboard
              </Button>
              <Button onClick={handleDownloadAsTxt} variant="outline" className="w-full sm:w-auto">
                Download as .txt
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              You can copy the text and paste it into Google Docs or any other editor, or download it as a text file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiDocumentCreatorPage;