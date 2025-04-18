
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Heading1, Heading2, Link, Image, Code, 
  AlignLeft, AlignCenter, AlignRight, Underline,
  Strikethrough, FileText, FileCode, Table, Unlink
} from 'lucide-react';

interface WYSIWYGEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const WYSIWYGEditor: React.FC<WYSIWYGEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize the editor
  useEffect(() => {
    if (editorRef.current) {
      // Focus the editor when it mounts
      editorRef.current.focus();
    }
  }, []);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // After formatting, update the content
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    const selection = window.getSelection();
    
    // Check if there is a selection
    if (selection && selection.toString().length > 0) {
      const url = window.prompt('Enter link URL');
      if (url) {
        handleFormat('createLink', url);
      }
    } else {
      alert('Please select some text first');
    }
  };

  const handleRemoveLink = () => {
    handleFormat('unlink');
  };

  const handleInsertImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      handleFormat('insertImage', url);
    }
  };

  const handleInsertTable = () => {
    const rows = window.prompt('Enter number of rows', '2');
    const cols = window.prompt('Enter number of columns', '2');
    
    if (rows && cols) {
      const numRows = parseInt(rows);
      const numCols = parseInt(cols);
      
      if (!isNaN(numRows) && !isNaN(numCols)) {
        let tableHTML = '<table style="width:100%; border-collapse: collapse;">';
        
        // Create header row
        tableHTML += '<tr>';
        for (let i = 0; i < numCols; i++) {
          tableHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Header ' + (i+1) + '</th>';
        }
        tableHTML += '</tr>';
        
        // Create data rows
        for (let i = 0; i < numRows-1; i++) {
          tableHTML += '<tr>';
          for (let j = 0; j < numCols; j++) {
            tableHTML += '<td style="border: 1px solid #ddd; padding: 8px;">Row ' + (i+1) + ', Col ' + (j+1) + '</td>';
          }
          tableHTML += '</tr>';
        }
        
        tableHTML += '</table>';
        
        document.execCommand('insertHTML', false, tableHTML);
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }
    }
  };

  const handleInsertCodeBlock = () => {
    const code = window.prompt('Enter code:');
    if (code) {
      const codeHTML = '<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>' + 
                      code.replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;')
                          .replace(/'/g, '&#039;') + 
                      '</code></pre>';
      document.execCommand('insertHTML', false, codeHTML);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('underline')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('strikeThrough')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="h-6 border-l mx-1"></div>
        
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
        
        <div className="h-6 border-l mx-1"></div>
        
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
          onClick={() => handleFormat('formatBlock', '<blockquote>')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('formatBlock', '<p>')}
          title="Paragraph"
        >
          <FileText className="h-4 w-4" />
        </Button>
        
        <div className="h-6 border-l mx-1"></div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleInsertLink}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemoveLink}
          title="Remove Link"
        >
          <Unlink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleInsertImage}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleInsertTable}
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleInsertCodeBlock}
          title="Insert Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="h-6 border-l mx-1"></div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('justifyLeft')}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('justifyCenter')}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleFormat('justifyRight')}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none overflow-auto"
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
        onBlur={() => {
          // When the editor loses focus, ensure content is updated
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
      />
    </div>
  );
};

export default WYSIWYGEditor;
