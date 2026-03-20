"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type TipTapEditorInnerProps = {
  value?: string;
  onChange: (value: string) => void;
};

export default function TipTapEditorInner({ value, onChange }: TipTapEditorInnerProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!(value && value.replace(/<[^>]+>/g, "").trim()));

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] px-5 py-4 text-[15px] leading-8 text-[#E5E2E1] caret-[#F2CA50] focus:outline-none",
      },
    },
    onCreate: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
    },
    onUpdate: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
      onChange(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
    onBlur: ({ editor }) => {
      setIsFocused(false);
      setIsEmpty(editor.isEmpty);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const nextValue = value || "";
    const currentValue = editor.getHTML();
    const editorLooksEmpty = editor.isEmpty || editor.getText().trim() === "";

    if (!nextValue && editorLooksEmpty) {
      setIsEmpty(true);
      return;
    }

    if (nextValue !== currentValue) {
      editor.commands.setContent(nextValue || "<p></p>", { emitUpdate: false });
      setIsEmpty(!nextValue || editor.isEmpty);
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="obsidian-surface min-h-[280px] rounded-[26px] p-4" />;
  }

  return (
    <div className="obsidian-panel space-y-4 rounded-[28px] p-4 text-[#E5E2E1]">
      <div className="obsidian-surface flex flex-wrap gap-2 rounded-[22px] p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${editor.isActive("bold") ? "obsidian-toolbar-button-active" : ""}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${editor.isActive("italic") ? "obsidian-toolbar-button-active" : ""}`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${editor.isActive("strike") ? "obsidian-toolbar-button-active" : ""}`}
        >
          Strike
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${editor.isActive("bulletList") ? "obsidian-toolbar-button-active" : ""}`}
        >
          Bullet
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${editor.isActive("orderedList") ? "obsidian-toolbar-button-active" : ""}`}
        >
          Numbered
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em] ${editor.isActive("heading", { level: 2 }) ? "obsidian-toolbar-button-active" : ""}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em]"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="obsidian-toolbar-button rounded-full px-3 py-2 text-xs uppercase tracking-[0.18em]"
        >
          Redo
        </button>
      </div>
      <div
        className={`obsidian-surface relative min-h-[240px] rounded-[24px] transition ${isFocused ? "ring-1 ring-[#F2CA50]/40" : ""}`}
        onClick={() => editor.chain().focus().run()}
      >
        {isEmpty ? (
          <div className="pointer-events-none absolute left-5 top-4 text-[15px] text-white/34">
            Write event description...
          </div>
        ) : null}
        <EditorContent editor={editor} className="min-h-[240px]" />
      </div>
    </div>
  );
}
