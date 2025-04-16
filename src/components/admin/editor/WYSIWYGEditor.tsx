
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading1, Heading2, Link, Image, Save 
} from 'lucide-react';

interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ content, onChange }) => {
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="border rounded-lg">
      <div className="border-b p-2 flex gap-2 flex-wrap bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('formatBlock', '<h1>')}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('formatBlock', '<h2>')}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const url = window.prompt('Enter link URL');
            if (url) handleFormat('createLink', url);
          }}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) handleFormat('insertImage', url);
          }}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('formatBlock', '<blockquote>')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      <div
        className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default WYSIWYGEditor;
