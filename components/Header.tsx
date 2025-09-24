import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { usePatientContext } from '../context/PatientContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Button } from './ui/Button';

const Header: React.FC = () => {
  const { pendingCount, syncData } = usePatientContext();
  const isOnline = useOnlineStatus();
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    setLastSyncTime(localStorage.getItem('lastSyncTime'));
  }, [pendingCount]); // Update when sync is complete

  const navLinkClasses = "text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  
  return (
    <header className="bg-primary shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          GiveCare
        </Link>
        <div className="flex items-center space-x-4">
          <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? 'bg-primary-dark' : ''}`}>
            About
          </NavLink>
          <Link to="/new" className="hidden sm:block text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium">
            Add New Patient
          </Link>
          <div className="flex items-center space-x-2">
            <Button onClick={syncData} disabled={!isOnline || pendingCount === 0} size="sm" variant="secondary" className="relative">
              Sync Data
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </Button>
            <div className="text-xs text-gray-300 hidden lg:block">
              {isOnline ? `Online` : `Offline`}
              {lastSyncTime && <div title={new Date(lastSyncTime).toLocaleString()}>Last sync: {new Date(lastSyncTime).toLocaleTimeString()}</div>}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
