import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Link, AlignLeft, AlignCenter, AlignRight, Eye, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const editorRef = useRef<HTMLDivElement>(null);

  // Custom styling commands on the editable block
  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const handleAddLink = () => {
    const url = prompt('Enter the link URL (e.g. https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#f97316]/50">
      
      {/* Editor toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors"
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors"
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors"
            title="Underline"
          >
            <Underline size={14} />
          </button>
          
          <span className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors"
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>

          <span className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors font-bold text-xs"
            title="Header"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<p>')}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors text-xs"
            title="Normal Paragraph"
          >
            P
          </button>

          <span className="w-px h-5 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={handleAddLink}
            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors"
            title="Add Link"
          >
            <Link size={14} />
          </button>
        </div>

        {/* Edit / Preview Switches */}
        <div className="flex border border-gray-250 p-0.5 bg-white rounded-md">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-2 py-1 text-[10px] font-bold uppercase rounded-sm flex items-center gap-1 transition-all ${
              mode === 'edit' ? 'bg-[#f97316] text-white shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            <Code size={11} /> Editor
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-2 py-1 text-[10px] font-bold uppercase rounded-sm flex items-center gap-1 transition-all ${
              mode === 'preview' ? 'bg-[#f97316] text-white shadow-xs' : 'text-gray-500 hover:text-black'
            }`}
          >
            <Eye size={11} /> Preview
          </button>
        </div>
      </div>

      {/* Editor Content Box */}
      {mode === 'edit' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          className="min-h-[160px] p-4 text-xs font-medium text-gray-800 focus:outline-none bg-white font-sans prose prose-sm max-w-none"
          style={{ outline: 'none' }}
        />
      ) : (
        <div
          className="min-h-[160px] p-4 text-xs font-medium text-gray-800 bg-gray-50 prose prose-sm max-w-none border-t border-gray-150"
          dangerouslySetInnerHTML={{ __html: value || '<p className="text-gray-400">Nothing to preview...</p>' }}
        />
      )}
    </div>
  );
}
