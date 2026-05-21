"use client";

import { Note } from "./types";

const STORAGE_KEY = "my-notes-app-notes";

export function getNotes(): Note[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Note[];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getNote(id: string): Note | undefined {
  const notes = getNotes();
  return notes.find((n) => n.id === id);
}

export function addNote(title: string, content: string): Note {
  const notes = getNotes();
  const now = Date.now();
  const note: Note = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
  notes.unshift(note);
  saveNotes(notes);
  return note;
}

export function updateNote(id: string, title: string, content: string): Note | undefined {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return undefined;
  notes[index] = {
    ...notes[index],
    title,
    content,
    updatedAt: Date.now(),
  };
  saveNotes(notes);
  return notes[index];
}

export function deleteNote(id: string): boolean {
  const notes = getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  if (filtered.length === notes.length) return false;
  saveNotes(filtered);
  return true;
}

export function searchNotes(query: string): Note[] {
  const notes = getNotes();
  const q = query.toLowerCase();
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
  );
}