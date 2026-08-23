import { useState } from "react";
import type { Bookmark } from "../../types/domain";
import { BookmarkItem } from "./BookmarkItem";
import { GlassIcon } from "../../ui/glass";
import { Icon } from "../../ui/icon";
import { Dialog } from "../../ui/dialog";

type BookmarkListProps = {
  bookmarks: Bookmark[];
  onOpen: (bookmark: Bookmark) => void;
  onAdd: (bookmark: Omit<Bookmark, "id" | "order">) => void;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onReorder: (bookmarks: Bookmark[]) => void;
};

export function BookmarkList({ bookmarks, onOpen, onAdd, onEdit, onDelete }: BookmarkListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");

  function resetForm() {
    setFormTitle("");
    setFormUrl("");
    setEditing(null);
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;
    onAdd({ title: formTitle.trim(), url: formUrl.trim() });
    resetForm();
    setShowAdd(false);
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !formTitle.trim() || !formUrl.trim()) return;
    onEdit({ ...editing, title: formTitle.trim(), url: formUrl.trim() });
    resetForm();
  }

  function openEdit(bookmark: Bookmark) {
    setEditing(bookmark);
    setFormTitle(bookmark.title);
    setFormUrl(bookmark.url);
  }

  function handleDelete(bookmark: Bookmark) {
    onDelete(bookmark.id);
  }

  return (
    <div className="bookmark-region">
      <div className="bookmark-list">
        {bookmarks
          .sort((a, b) => a.order - b.order)
          .map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onOpen={onOpen}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        <button className="bookmark-add" onClick={() => { resetForm(); setShowAdd(true); }}>
          <GlassIcon size={24} variant="interactive">
            <Icon name="add" size={12} />
          </GlassIcon>
          <span>Add</span>
        </button>
      </div>

      <Dialog
        open={showAdd || editing !== null}
        onClose={() => { resetForm(); setShowAdd(false); }}
        title={editing ? "Edit bookmark" : "Add bookmark"}
      >
        <form onSubmit={editing ? handleEditSubmit : handleAddSubmit} className="bookmark-form">
          <label className="form-field">
            <span className="form-label">Name</span>
            <input
              className="form-input"
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="My Site"
              required
              autoFocus
            />
          </label>
          <label className="form-field">
            <span className="form-label">URL</span>
            <input
              className="form-input"
              type="text"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => { resetForm(); setShowAdd(false); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {editing ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}