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
    setTimeout(() => titleRef.current?.focus(), 150);
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

  const dateLabel = new Date(note.updatedAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950" onKeyDown={handleKeyDown}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-200/70 bg-gray-50/90 px-3 py-2 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 sm:px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200/70 sm:px-3 dark:text-gray-400 dark:hover:bg-gray-800"
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
          <span className="hidden sm:inline">Notes</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
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
              <span className="hidden sm:inline">Saved</span>
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-500 active:scale-[0.97] sm:px-4"
          >
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
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-10 sm:px-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-[28px] font-bold leading-tight tracking-tight text-gray-900 placeholder-gray-300 outline-none dark:text-gray-100 dark:placeholder-gray-700"
          />
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-600">
            {dateLabel}
          </p>
          <div className="mt-8">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="min-h-[60vh] w-full resize-none text-base leading-relaxed text-gray-800 placeholder-gray-300 outline-none dark:text-gray-200 dark:placeholder-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}