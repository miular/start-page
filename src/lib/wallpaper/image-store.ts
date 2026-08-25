export type UploadedWallpaperMeta = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: number;
};

type WallpaperRecord = UploadedWallpaperMeta & {
  blob: Blob;
};

const DB_NAME = "start-page";
const STORE_NAME = "wallpapers";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveWallpaperImage(file: File): Promise<UploadedWallpaperMeta> {
  const id = crypto.randomUUID();
  const record: WallpaperRecord = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    createdAt: Date.now(),
    blob: file,
  };
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).add(record);
    tx.oncomplete = () => resolve({ id, name: record.name, type: record.type, size: record.size, createdAt: record.createdAt });
    tx.onerror = () => reject(tx.error);
  });
}

export async function listWallpaperImages(): Promise<UploadedWallpaperMeta[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => {
      const records = (request.result as WallpaperRecord[]) ?? [];
      resolve(records.map(({ blob: _, ...meta }) => meta));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getWallpaperBlob(id: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => {
      const record = request.result as WallpaperRecord | undefined;
      resolve(record?.blob ?? null);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteWallpaperImage(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}