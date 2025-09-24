import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Patient } from '../types';
import * as db from '../utils/db';
import toast from 'react-hot-toast';

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  pendingCount: number;
  addPatient: (patient: Omit<Patient, 'id' | 'syncStatus' | 'lastModified'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  getPatientById: (id: number) => Promise<Patient | undefined>;
  syncData: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPendingCount = useCallback(async () => {
    const pendingPatients = await db.getPendingPatients();
    setPendingCount(pendingPatients.length);
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
        await refreshPendingCount();
    } catch (error) {
        console.error("Failed to refresh data", error);
        toast.error("Could not load patient data.");
    }
  }, [refreshPendingCount]);


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await db.initDB();
        await refreshAllData();
      } catch (error) {
        console.error("Failed to load patients from DB", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refreshAllData]);

  const addPatient = async (patient: Omit<Patient, 'id' | 'syncStatus' | 'lastModified'>) => {
    const patientWithSyncData = {
      ...patient,
      syncStatus: 'pending' as const,
      lastModified: new Date().toISOString(),
    };
    const newPatient = await db.addPatient(patientWithSyncData);
    setPatients(prev => [...prev, newPatient]);
    setPendingCount(prev => prev + 1);
    toast.success("Patient added successfully!");
  };

  const updatePatient = async (patient: Patient) => {
    const updatedPatient = {
      ...patient,
      syncStatus: 'pending' as const,
      lastModified: new Date().toISOString(),
    };
    await db.updatePatient(updatedPatient);
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    await refreshPendingCount(); // Recalculate as an existing 'synced' patient is now 'pending'
    toast.success("Patient updated successfully!");
  };

  const deletePatient = async (id: number) => {
    await db.deletePatient(id);
    setPatients(prev => prev.filter(p => p.id !== id));
    await refreshPendingCount(); // A pending patient might have been deleted
    toast.success("Patient deleted successfully!");
  };
  
  const getPatientById = async (id: number) => {
      return db.getPatientById(id);
  }

  const syncData = async () => {
      const pendingPatients = await db.getPendingPatients();
      if (pendingPatients.length === 0) {
          toast.success("All data is already synced!");
          return;
      }

      const toastId = toast.loading(`Syncing ${pendingPatients.length} records...`);

      // --- SIMULATE API CALL ---
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, you would POST `pendingPatients` to your server here.
      // const response = await fetch('/api/sync', { method: 'POST', body: JSON.stringify(pendingPatients) });
      // if (!response.ok) { throw new Error("Sync failed"); }
      // --- END SIMULATION ---

      try {
        // On successful sync, update the local records to 'synced'
        for (const patient of pendingPatients) {
            const syncedPatient = { ...patient, syncStatus: 'synced' as const };
            await db.updatePatient(syncedPatient);
        }

        await refreshAllData();
        localStorage.setItem('lastSyncTime', new Date().toISOString());
        toast.success(`Successfully synced ${pendingPatients.length} records.`, { id: toastId });
      } catch (error) {
          console.error("Sync failed", error);
          toast.error("Data synchronization failed. Please try again.", { id: toastId });
      }
  }


  return (
    <PatientContext.Provider value={{ patients, loading, pendingCount, addPatient, updatePatient, deletePatient, getPatientById, syncData }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatientContext must be used within a PatientProvider');
  }
  return context;
};
