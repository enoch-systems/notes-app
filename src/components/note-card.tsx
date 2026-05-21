"use client";

import { Note } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onSelect, onDelete }: NoteCardProps) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const preview =
    note.content.length > 120
      ? note.content.slice(0, 120) + "..."
      : note.content;

  return (
    <div
      onClick={() => onSelect(note.id)}
      className="group cursor-pointer rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex-1 truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {note.title || "Untitled"}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="shrink-0 rounded p-1 text-zinc-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/30"
          title="Delete note"
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
      {preview && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {preview}
        </p>
      )}
      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        {formattedDate}
      </p>
    </div>
  );
}