import { openDB } from "../db.js";

export async function addTransaction(data) {
  const db = await openDB();

  const tx = db.transaction("transactions", "readwrite");
  const store = tx.objectStore("transactions");

  const item = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data,
  };

  store.add(item);
  return item;
}

export async function getAllTransactions() {
  const db = await openDB();

  const tx = db.transaction("transactions", "readonly");
  const store = tx.objectStore("transactions");

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}
