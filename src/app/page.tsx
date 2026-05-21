"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Note } from "@/lib/types";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  searchNotes,
} from "@/lib/notes-store";
import NoteCard from "@/components/note-card";
import NoteEditor from "@/components/note-editor";

type View = "list" | "editor" | "new";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  const [searchQuery, setSearchQuery] = useState("");

  const loadNotes = useCallback(() => {
    setNotes(getNotes());
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const displayedNotes = searchQuery ? searchNotes(searchQuery) : notes;

  function handleSelectNote(id: string) {
    setSelectedNoteId(id);
    setView("editor");
  }

  function handleAddNote() {
    setView("new");
  }

  function handleCreateNote(title: string, content: string) {
    addNote(title, content);
    loadNotes();
    setView("list");
  }

  function handleSaveNote(id: string, title: string, content: string) {
    updateNote(id, title, content);
    loadNotes();
  }

  function handleDeleteNote(id: string) {
    deleteNote(id);
    loadNotes();
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setView("list");
    }
  }

  function handleBack() {
    setSelectedNoteId(null);
    setView("list");
  }

  const selectedNote = selectedNoteId
    ? notes.find((n) => n.id === selectedNoteId) ?? null
    : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200/70 bg-white/80 px-5 py-3 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h6.9c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V3.6c0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5z" />
                <path d="M9 7h6" />
                <path d="M9 11h6" />
                <path d="M9 15h4" />
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
              Notes
            </h1>
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {notes.length}
            </span>
          </div>
          <button
            onClick={handleAddNote}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-md active:scale-[0.97]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            New Note
          </button>
        </div>
      </header>

      {/* Search */}
      {view !== "editor" && (
        <div className="border-b border-zinc-200/50 bg-zinc-50/50 px-5 py-3 dark:border-zinc-800/50 dark:bg-zinc-900/30">
          <div className="mx-auto max-w-6xl">
            <div className="relative">
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
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full rounded-xl border border-zinc-200/80 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-zinc-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-500 dark:focus:border-violet-600 dark:focus:ring-violet-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/30">
        {view === "new" && (
          <NewNoteForm onSave={handleCreateNote} onCancel={handleBack} />
        )}

        {view === "editor" && selectedNote && (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onBack={handleBack}
          />
        )}

        {view === "list" && (
          <div className="mx-auto max-w-6xl p-5">
            {displayedNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-950/40 dark:to-fuchsia-950/40">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-violet-500 dark:text-violet-400"
                  >
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h6.9c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V3.6c0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5z" />
                    <path d="M9 7h6" />
                    <path d="M9 11h6" />
                    <path d="M9 15h4" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-zinc-500 dark:text-zinc-400">
                  {searchQuery
                    ? "No notes match your search"
                    : "No notes yet"}
                </p>
                <p className="mt-1.5 text-sm text-zinc-400 dark:text-zinc-500">
                  {searchQuery
                    ? "Try a different search term"
                    : "Click the New Note button to create your first note"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleAddNote}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-md active:scale-[0.97]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14" />
                      <path d="M5 12h14" />
                    </svg>
                    Create your first note
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onSelect={handleSelectNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NewNoteForm({
  onSave,
  onCancel,
}: {
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 100);
  }, []);

  function handleSave() {
    onSave(title, content);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <div className="flex h-full flex-col" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between border-b border-zinc-200/70 bg-white/80 px-5 py-3 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/80">
        <button
          onClick={onCancel}
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
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-zinc-400 sm:inline dark:text-zinc-500">
            ⌘S to save · Esc to cancel
          </span>
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
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Done
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
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