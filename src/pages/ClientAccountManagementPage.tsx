import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/features/users/UserForm';
import { getUsers, saveUsers, User, UserRole } from '../data/users';

const ClientAccountManagementPage: React.FC = () => {
  const [client, setClient] = useState<User | null>(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState<UserRole | null>(null);
  const [associatedDistributorName, setAssociatedDistributorName] = useState<string | null>(null); // New state
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      const allUsers = getUsers(); // Get all users here
      const currentClient = allUsers.find(u => u.login === loggedInUser.username && u.role === 'Client');
      if (currentClient) {
        setClient(currentClient);
        setLoggedInUserRole(loggedInUser.role);

        // Find the associated distributor's name
        if (currentClient.distributeurAssocie) {
          const distributor = allUsers.find(u => u.id === currentClient.distributeurAssocie && u.role === 'Distributeur');
          if (distributor) {
            setAssociatedDistributorName(`${distributor.nom} ${distributor.prenom}`);
          } else {
            setAssociatedDistributorName('Distributeur inconnu');
          }
        } else {
          setAssociatedDistributorName('Non associé');
        }

      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSave = (updatedUser: User) => {
    const allUsers = getUsers();
    const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(updatedUsers);
    alert('Vos informations ont été mises à jour.');
    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      localStorage.setItem('user', JSON.stringify({ ...loggedInUser, username: updatedUser.login, role: updatedUser.role }));
    }
  };

  const handleCancel = () => {
    navigate('/client-dashboard');
  };

  if (!client) {
    return <div className="p-6">Chargement de vos informations...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion de votre compte</h1>
      <UserForm
        user={client}
        onSave={handleSave}
        onCancel={handleCancel}
        disableRoleEditing={true}
        loggedInUserRole={loggedInUserRole} // Pass the loggedInUserRole
        associatedDistributorName={associatedDistributorName} // Pass the new prop
      />
    </div>
  );
};

export default ClientAccountManagementPage;
