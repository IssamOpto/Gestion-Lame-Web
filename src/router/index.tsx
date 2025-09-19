import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import UserManagementPage from '../pages/UserManagementPage';
import LotManagementPage from '../pages/LotManagementPage';
import ClientDashboardPage from '../pages/ClientDashboardPage';
import DistributorDashboardPage from '../pages/DistributorDashboardPage';
import DistributorAccountManagementPage from '../pages/DistributorAccountManagementPage';
import DistributorClientManagementPage from '../pages/DistributorClientManagementPage';
import DistributorSalesTrackingPage from '../pages/DistributorSalesTrackingPage';
import ClientAccountManagementPage from '../pages/ClientAccountManagementPage';

const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      console.log('isAuthenticated user role:', parsedUser.role);
      return parsedUser.isLoggedIn === true;
    } catch (e) {
      return false;
    }
  }
  return false;
};

const ProtectedLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/lots" replace />,
      },
      {
        path: 'users',
        element: <UserManagementPage />,
      },
      {
        path: 'lots',
        element: <LotManagementPage />,
      },
      {
        path: 'client-dashboard',
        element: <ClientDashboardPage />,
      },
      {
        path: 'client-account-management',
        element: <ClientAccountManagementPage />,
      },
      {
        path: 'distributor-dashboard',
        element: <DistributorDashboardPage />,
        children: [
          {
            index: true,
            element: <Navigate to="account" replace />,
          },
          {
            path: 'account',
            element: <DistributorAccountManagementPage />,
          },
          {
            path: 'clients',
            element: <DistributorClientManagementPage />,
          },
          {
            path: 'sales',
            element: <DistributorSalesTrackingPage />,
          },
        ],
      },
    ],
  },
]);