import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePatientContext } from '../context/PatientContext';
import { Patient } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

const calculateAge = (dobString: string) => {
  if (!dobString) return '';
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const PatientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPatientById, deletePatient } = usePatientContext();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const patientData = await getPatientById(Number(id));
          if (patientData) {
            setPatient(patientData);
          } else {
            navigate('/');
          }
        } catch (error) {
            console.error("Failed to fetch patient", error);
            navigate('/');
        } finally {
            setLoading(false);
        }
      }
    };
    fetchPatient();
  }, [id, getPatientById, navigate]);

  const handleDelete = async () => {
      if (patient && window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
          try {
              await deletePatient(patient.id);
              navigate('/');
          } catch(error) {
              console.error('Failed to delete patient', error);
          }
      }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!patient) {
    return (
        <Card>
            <p className="text-center text-gray-500">Patient not found.</p>
        </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold mb-2">{patient.name}</h1>
            <p className="text-gray-600"><strong>Age:</strong> {calculateAge(patient.dob)} years old</p>
            <p className="text-gray-600"><strong>DOB:</strong> {patient.dob}</p>
            <p className="text-gray-600"><strong>Gender:</strong> {patient.gender}</p>
            <p className="text-gray-600"><strong>Contact:</strong> {patient.contact}</p>
            <p className="text-gray-600"><strong>Address:</strong> {patient.address}</p>
        </div>
        <div className="flex space-x-2">
            <Link to={`/patient/${patient.id}/edit`}>
                <Button variant="secondary">Edit</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-semibold">Medical History</h2>
        <p className="text-gray-700 mt-2 whitespace-pre-wrap">{patient.medicalHistory || 'No medical history recorded.'}</p>
      </div>
    </Card>
  );
};

export default PatientProfilePage;