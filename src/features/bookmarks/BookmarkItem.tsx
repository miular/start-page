import { useState } from "react";
import type { Bookmark } from "../../types/domain";
import { getInitials } from "../../lib/favicon";
import { GlassIcon } from "../../ui/glass";
import { Icon } from "../../ui/icon";

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
          <Icon name="edit" size={12} />
        </GlassIcon>
        <GlassIcon
          size={24}
          variant="interactive"
          onClick={() => onDelete(bookmark)}
          aria-label={`Delete ${bookmark.title}`}
        >
          <Icon name="delete" size={12} />
        </GlassIcon>
      </div>
    </div>
  );
}