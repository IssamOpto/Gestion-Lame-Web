import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/features/users/UserForm';
import { getUsers, saveUsers, User } from '../data/users';

const DistributorAccountManagementPage: React.FC = () => {
  const [distributor, setDistributor] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      const allUsers = getUsers();
      const currentDistributor = allUsers.find(u => u.login === loggedInUser.username && u.role === 'Distributeur');
      if (currentDistributor) {
        setDistributor(currentDistributor);
      } else {
        // Handle case where distributor not found or role mismatch
        navigate('/login'); // Redirect to login if not a valid distributor
      }
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  const handleSave = (updatedUser: User) => {
    const allUsers = getUsers();
    const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(updatedUsers);
    alert('Vos informations ont été mises à jour.');
    // Optionally update localStorage 'user' item to reflect changes if any relevant fields were changed
    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      localStorage.setItem('user', JSON.stringify({ ...loggedInUser, username: updatedUser.login, role: updatedUser.role }));
    }
  };

  const handleCancel = () => {
    navigate('/distributor-dashboard'); // Navigate back to the distributor dashboard
  };

  if (!distributor) {
    return <div className="p-6">Chargement des informations du distributeur...</div>;
  }

  return (
    <div className="p-6">
      <UserForm
        user={distributor}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default DistributorAccountManagementPage;
