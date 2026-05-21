"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Note } from "@/lib/types";
import { getNotes, addNote, updateNote, deleteNote, searchNotes } from "@/lib/notes-store";
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
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight">My Notes</h1>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {notes.length}
          </span>
        </div>
        <button
          onClick={handleAddNote}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          New Note
        </button>
      </header>

      {/* Search bar */}
      {view !== "editor" && (
        <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-blue-500 dark:focus:bg-zinc-950"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view === "new" && (
          <NewNoteForm
            onSave={handleCreateNote}
            onCancel={handleBack}
          />
        )}

        {view === "editor" && selectedNote && (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onBack={handleBack}
          />
        )}

        {view === "list" && (
          <div className="p-4">
            {displayedNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-300 dark:text-zinc-700"
                >
                  <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h6.9c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V3.6c0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5z" />
                  <path d="M9 7h6" />
                  <path d="M9 11h6" />
                  <path d="M9 15h4" />
                </svg>
                <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
                  {searchQuery ? "No notes match your search" : "No notes yet"}
                </p>
                <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                  {searchQuery
                    ? "Try a different search term"
                    : "Click the New Note button to create one"}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
    titleRef.current?.focus();
  }, []);

  function handleSave() {
    onSave(title, content);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <div className="flex h-full flex-col" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Save
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-bold text-zinc-900 placeholder-zinc-300 outline-none dark:text-zinc-100 dark:placeholder-zinc-600"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="mt-4 min-h-[300px] w-full flex-1 resize-none text-base leading-relaxed text-zinc-800 placeholder-zinc-300 outline-none dark:text-zinc-200 dark:placeholder-zinc-600"
        />
      </div>
    </div>
  );
}