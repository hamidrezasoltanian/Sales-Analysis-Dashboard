
const DB_NAME = 'UnifiedDashboardDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_settings';
const BG_IMAGE_KEY = 'background_image';

const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject("Error opening IndexedDB: " + request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
};

export const saveBackgroundImage = async (imageFile: File): Promise<void> => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(imageFile, BG_IMAGE_KEY);
        transaction.oncomplete = () => {
            db.close();
            resolve();
        };
        transaction.onerror = () => {
            db.close();
            reject("Error saving image to IndexedDB: " + transaction.error);
        };
    });
};

export const getBackgroundImage = async (): Promise<File | undefined> => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(BG_IMAGE_KEY);
        transaction.oncomplete = () => {
            db.close();
            resolve(request.result);
        };
        transaction.onerror = () => {
            db.close();
            reject("Error getting image from IndexedDB: " + transaction.error);
        };
    });
};

export const deleteBackgroundImage = async (): Promise<void> => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(BG_IMAGE_KEY);
        transaction.oncomplete = () => {
            db.close();
            resolve();
        };
        transaction.onerror = () => {
            db.close();
            reject("Error deleting image from IndexedDB: " + transaction.error);
        };
    });
};