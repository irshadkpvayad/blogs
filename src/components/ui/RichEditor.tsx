import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from './Button';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon } from 'lucide-react';

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const RichEditor = ({ content, onChange }: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none dark:prose-invert min-h-[300px] p-4 border border-gray-200 dark:border-gray-800 rounded-b-md',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
         const { uploadImage } = await import('../../lib/storage');
         const url = await uploadImage(file, 'editor');
         editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
         console.error('Upload failed', err);
         const url = window.prompt('Upload failed. Fallback: Enter image URL');
         if (url) editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 border border-b-0 border-gray-200 dark:border-gray-800 rounded-t-md p-2 bg-gray-50 dark:bg-gray-900">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-800' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-800' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-800' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-800' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};
