import { component$, useSignal, $ } from "@builder.io/qwik";
import { Sidebar, type NotePreview } from "../../components/notes/Sidebar";
import { NoteMain, type Note } from "../../components/notes/NoteMain";

// Util functions for CRUD localStorage
function getNotes(): Note[] {
  const data = localStorage.getItem("notes-v1");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}
function saveNotes(notes: Note[]) {
  localStorage.setItem("notes-v1", JSON.stringify(notes));
}

export default component$(() => {
  // Signals for state
  const notesSig = useSignal<Note[]>([]);
  const selectedId = useSignal<string | null>(null);
  const isEditing = useSignal(false);

  // Initial load (SSR/mount)
  if (typeof window !== "undefined" && notesSig.value.length === 0) {
    // On page load, hydrate from localStorage
    notesSig.value = getNotes();
    if (notesSig.value.length > 0) {
      selectedId.value = notesSig.value[0].id;
    }
  }

  // Helper signals
  const selectedNote = () => notesSig.value.find((n) => n.id === selectedId.value) || null;

  // Handler: select note
  const handleSelect$ = $((id: string) => {
    selectedId.value = id;
    isEditing.value = false;
  });

  // Handler: create new note
  const handleCreate$ = $(() => {
    const newNote: Note = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title: "Untitled",
      content: "",
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    notesSig.value = [newNote, ...notesSig.value];
    saveNotes(notesSig.value);
    selectedId.value = newNote.id;
    isEditing.value = true;
  });

  // Handler: edit note
  const handleEdit$ = $(() => {
    isEditing.value = true;
  });

  // Handler: cancel edit
  const handleCancel$ = $(() => {
    isEditing.value = false;
  });

  // Handler: save note
  const handleSave$ = $((data: { title: string; content: string }) => {
    notesSig.value = notesSig.value.map((n) =>
      n.id === selectedId.value
        ? { ...n, title: data.title, content: data.content, lastUpdated: new Date().toISOString() }
        : n
    );
    saveNotes(notesSig.value);
    isEditing.value = false;
  });

  // Handler: delete note
  const handleDelete$ = $(() => {
    notesSig.value = notesSig.value.filter((n) => n.id !== selectedId.value);
    saveNotes(notesSig.value);
    // Select another note if any
    if (notesSig.value.length > 0) {
      selectedId.value = notesSig.value[0].id;
      isEditing.value = false;
    } else {
      selectedId.value = null;
      isEditing.value = false;
    }
  });

  // For Sidebar
  const notePreviews: NotePreview[] = notesSig.value.map((n) => ({
    id: n.id,
    title: n.title,
    created: n.created,
  }));

  return (
    <div style="display:flex;flex-direction:row;min-height:100vh;">
      <Sidebar
        notes={notePreviews}
        selectedId={selectedId.value}
        onSelect$={handleSelect$}
        onCreate$={handleCreate$}
      />
      <div class="main-content">
        <div class="main-header">Simple Notes</div>
        <NoteMain
          note={selectedNote()}
          isEditing={isEditing.value}
          onEdit$={handleEdit$}
          onCancel$={handleCancel$}
          onSave$={handleSave$}
          onDelete$={handleDelete$}
        />
      </div>
    </div>
  );
});
