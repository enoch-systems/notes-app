"use client";

import { Note } from "./types";
import { supabase } from "./supabase";

export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return (data ?? []).map(mapRow);
}

export async function addNote(title: string, content: string): Promise<Note | null> {
  const now = Date.now();
  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, created_at: now, updated_at: now })
    .select()
    .single();

  if (error) {
    console.error("Error adding note:", error);
    return null;
  }

  return data ? mapRow(data) : null;
}

export async function updateNote(
  id: string,
  title: string,
  content: string
): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content, updated_at: Date.now() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating note:", error);
    return null;
  }

  return data ? mapRow(data) : null;
}

export async function deleteNote(id: string): Promise<boolean> {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting note:", error);
    return false;
  }

  return true;
}

export async function searchNotes(query: string): Promise<Note[]> {
  const q = `%${query.toLowerCase()}%`;
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .or(`title.ilike.${q},content.ilike.${q}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching notes:", error);
    return [];
  }

  return (data ?? []).map(mapRow);
}

function mapRow(row: any): Note {
  return {
    id: row.id,
    title: row.title ?? "",
    content: row.content ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}