import React from 'react';
import { Link } from 'react-router-dom';
import { usePatientContext } from '../context/PatientContext';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

const DashboardPage: React.FC = () => {
  const { patients, loading } = usePatientContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Patient Dashboard</h1>
      {patients.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500">
            No patients found. <Link to="/new" className="text-primary hover:underline">Add a new patient</Link> to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(patient => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <Link to={`/patient/${patient.id}`}>
                <h2 className="text-xl font-semibold text-primary">{patient.name}</h2>
                <p className="text-gray-600">DOB: {patient.dob}</p>
                <p className="text-gray-600">Contact: {patient.contact}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
