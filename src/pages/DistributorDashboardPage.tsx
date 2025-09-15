import React from 'react';
import { Outlet } from 'react-router-dom';

const DistributorDashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Espace Distributeur</h1>
      <div className="mt-6">
        <Outlet /> {/* This is where child routes will render */}
      </div>
    </div>
  );
};

export default DistributorDashboardPage;
