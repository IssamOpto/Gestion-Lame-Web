import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { getUsers, saveUsers, User } from '../data/users';
import UserTable from '../components/features/users/UserTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import UserForm from '../components/features/users/UserForm';
import Input from '../components/ui/Input';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setUsers(getUsers());
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
    const updatedUsers = userToSave.id && users.some(u => u.id === userToSave.id)
      ? users.map(u => (u.id === userToSave.id ? userToSave : u))
      : [...users, userToSave];
    
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
        />
      </Modal>
    </div>
  );
};

export default UserManagementPage;