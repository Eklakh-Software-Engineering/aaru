import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export default function Journal() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("journal-notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  const saveNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      const updated = [note, ...notes];
      setNotes(updated);
      localStorage.setItem("journal-notes", JSON.stringify(updated));
      setNewNote("");
      toast.success("Note saved with love");
    }
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((note) => note.id !== id);
    setNotes(updated);
    localStorage.setItem("journal-notes", JSON.stringify(updated));
    toast.success("Note removed");
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all notes?")) {
      setNotes([]);
      localStorage.removeItem("journal-notes");
      toast.success("All notes cleared");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center animate-fadeIn">
          <h1 className="font-playfair text-5xl font-bold mb-4">Journal</h1>
          <p className="text-muted-foreground text-lg">
            Leave a small note — it will stay safe in your browser.
          </p>
        </div>

        <Card className="p-8 shadow-elevated border-primary/10 bg-gradient-to-br from-card to-card-glass mb-8 animate-fadeIn">
          <Textarea
            placeholder="Write something to yourself..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-4 border-primary/20 focus:border-primary/40 bg-white/50 min-h-[120px]"
            rows={5}
          />
          <div className="flex gap-4">
            <Button onClick={saveNote} variant="hero">
              Save Note
            </Button>
            <Button onClick={clearAll} variant="outline">
              Clear All
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {notes.map((note, index) => (
            <Card
              key={note.id}
              className="p-6 shadow-soft border-primary/10 bg-gradient-to-br from-card to-card-glass hover:shadow-elevated transition-all duration-300 animate-slideIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-foreground/90 whitespace-pre-wrap mb-2 leading-relaxed">
                    {note.text}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {note.timestamp}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteNote(note.id)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {notes.length === 0 && (
            <Card className="p-12 text-center shadow-soft border-primary/10 bg-gradient-to-br from-card to-card-glass">
              <p className="text-muted-foreground italic">
                No notes yet. Write something kind to yourself.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
