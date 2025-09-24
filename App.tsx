import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PatientProvider } from './context/PatientContext';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import NewPatientPage from './pages/NewPatientPage';
import PatientProfilePage from './pages/PatientProfilePage';
import EditPatientPage from './pages/EditPatientPage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
  return (
    <PatientProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-gray-100 min-h-screen">
          <Header />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/new" element={<NewPatientPage />} />
              <Route path="/patient/:id" element={<PatientProfilePage />} />
              <Route path="/patient/:id/edit" element={<EditPatientPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </PatientProvider>
  );
};

export default App;