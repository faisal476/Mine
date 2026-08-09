import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { loadState, saveState, formatDateTime, type NoteRecord } from "@/lib/storage";
import { Lock, Trash2, Plus } from "lucide-react";

export function Vault() {
  const [state, setState] = useState(loadState());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const refresh = () => setState(loadState());

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;
    const current = loadState();
    const note: NoteRecord = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    current.notes = [note, ...(current.notes || [])];
    saveState(current);
    refresh();
    setTitle("");
    setContent("");
  };

  const handleDelete = (id: string) => {
    const current = loadState();
    current.notes = (current.notes || []).filter((n) => n.id !== id);
    saveState(current);
    refresh();
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lock className="h-5 w-5 text-primary" />
            إضافة إلى الخزنة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="العنوان"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-border bg-background"
          />
          <Textarea
            placeholder="المحتوى..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-24 border-border bg-background"
          />
          <Button className="bg-primary" onClick={handleAdd}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(state.notes || []).length === 0 && (
          <div className="text-center text-sm text-muted-foreground">لا توجد عناصر في الخزنة بعد</div>
        )}
        {(state.notes || []).map((note) => (
          <Card key={note.id} className="border-border bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-foreground">{note.title}</div>
                  <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{note.content}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</div>
                </div>
                <Button variant="outline" size="sm" className="border-border" onClick={() => handleDelete(note.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}