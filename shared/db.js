// ===== SHARED DATABASE (VERSI SIMPLE) =====

const DB_NAME = "ecosystem_db";
const DB_VERSION = 1;

let db = null;

// 🔹 buka database
export function initDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // 🧱 "lemari data"
      if (!database.objectStoreNames.contains("transactions")) {
        database.createObjectStore("transactions", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("habits")) {
        database.createObjectStore("habits", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("journal_entries")) {
        database.createObjectStore("journal_entries", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("ideas")) {
        database.createObjectStore("ideas", { keyPath: "id" });
      }
    };
  });
}

// 🔹 simpan data
export async function saveData(storeName, data) {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    const item = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...data,
    };

    const req = store.add(item);

    req.onsuccess = () => resolve(item);
    req.onerror = () => reject(req.error);
  });
}

// 🔹 ambil semua data
export async function getAllData(storeName) {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);

    const req = store.getAll();

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
