import type { Bookmark } from "../../types/domain";
import { getInitials } from "../../lib/favicon";

type RecentBookmarksProps = {
  bookmarks: Bookmark[];
  onOpen: (bookmark: Bookmark) => void;
  onTrackUse: (bookmark: Bookmark) => void;
};

export function RecentBookmarks({ bookmarks, onOpen, onTrackUse }: RecentBookmarksProps) {
  const recent = bookmarks
    .filter((b) => b.lastUsedAt)
    .sort((a, b) => new Date(b.lastUsedAt!).getTime() - new Date(a.lastUsedAt!).getTime())
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <div className="recent-region">
      <div className="recent-bookmarks">
        {recent.map((bookmark) => (
          <button
            key={bookmark.id}
            className="recent-item"
            onClick={() => {
              onOpen(bookmark);
              onTrackUse(bookmark);
            }}
            title={bookmark.url}
          >
            <span className="recent-item-icon">{getInitials(bookmark.title)}</span>
            <span className="recent-item-title">{bookmark.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}