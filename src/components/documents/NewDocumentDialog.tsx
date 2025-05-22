
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  template: string | null;
}

interface NewDocumentDialogProps {
  open: boolean;
  templates: Template[];
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

const NewDocumentDialog: React.FC<NewDocumentDialogProps> = ({
  open,
  templates,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => onSelect(template.id)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-primary/10 p-3 rounded-lg mb-4">
                  <FileText className="text-primary" size={24} />
                </div>
                <h3 className="font-medium text-base mb-1">{template.name}</h3>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentDialog;
