import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Package, LogOut, User, ShoppingBag, Settings } from 'lucide-react';

interface UserData {
  isLoggedIn: boolean;
  username: string;
  role: string;
}

const Sidebar: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData: UserData = JSON.parse(userDataString);
      setUserRole(userData.role);
    }
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-blue-100'
    }`;

  return (
    <div className="w-64 h-screen bg-gray-100 border-r p-4 flex flex-col fixed top-0 left-0">
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold">
          {userRole === 'Administrateur' && 'Espace Administrateur'}
          {userRole === 'Distributeur' && 'Espace Distributeur'}
          {userRole === 'Client' && 'Espace Client'}
          {!userRole && 'Chargement...'}
        </h1>
      </div>
      <nav className="space-y-2 flex-grow">
        {userRole === 'Administrateur' && (
          <>
            <NavLink to="/users" className={navLinkClasses}>
              <Users className="mr-3" size={20} />
              Gestion Client
            </NavLink>
            <NavLink to="/lots" className={navLinkClasses}>
              <Package className="mr-3" size={20} />
              Gestion Num Séries
            </NavLink>
          </>
        )}
        {userRole === 'Distributeur' && (
          <>
            <NavLink to="/distributor-dashboard/account" className={navLinkClasses}>
              <Settings className="mr-3" size={20} />
              Gestion de Compte
            </NavLink>
            <NavLink to="/distributor-dashboard/clients" className={navLinkClasses}>
              <Users className="mr-3" size={20} />
              Gestion Client
            </NavLink>
            <NavLink to="/distributor-dashboard/sales" className={navLinkClasses}>
              <ShoppingBag className="mr-3" size={20} />
              Suivi des Ventes
            </NavLink>
          </>
        )}
        {userRole === 'Client' && (
          <>
            <NavLink to="/client-account-management" className={navLinkClasses}>
              <Settings className="mr-3" size={20} />
              Gestion de Compte
            </NavLink>
            <NavLink to="/client-dashboard" className={navLinkClasses}>
              <Package className="mr-3" size={20} />
              Gestion Des Lames
            </NavLink>
          </>
        )}
      </nav>
      <div className="mt-auto">
        <NavLink to="/login" className={navLinkClasses}>
          <LogOut className="mr-3" size={20} />
          Déconnexion
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
