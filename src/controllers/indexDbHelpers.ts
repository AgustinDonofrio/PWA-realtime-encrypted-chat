const DB_NAME = "blueCryptDB";

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      console.log("[x] Creating storage bucket...");

      // Verifica y crea almacenes si no existen
      if (!db.objectStoreNames.contains("auth")) {
        db.createObjectStore("auth", { keyPath: "fbase_key" });
      }
      if (!db.objectStoreNames.contains("messages")) {
        db.createObjectStore("messages", {
          keyPath: "id",
        });
      }
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = (event: any) => {
      console.log("[✔] DB opened successfuly");
      resolve(event.target.result);
    };

    request.onerror = (event: any) => {
      console.error("[X] Error to get DB", event.target.error);
      reject(event.target.error);
    };
  });
};

export const saveToIndexedDB = async (storeName: string, data: any) => {
  if (!data.id) {
    console.error("Error: data needs id", data);
    return;
  }

  const db = await openDatabase();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  store.put(data);
};

export const getFromIndexedDB = (storeName: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const getAll = store.getAll();
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    };
  });
};

export const deleteFromIndexedDB = (storeName: string) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onsuccess = (event: any) => {
    const db = event.target.result;
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.clear();
  };
};
