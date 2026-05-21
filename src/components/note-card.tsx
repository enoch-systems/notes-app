"use client";

import { Note } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryColors = [
  "from-violet-500/10 to-fuchsia-500/10 border-l-violet-400",
  "from-amber-500/10 to-orange-500/10 border-l-amber-400",
  "from-emerald-500/10 to-teal-500/10 border-l-emerald-400",
  "from-sky-500/10 to-blue-500/10 border-l-sky-400",
  "from-rose-500/10 to-pink-500/10 border-l-rose-400",
  "from-cyan-500/10 to-indigo-500/10 border-l-cyan-400",
];

function getColor(id: string, index: number) {
  return categoryColors[index % categoryColors.length];
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
      className="animate-fade-in group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200/80 bg-white bg-gradient-to-br from-white to-zinc-50/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-950/80 dark:hover:border-zinc-700"
    >
      {/* Gradient accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${getColor(note.id, note.createdAt % 6)}`}
      />

      <div className="flex items-start justify-between gap-3">
        <h3 className="flex-1 truncate text-[15px] font-semibold leading-snug text-zinc-800 dark:text-zinc-100">
          {note.title || (
            <span className="italic text-zinc-400 dark:text-zinc-600">
              Untitled
            </span>
          )}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="shrink-0 rounded-lg p-1.5 text-zinc-400 opacity-0 transition-all duration-200 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/40 dark:hover:text-red-400"
          title="Delete note"
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
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      {preview && (
        <p className="mt-2.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3">
          {preview}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {formattedDate}
      </div>
    </div>
  );
}