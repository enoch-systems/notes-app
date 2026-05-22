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
import DeleteConfirmModal from "@/components/delete-confirm-modal";
import DayProgress from "@/components/day-progress";

type View = "list" | "editor" | "new";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    const fetched = await getNotes();
    setNotes(fetched);
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const [displayedNotes, setDisplayedNotes] = useState<Note[]>([]);
  useEffect(() => {
    if (searchQuery) {
      searchNotes(searchQuery).then(setDisplayedNotes).catch(() => setDisplayedNotes([]));
    } else {
      setDisplayedNotes(notes);
    }
  }, [searchQuery, notes]);

  function handleSelectNote(id: string) {
    setSelectedNoteId(id);
    setView("editor");
    setSidebarOpen(false);
  }

  function handleAddNote() {
    setView("new");
    setSidebarOpen(false);
  }

  async function handleCreateNote(title: string, content: string) {
    await addNote(title, content);
    await loadNotes();
    setView("list");
    setSidebarOpen(true);
  }

  async function handleSaveNote(id: string, title: string, content: string) {
    await updateNote(id, title, content);
    await loadNotes();
  }

  function handleDeleteNote(id: string) {
    setPendingDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteId) return;
    await deleteNote(pendingDeleteId);
    await loadNotes();
    if (selectedNoteId === pendingDeleteId) {
      setSelectedNoteId(null);
      setView("list");
      setSidebarOpen(true);
    }
    setPendingDeleteId(null);
  }

  function handleCancelDelete() {
    setPendingDeleteId(null);
  }

  function handleBack() {
    setSelectedNoteId(null);
    setView("list");
    setSidebarOpen(true);
  }

  const selectedNote = selectedNoteId
    ? notes.find((n) => n.id === selectedNoteId) ?? null
    : null;

  return (
    <div className="h-full overflow-y-auto">
      {/* macOS-style unified titlebar — sticky at top, notes scroll under it */}
      <header className="sticky top-0 z-10 border-b border-gray-200/60 bg-gray-100/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        {/* Date + note count row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <span className="shrink-0 rounded-full bg-zinc-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Search */}
        <div className="px-4 pb-1.5">
          <div className="relative">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes"
              className="w-full rounded-xl border border-zinc-200/70 bg-white/80 py-2 pl-9 pr-3 text-[13px] outline-none transition-all placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white dark:border-zinc-700/70 dark:bg-zinc-900/80 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900"
            />
          </div>
        </div>

        {/* Day progress + countdowns */}
        <DayProgress />

        {/* Add New Note button */}
        <div className="px-4 pb-3">
          <button
            onClick={handleAddNote}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 active:scale-[0.98]"
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
            Add New Note
          </button>
        </div>
      </header>

      {/* Only show sidebar + main split when NOT in editor mode on mobile */}
      {view === "editor" && selectedNote ? (
        <div className="flex min-h-[calc(100vh-100%)]">
          {/* Sidebar visible only on sm+ */}
          <aside className="hidden w-80 shrink-0 flex-col border-r border-gray-200/60 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/30 sm:flex">
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {displayedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onSelect={handleSelectNote}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            </div>
          </aside>
          <main className="flex-1">
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onBack={handleBack}
            />
          </main>
        </div>
      ) : view === "new" ? (
        <NewNoteForm onSave={handleCreateNote} onCancel={handleBack} />
      ) : (
        /* List view: notes flow naturally in page scroll */
        <div className="flex min-h-[calc(100vh-100%)]">
          <aside className="w-full shrink-0 flex-col border-r border-gray-200/60 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/30 sm:w-80 sm:flex">
            <div>
              {displayedNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h6.9c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V3.6c0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5z" />
                      <path d="M9 7h6" />
                      <path d="M9 11h6" />
                      <path d="M9 15h4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "No results"
                      : "No notes yet"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {searchQuery
                      ? "Try a different search"
                      : "Click New Note to get started"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {displayedNotes.map((note, i) => (
                    <div
                      key={note.id}
                      className={`stagger-${(i % 8) + 1} ${selectedNoteId === note.id ? "bg-blue-50/80 dark:bg-blue-950/30" : ""}`}
                    >
                      <NoteCard
                        note={note}
                        onSelect={handleSelectNote}
                        onDelete={handleDeleteNote}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Main content placeholder (hidden on mobile when notes list is shown) */}
          <main className="hidden flex-1 items-center justify-center sm:flex">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v16.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h6.9c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V3.6c0-.4-.2-.8-.5-1.1-.3-.3-.7-.5-1.1-.5z" />
                  <path d="M9 7h6" />
                  <path d="M9 11h6" />
                  <path d="M9 15h4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Select a note
              </p>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                Choose from the sidebar or create a new one
              </p>
            </div>
          </main>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={pendingDeleteId !== null}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
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
    setTimeout(() => titleRef.current?.focus(), 150);
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
    <div className="flex h-full flex-col bg-white dark:bg-gray-950" onKeyDown={handleKeyDown}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-200/70 bg-gray-50/90 px-3 py-2 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 sm:px-4">
        <button
          onClick={onCancel}
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
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-gray-400 sm:inline dark:text-gray-500">
            ⌘S save · Esc cancel
          </span>
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
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Done
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