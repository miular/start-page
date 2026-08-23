import { useState } from "react";
import type { Bookmark } from "../../types/domain";
import { getInitials } from "../../lib/favicon";
import { GlassIcon } from "../../ui/glass";

type BookmarkItemProps = {
  bookmark: Bookmark;
  onOpen: (bookmark: Bookmark) => void;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
};

export function BookmarkItem({ bookmark, onOpen, onEdit, onDelete }: BookmarkItemProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bookmark-item">
      <button
        className="bookmark-link"
        onClick={() => onOpen(bookmark)}
        title={bookmark.url}
      >
        {bookmark.icon && !imgError ? (
          <img
            src={bookmark.icon}
            alt=""
            className="bookmark-icon"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="bookmark-fallback">{getInitials(bookmark.title)}</span>
        )}
        <span className="bookmark-title">{bookmark.title}</span>
      </button>
      <div className="bookmark-actions">
        <GlassIcon
          size={24}
          variant="interactive"
          onClick={() => onEdit(bookmark)}
          aria-label={`Edit ${bookmark.title}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20a1 1 0 0 1-.99-1.16l.7-4.2a1 1 0 0 1 .29-.56l10-10a3 3 0 0 1 4.24 0l1.68 1.68a3 3 0 0 1 0 4.24l-10 10a1 1 0 0 1-.56.3l-4.2.69a1 1 0 0 1-.16.01zm1.63-4.83-.47 2.83 2.83-.47 9.8-9.8a1 1 0 0 0 0-1.42L15.1 5.2a1 1 0 0 0-1.42 0z" />
          </svg>
        </GlassIcon>
        <GlassIcon
          size={24}
          variant="interactive"
          onClick={() => onDelete(bookmark)}
          aria-label={`Delete ${bookmark.title}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 4V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1h3a1 1 0 1 1 0 2h-1v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6H4a1 1 0 1 1 0-2h3zm2 0h6V3H9v1zM7 6v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6H7zm2 3a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1z" />
          </svg>
        </GlassIcon>
      </div>
    </div>
  );
}