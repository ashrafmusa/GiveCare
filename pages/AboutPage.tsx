import React from 'react';
import { Card } from '../components/ui/Card';

const AboutPage: React.FC = () => {
  return (
    <Card>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary border-b pb-2">About This Application</h1>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            This application is proudly **Open Source and Free of Charge**. Its primary aim is to support the dedicated healthcare workers in Sudan and other developing countries by providing a reliable, offline-first tool for patient management.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Data Privacy & User Responsibility</h2>
          <p className="text-gray-700 leading-relaxed">
            We are deeply committed to patient privacy and data security. To uphold this, please be aware of the following principles:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
            <li>
              <strong>No Data Collection:</strong> This application does not collect, transmit, or store any user or patient data on any central servers. All information entered is stored exclusively on your local device's secure storage.
            </li>
            <li>
              <strong>User Responsibility:</strong> All data entered into this application is the sole responsibility of the user. You are responsible for the management, security, and backup of the data on your device.
            </li>
            <li>
              <strong>Patient Consent:</strong> It is your ethical and professional responsibility to ensure you have obtained the necessary consent before entering or exposing any patient data.
            </li>
          </ul>
        </section>
        
        <p className="text-center text-gray-500 italic pt-4">
          Thank you for your service and for using this tool responsibly.
        </p>
      </div>
    </Card>
  );
};

export default AboutPage;
