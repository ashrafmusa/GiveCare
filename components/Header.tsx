import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const navLinkClasses = "text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  
  return (
    <header className="bg-primary shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Patient Records
        </Link>
        <div className="flex items-center space-x-4">
          <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? 'bg-primary-dark' : ''}`}>
            About
          </NavLink>
          <Link to="/new" className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium">
            Add New Patient
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;