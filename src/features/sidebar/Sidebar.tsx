import { useState, type DragEvent } from "react";
import type { Bookmark, Category } from "../../types/domain";
import { GlassIcon } from "../../ui/glass";
import { Icon, type IconName, iconRegistry } from "../../ui/icon";
import { Dialog } from "../../ui/dialog";

type SidebarProps = {
  categories: Category[];
  bookmarks: Bookmark[];
  onBookmarkOpen: (bookmark: Bookmark) => void;
  onBookmarkAdd: (data: Omit<Bookmark, "id" | "order" | "lastUsedAt">) => void;
  onBookmarkEdit: (bookmark: Bookmark) => void;
  onBookmarkDelete: (id: string) => void;
  onBookmarkReorder: (bookmarks: Bookmark[]) => void;
  onCategoryAdd: (data: Omit<Category, "id" | "order">) => void;
  onCategoryEdit: (category: Category) => void;
  onCategoryDelete: (id: string) => void;
};

export function Sidebar({
  categories,
  bookmarks,
  onBookmarkOpen,
  onBookmarkAdd,
  onBookmarkEdit,
  onBookmarkDelete,
  onBookmarkReorder,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryDelete,
}: SidebarProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(() => categories[0]?.id ?? null);
  const [showAddBookmark, setShowAddBookmark] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formCatName, setFormCatName] = useState("");
  const [formCatIcon, setFormCatIcon] = useState<IconName>("folder");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? categories[0];
  const resolvedCategoryId = activeCategory?.id ?? null;
  const categoryBookmarks = bookmarks
    .filter((b) => b.categoryId === resolvedCategoryId)
    .sort((a, b) => a.order - b.order);

  function resetBookmarkForm() {
    setFormTitle("");
    setFormUrl("");
    setEditingBookmark(null);
  }

  function resetCategoryForm() {
    setFormCatName("");
    setFormCatIcon("folder");
    setEditingCategory(null);
  }

  function handleAddBookmarkSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim() || !resolvedCategoryId) return;
    onBookmarkAdd({ title: formTitle.trim(), url: formUrl.trim(), categoryId: resolvedCategoryId });
    resetBookmarkForm();
    setShowAddBookmark(false);
  }

  function handleEditBookmarkSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBookmark || !formTitle.trim() || !formUrl.trim()) return;
    onBookmarkEdit({ ...editingBookmark, title: formTitle.trim(), url: formUrl.trim() });
    resetBookmarkForm();
  }

  function handleAddCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formCatName.trim()) return;
    onCategoryAdd({ name: formCatName.trim(), icon: formCatIcon });
    resetCategoryForm();
    setShowAddCategory(false);
  }

  function handleEditCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory || !formCatName.trim()) return;
    onCategoryEdit({ ...editingCategory, name: formCatName.trim(), icon: formCatIcon });
    resetCategoryForm();
  }

  function openEditBookmark(bookmark: Bookmark) {
    setEditingBookmark(bookmark);
    setFormTitle(bookmark.title);
    setFormUrl(bookmark.url);
  }

  function openEditCategory(category: Category) {
    setEditingCategory(category);
    setFormCatName(category.name);
    setFormCatIcon(category.icon as IconName);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...categoryBookmarks];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    const reordered = updated.map((b, i) => ({ ...b, order: i }));
    const otherBookmarks = bookmarks.filter((b) => b.categoryId !== resolvedCategoryId);
    onBookmarkReorder([...otherBookmarks, ...reordered]);
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  const isBookmarkDialogOpen = showAddBookmark || editingBookmark !== null;
  const isCategoryDialogOpen = showAddCategory || editingCategory !== null;

  return (
    <>
      <nav className="sidebar" aria-label="Bookmark categories">
        <div className="sidebar-rail">
          {categories
            .sort((a, b) => a.order - b.order)
            .map((cat) => (
              <button
                key={cat.id}
                className={`sidebar-icon ${activeCategory?.id === cat.id ? "sidebar-icon--active" : ""}`}
                onMouseEnter={() => setActiveCategoryId(cat.id)}
                onClick={() => setActiveCategoryId(cat.id)}
                title={cat.name}
                aria-label={cat.name}
              >
                <GlassIcon size={36} variant="static">
                  <Icon name={cat.icon as IconName} size={16} />
                </GlassIcon>
              </button>
            ))}
          <button
            className="sidebar-icon sidebar-icon--add"
            onClick={() => { resetCategoryForm(); setShowAddCategory(true); }}
            title="Add category"
            aria-label="Add category"
          >
            <GlassIcon size={36} variant="interactive">
              <Icon name="add" size={14} />
            </GlassIcon>
          </button>
        </div>

        {activeCategory && (
          <div className="sidebar-panel">
            <div className="sidebar-panel-inner">
              <div className="sidebar-panel-header">
                <h2 className="sidebar-panel-title">{activeCategory.name}</h2>
                <div className="sidebar-panel-actions">
                  <GlassIcon
                    size={28}
                    variant="interactive"
                    onClick={() => openEditCategory(activeCategory)}
                    aria-label={`Edit ${activeCategory.name}`}
                  >
                    <Icon name="edit" size={12} />
                  </GlassIcon>
                  <GlassIcon
                    size={28}
                    variant="interactive"
                    onClick={() => onCategoryDelete(activeCategory.id)}
                    aria-label={`Delete ${activeCategory.name}`}
                  >
                    <Icon name="delete" size={12} />
                  </GlassIcon>
                </div>
              </div>
              <div className="sidebar-panel-body">
                {categoryBookmarks.length === 0 && (
                  <p className="sidebar-empty">No bookmarks yet</p>
                )}
                {categoryBookmarks.map((bookmark, index) => (
                  <div
                    key={bookmark.id}
                    className={`sidebar-bookmark ${dragIndex === index ? "sidebar-bookmark--dragging" : ""}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <button
                      className="sidebar-bookmark-link"
                      onClick={() => {
                        onBookmarkOpen(bookmark);
                        onBookmarkEdit({ ...bookmark, lastUsedAt: new Date().toISOString() });
                      }}
                      title={bookmark.url}
                    >
                      <span className="sidebar-bookmark-icon">
                        {bookmark.title.charAt(0).toUpperCase()}
                      </span>
                      <span className="sidebar-bookmark-title">{bookmark.title}</span>
                    </button>
                    <div className="sidebar-bookmark-actions">
                      <GlassIcon
                        size={24}
                        variant="interactive"
                        onClick={() => openEditBookmark(bookmark)}
                        aria-label={`Edit ${bookmark.title}`}
                      >
                        <Icon name="edit" size={10} />
                      </GlassIcon>
                      <GlassIcon
                        size={24}
                        variant="interactive"
                        onClick={() => onBookmarkDelete(bookmark.id)}
                        aria-label={`Delete ${bookmark.title}`}
                      >
                        <Icon name="delete" size={10} />
                      </GlassIcon>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sidebar-panel-footer">
                <button
                  className="sidebar-add-btn"
                  onClick={() => { resetBookmarkForm(); setShowAddBookmark(true); }}
                >
                  <Icon name="add" size={14} />
                  <span>Add bookmark</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bookmark dialog */}
      <Dialog
        open={isBookmarkDialogOpen}
        onClose={() => { resetBookmarkForm(); setShowAddBookmark(false); }}
        title={editingBookmark ? "Edit bookmark" : "Add bookmark"}
      >
        <form onSubmit={editingBookmark ? handleEditBookmarkSubmit : handleAddBookmarkSubmit} className="bookmark-form">
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
              onClick={() => { resetBookmarkForm(); setShowAddBookmark(false); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {editingBookmark ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </Dialog>

      {/* Category dialog */}
      <Dialog
        open={isCategoryDialogOpen}
        onClose={() => { resetCategoryForm(); setShowAddCategory(false); }}
        title={editingCategory ? "Edit category" : "Add category"}
      >
        <form onSubmit={editingCategory ? handleEditCategorySubmit : handleAddCategorySubmit} className="bookmark-form">
          <label className="form-field">
            <span className="form-label">Category name</span>
            <input
              className="form-input"
              type="text"
              value={formCatName}
              onChange={(e) => setFormCatName(e.target.value)}
              placeholder="My Category"
              required
              autoFocus
            />
          </label>
          <div className="icon-picker">
            <span className="form-label">Icon</span>
            <div className="icon-picker-grid">
              {iconRegistry.map((iconName: string) => (
                <button
                  key={iconName}
                  type="button"
                  className={`icon-picker-btn ${formCatIcon === iconName ? "icon-picker-btn--active" : ""}`}
                  onClick={() => setFormCatIcon(iconName as IconName)}
                  title={iconName}
                  aria-label={iconName}
                >
                  <Icon name={iconName as IconName} size={16} />
                </button>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => { resetCategoryForm(); setShowAddCategory(false); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {editingCategory ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}