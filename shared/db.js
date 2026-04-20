const DB_NAME = "ecosystem_db";
const DB_VERSION = 1;

let dbInstance = null;

export function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 🔥 CORE STORES
      if (!db.objectStoreNames.contains("transactions")) {
        db.createObjectStore("transactions", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("accounts")) {
        db.createObjectStore("accounts", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("habits")) {
        db.createObjectStore("habits", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("journal_entries")) {
        db.createObjectStore("journal_entries", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("ideas")) {
        db.createObjectStore("ideas", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("kv")) {
        db.createObjectStore("kv", { keyPath: "key" });
      }
    };
  });
}
