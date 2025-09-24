import { Patient } from '../types';

const DB_NAME = 'PatientDB';
const DB_VERSION = 1;
const STORE_NAME = 'patients';

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(false);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const addPatient = (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(patient);

        request.onsuccess = () => {
            const newPatient = { ...patient, id: request.result as number };
            resolve(newPatient);
        };

        request.onerror = () => {
            console.error('Error adding patient:', request.error);
            reject(request.error);
        };
    });
};

export const getAllPatients = (): Promise<Patient[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error getting all patients:', request.error);
      reject(request.error);
    };
  });
};

export const getPendingPatients = (): Promise<Patient[]> => {
  return new Promise((resolve, reject) => {
    getAllPatients().then(allPatients => {
      const pending = allPatients.filter(p => p.syncStatus === 'pending');
      resolve(pending);
    }).catch(reject);
  });
};


export const getPatientById = (id: number): Promise<Patient | undefined> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error getting patient by id:', request.error);
      reject(request.error);
    };
  });
};

export const updatePatient = (patient: Patient): Promise<Patient> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(patient);

    request.onsuccess = () => {
      resolve(patient);
    };

    request.onerror = () => {
      console.error('Error updating patient:', request.error);
      reject(request.error);
    };
  });
};

export const deletePatient = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      console.error('Error deleting patient:', request.error);
      reject(request.error);
    };
  });
};