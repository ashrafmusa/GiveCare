import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Patient } from '../types';
import * as db from '../utils/db';

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  getPatientById: (id: number) => Promise<Patient | undefined>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initDB();
        const allPatients = await db.getAllPatients();
        setPatients(allPatients);
      } catch (error) {
        console.error("Failed to load patients from DB", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addPatient = async (patient: Omit<Patient, 'id'>) => {
    const newPatient = await db.addPatient(patient);
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = async (patient: Patient) => {
    await db.updatePatient(patient);
    setPatients(prev => prev.map(p => p.id === patient.id ? patient : p));
  };

  const deletePatient = async (id: number) => {
    await db.deletePatient(id);
    setPatients(prev => prev.filter(p => p.id !== id));
  };
  
  const getPatientById = async (id: number) => {
      const patient = patients.find(p => p.id === id);
      if (patient) return patient;
      return db.getPatientById(id);
  }

  return (
    <PatientContext.Provider value={{ patients, loading, addPatient, updatePatient, deletePatient, getPatientById }}>
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
