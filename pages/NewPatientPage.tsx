import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientContext } from '../context/PatientContext';
import { Patient } from '../types';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const NewPatientPage: React.FC = () => {
  const [patient, setPatient] = useState<Omit<Patient, 'id' | 'syncStatus' | 'lastModified'>>({
    name: '',
    dob: '',
    gender: 'Male',
    contact: '',
    address: '',
    medicalHistory: '',
  });
  const { addPatient } = usePatientContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addPatient(patient);
      navigate('/');
    } catch (error) {
      console.error("Failed to add patient", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Add New Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="name" name="name" label="Full Name" value={patient.name} onChange={handleChange} required />
        <Input id="dob" name="dob" label="Date of Birth" type="date" value={patient.dob} onChange={handleChange} required />
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select id="gender" name="gender" value={patient.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <Input id="contact" name="contact" label="Contact Number" value={patient.contact} onChange={handleChange} required />
        <Input id="address" name="address" label="Address" value={patient.address} onChange={handleChange} required />
        <div>
          <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Medical History</label>
          <textarea id="medicalHistory" name="medicalHistory" value={patient.medicalHistory} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required></textarea>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Patient'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default NewPatientPage;
