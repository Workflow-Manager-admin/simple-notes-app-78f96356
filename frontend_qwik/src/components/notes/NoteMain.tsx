import { component$, useSignal, type QRL, useTask$ } from "@builder.io/qwik";
import "./NoteMain.css";

// PUBLIC_INTERFACE
export interface Note {
  id: string;
  title: string;
  content: string;
  created: string;
  lastUpdated: string;
}

// PUBLIC_INTERFACE
export const NoteMain = component$(
  (props: {
    note: Note | null;
    isEditing: boolean;
    onEdit$: QRL<() => void>;
    onCancel$: QRL<() => void>;
    onSave$: QRL<(data: { title: string; content: string }) => void>;
    onDelete$: QRL<() => void>;
  }) => {
    const titleSig = useSignal(props.note?.title || "");
    const contentSig = useSignal(props.note?.content || "");

    // When props.note changes and isEditing, update signals
    useTask$(({ track }) => {
      track(() => props.note?.id);
      if (props.isEditing && props.note) {
        titleSig.value = props.note.title || "";
        contentSig.value = props.note.content || "";
      }
    });

    if (!props.note) {
      return (
        <section class="note-detail" style="justify-content:center;align-items:center;color:#848484;font-size:1.3rem;">
          <span>Select a note or create a new one!</span>
        </section>
      );
    }

    if (props.isEditing) {
      return (
        <section class="note-detail">
          <form
            class="note-editor"
            preventdefault:submit
            onSubmit$={() => {
              props.onSave$({ title: titleSig.value, content: contentSig.value });
            }}
          >
            <input
              type="text"
              placeholder="Title"
              value={titleSig.value}
              maxLength={100}
              onInput$={e => (titleSig.value = (e.target as HTMLInputElement).value)}
            />
            <textarea
              placeholder="Write your note here..."
              value={contentSig.value}
              rows={7}
              maxLength={4000}
              onInput$={e => (contentSig.value = (e.target as HTMLTextAreaElement).value)}
            />
            <div class="note-actions">
              <button type="submit" class="button-primary">Save</button>
              <button
                type="button"
                class="button-accent"
                onClick$={props.onCancel$}
              >
                Cancel
              </button>
              <button
                type="button"
                class="button-danger"
                onClick$={() => {
                  if (
                    window.confirm("Are you sure you want to delete this note?")
                  ) {
                    props.onDelete$();
                  }
                }}
              >
                Delete
              </button>
            </div>
          </form>
        </section>
      );
    }

    return (
      <section class="note-detail">
        <div class="note-title">{props.note.title || <span style="color:#aaa">Untitled</span>}</div>
        <div class="note-meta">
          Created: {new Date(props.note.created).toLocaleString()}
          <span style="margin-left:18px;">Last updated: {new Date(props.note.lastUpdated).toLocaleString()}</span>
        </div>
        <div class="note-content">
          {props.note.content || <span style="color:#bbb">No content</span>}
        </div>
        <div class="note-actions">
          <button class="button-primary" onClick$={props.onEdit$}>
            Edit
          </button>
          <button
            class="button-danger"
            onClick$={() => {
              if (
                window.confirm("Are you sure you want to delete this note?")
              ) {
                props.onDelete$();
              }
            }}
          >
            Delete
          </button>
        </div>
      </section>
    );
  }
);
