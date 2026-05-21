"use client";

import { useState, useEffect, useRef } from "react";
import { Note } from "@/lib/types";

interface NoteEditorProps {
  note: Note;
  onSave: (id: string, title: string, content: string) => void;
  onBack: () => void;
}

export default function NoteEditor({ note, onSave, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saved, setSaved] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTimeout(() => titleRef.current?.focus(), 100);
  }, [note.id]);

  function handleSave() {
    onSave(note.id, title, content);
    setSaved(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onBack();
    }
  }

  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex h-full flex-col" onKeyDown={handleKeyDown}>
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-zinc-200/70 bg-white/80 px-5 py-3 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="animate-fade-in flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-md active:scale-[0.97]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-3xl font-bold tracking-tight text-zinc-800 placeholder-zinc-300 outline-none transition-colors focus:text-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-700 dark:focus:text-zinc-50"
          />
          <hr className="my-6 border-zinc-100 dark:border-zinc-800/60" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts..."
            className="min-h-[400px] w-full resize-none text-base leading-relaxed text-zinc-700 placeholder-zinc-300 outline-none transition-colors focus:text-zinc-800 dark:text-zinc-300 dark:placeholder-zinc-600 dark:focus:text-zinc-200"
          />
        </div>
      </div>
    </div>
  );
}