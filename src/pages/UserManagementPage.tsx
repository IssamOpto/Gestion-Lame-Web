import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { getUsers, saveUsers, User, UserRole } from '../data/users';
import UserTable from '../components/features/users/UserTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import UserForm from '../components/features/users/UserForm';
import Input from '../components/ui/Input';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [distributors, setDistributors] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState('');
  const [loggedInUserRole, setLoggedInUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const allUsers = getUsers();
    setUsers(allUsers);
    setDistributors(allUsers.filter(user => user.role === 'Distributeur'));

    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      setLoggedInUserRole(loggedInUser.role);
    }
  }, []);

  const handleOpenModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSaveUser = (userToSave: User) => {
    let updatedUsers;
    if (selectedUser) {
      // We are in edit mode.
      // The user might have changed the ID. We need to replace the user with the original ID.
      updatedUsers = users.map(u => (u.id === selectedUser.id ? userToSave : u));
    } else {
      // We are in create mode.
      updatedUsers = [...users, userToSave];
    }
    
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    handleCloseModal();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
    }
  };

  const handleStatusChange = (userToUpdate: User, newStatus: 'Actif' | 'Inactif') => {
    const updatedUsers = users.map(user => 
      user.id === userToUpdate.id ? { ...user, statut: newStatus } : user
    );
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(filter.toLowerCase()) ||
    user.prenom.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase()) ||
    user.login.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion Client</h1>
        <Button onClick={() => handleOpenModal()}>
          <UserPlus className="mr-2" size={20} />
          Nouveau Utilisateur
        </Button>
      </div>
      <div className="mb-4">
        <Input
          id="filter"
          label="Filtrer les utilisateurs"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer par nom, prénom, email ou login"
        />
      </div>
      <UserTable 
        users={filteredUsers} 
        onEdit={handleOpenModal} 
        onDelete={handleDeleteUser} 
        onStatusChange={handleStatusChange}
        allUsers={users}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedUser ? 'Modifier Utilisateur' : 'Nouveau Utilisateur'}
      >
        <UserForm 
          user={selectedUser}
          onSave={handleSaveUser} 
          onCancel={handleCloseModal} 
          distributors={distributors}
          loggedInUserRole={loggedInUserRole}
        />
      </Modal>
    </div>
  );
};

export default UserManagementPage;