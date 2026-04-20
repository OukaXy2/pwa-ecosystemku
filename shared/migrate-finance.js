import { openDB } from "./db.js";
import { addTransaction } from "./repositories/financeRepo.js";

const MIGRATION_KEY = "finance_migrated_v1";

function isMigrated() {
  return localStorage.getItem(MIGRATION_KEY) === "true";
}

function setMigrated() {
  localStorage.setItem(MIGRATION_KEY, "true");
}

// buka DB lama kamu
function openOldDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("cuci_money_db"); // ⚠️ sesuaikan nama DB lama
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getOldTransactions(db) {
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains("transactions")) {
      return resolve([]);
    }

    const tx = db.transaction("transactions", "readonly");
    const store = tx.objectStore("transactions");

    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function migrateFinance() {
  if (isMigrated()) {
    console.log("Finance already migrated");
    return;
  }

  console.log("Migrating finance...");

  const oldDB = await openOldDB();
  const oldData = await getOldTransactions(oldDB);

  for (const trx of oldData) {
    await addTransaction(trx);
  }

  setMigrated();

  console.log("Migration done ✅");
}
