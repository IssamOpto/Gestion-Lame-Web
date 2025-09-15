import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Package } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-blue-100'
    }`;

  return (
    <div className="w-64 h-screen bg-gray-100 border-r p-4">
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold">Administrateur</h1>
      </div>
      <nav className="space-y-2">
        <NavLink to="/users" className={navLinkClasses}>
          <Users className="mr-3" size={20} />
          Gestion Client
        </NavLink>
        <NavLink to="/lots" className={navLinkClasses}>
          <Package className="mr-3" size={20} />
          Gestion des Lots
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
