"use client";

import { useEffect, useState } from "react";
import { useNotes } from "@repo/notes";
import { notify } from "@repo/notifications";
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default function NotesPage() {
  const { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createNote({ title: title.trim(), content: content.trim() || undefined });
      setTitle("");
      setContent("");
      notify.success("Note created!");
    } catch {
      notify.error(error || "Failed to create note");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateNote(id, { title: editTitle.trim(), content: editContent.trim() || undefined });
      setEditingId(null);
      notify.success("Note updated!");
    } catch {
      notify.error(error || "Failed to update note");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      notify.success("Note deleted!");
    } catch {
      notify.error(error || "Failed to delete note");
    }
  };

  const startEditing = (note: { id: number; title: string; content: string | null }) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content || "");
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notes</h1>
        <p className="text-muted-foreground">Create and manage your notes</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Note content (optional)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
            <Button type="submit" disabled={loading || !title.trim()}>
              Add Note
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && notes.length === 0 && (
        <p className="text-muted-foreground text-center py-8">Loading notes...</p>
      )}

      {!loading && notes.length === 0 && (
        <p className="text-muted-foreground text-center py-8">No notes yet. Create your first one above!</p>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="pt-6">
              {editingId === note.id ? (
                <div className="space-y-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(note.id)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      {note.content && (
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                          {note.content}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditing(note)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(note.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
