import { component$, type QRL } from "@builder.io/qwik";
import "./Sidebar.css";

// PUBLIC_INTERFACE
export interface NotePreview {
  id: string;
  title: string;
  created: string;
}

// PUBLIC_INTERFACE
export const Sidebar = component$(
  (props: {
    notes: NotePreview[];
    selectedId: string | null;
    onSelect$: QRL<(id: string) => void>;
    onCreate$: QRL<() => void>;
  }) => {
    return (
      <aside class="sidebar">
        <div class="sidebar-header">Notes</div>
        <ul class="notes-list">
          {props.notes.length === 0 && (
            <li style="color:#888;padding-top:38px;text-align:center">No notes yet</li>
          )}
          {props.notes.map((note) => (
            <li
              key={note.id}
              class={note.id === props.selectedId ? "active" : ""}
              onClick$={() => props.onSelect$(note.id)}
              tabIndex={0}
            >
              <div style="font-weight:500">{note.title || <span style="color:#aaa">Untitled</span>}</div>
              <div style="font-size:0.76rem;color:#9ea4af;margin-top:5px;">{new Date(note.created).toLocaleString()}</div>
            </li>
          ))}
        </ul>
        <div class="sidebar-footer">
          <button onClick$={props.onCreate$}>+ New Note</button>
        </div>
      </aside>
    );
  }
);
