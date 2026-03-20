"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./TipTapEditorInner"), {
  ssr: false,
});

export default function RichTextEditor({ value, onChange }: any) {
  return <Editor value={value} onChange={onChange} />;
}
