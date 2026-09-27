"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";

type LessonEditorProps = {
  content?: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
};

export default function LessonEditor({
  content,
  onChange,
}: LessonEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          "Start writing your lesson...",
      }),
    ],

    content: content ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },

    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[420px] rounded-2xl border border-slate-200 bg-white" />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
        <ToolbarButton
          label="Bold"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          active={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Italic"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          active={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Heading 1"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          }
          active={editor.isActive("heading", {
            level: 1,
          })}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Heading 2"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          active={editor.isActive("heading", {
            level: 2,
          })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Bullet List"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          active={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Ordered List"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Quote"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          active={editor.isActive("blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Inline Code"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          active={editor.isActive("code")}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Code Block"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
          active={editor.isActive("codeBlock")}
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          label="Undo"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          label="Redo"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="lesson-editor"
      />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${active
          ? "bg-slate-200 text-slate-900"
          : "text-slate-500 hover:bg-slate-200 hover:text-slate-900"
        }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div className="mx-1 h-6 w-px bg-slate-200" />
  );
}