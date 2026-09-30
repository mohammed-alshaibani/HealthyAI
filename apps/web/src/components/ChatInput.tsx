'use client';

import { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, X } from 'lucide-react';

type Props = {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder: string;
};

export function ChatInput({ onSend, isLoading, placeholder }: Props) {
  const [text, setText] = useState('');
  const [fileContent, setFileContent] = useState<{name: string, content: string} | null>(null);
  const [fileError, setFileError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150,
      )}px`;
    }
  }, [text]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only text-based files for safety and simplicity
    if (file.size > 100 * 1024) {
      setFileError('File too large (max 100KB)');
      return;
    }
    
    const validTypes = ['text/plain', 'text/markdown', 'text/csv', 'application/json'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|md|csv|json)$/i)) {
      setFileError('Only text files (.txt, .md, .csv) are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setFileContent({ name: file.name, content: evt.target?.result as string });
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if ((text.trim() || fileContent) && !isLoading) {
      let finalMessage = text.trim();
      if (fileContent) {
        finalMessage = `[User uploaded file: ${fileContent.name}]\n<file_content>\n${fileContent.content}\n</file_content>\n\n${finalMessage}`;
      }
      onSend(finalMessage);
      setText('');
      setFileContent(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {fileError && <div className="text-xs text-red-500 px-2 font-medium">{fileError}</div>}
      
      {fileContent && (
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-800 px-3 py-2 rounded-xl text-sm font-medium self-start">
          <Paperclip className="w-4 h-4" />
          <span className="truncate max-w-[200px]">{fileContent.name}</span>
          <button onClick={() => setFileContent(null)} className="p-1 hover:bg-teal-200 rounded-full transition-colors ml-2">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:border-teal-500 transition-all">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".txt,.md,.csv,text/plain,text/markdown,text/csv"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-3 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors disabled:opacity-50"
          title="Upload text file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder}
          className="flex-1 max-h-[150px] resize-none bg-transparent px-2 py-3 text-sm sm:text-base text-slate-900 dark:text-slate-100 outline-none disabled:opacity-50"
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={(!text.trim() && !fileContent) || isLoading}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[44px] w-[44px] flex items-center justify-center mb-0.5 mr-0.5 rtl:mr-0 rtl:ml-0.5 shadow-md"
          aria-label="Send message"
        >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <SendHorizontal className="w-5 h-5 rtl:-scale-x-100" />
        )}
        </button>
      </div>
    </div>
  );
}
