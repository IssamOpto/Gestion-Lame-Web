import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getUsers, saveUsers, User } from '../data/users';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import UserTable from '../components/features/users/UserTable'; // Reusing UserTable for now
import ClientForm from '../components/features/users/ClientForm'; // Will create this

const DistributorClientManagementPage: React.FC = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); // New state for all users
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [filter, setFilter] = useState('');
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchedUsers = getUsers();
    setAllUsers(fetchedUsers); // Set all users here

    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      setDistributorId(loggedInUser.id); // Assuming 'id' is stored in localStorage for the logged-in user
      setLoggedInUserRole(loggedInUser.role);
    }
  }, []);

  useEffect(() => {
    if (distributorId && allUsers.length > 0) { // Ensure allUsers is populated
      const distributorClients = allUsers.filter(user => 
        user.role === 'Client' && user.distributeurAssocie === distributorId
      );
      setClients(distributorClients);
    }
  }, [distributorId, isModalOpen, allUsers]); // Add allUsers to dependency array

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: User) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      const updatedUsers = allUsers.filter(user => user.id !== clientId);
      saveUsers(updatedUsers);
      setAllUsers(updatedUsers); // Update allUsers state after deletion
    }
  };

  const handleSaveClient = (client: User) => {
    let updatedUsers: User[];
    if (selectedClient) {
      // We are in edit mode.
      // The user might have changed the ID. We need to replace the user with the original ID.
      updatedUsers = allUsers.map(u => (u.id === selectedClient.id ? client : u));
    } else {
      // We are in create mode.
      updatedUsers = [...allUsers, { ...client, role: 'Client', distributeurAssocie: distributorId || '' }];
    }
    saveUsers(updatedUsers);
    setAllUsers(updatedUsers); // Update allUsers state after save
    setIsModalOpen(false);
  };

  const handleStatusChange = (clientToUpdate: User, newStatus: 'Actif' | 'Inactif') => {
    const updatedUsers = allUsers.map(user => 
      user.id === clientToUpdate.id ? { ...user, statut: newStatus } : user
    );
    saveUsers(updatedUsers);
    setAllUsers(updatedUsers); // Update allUsers state after status change
  };

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(filter.toLowerCase()) ||
    client.prenom.toLowerCase().includes(filter.toLowerCase()) ||
    client.login.toLowerCase().includes(filter.toLowerCase()) ||
    client.email.toLowerCase().includes(filter.toLowerCase()) ||
    client.pays.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion Client Distributeur</h1>
        <Button onClick={handleAddClient}>
          <Plus className="mr-2" size={20} />
          Nouveau Client
        </Button>
      </div>
      <div className="mb-4">
        <Input
          id="client-filter"
          label="Filtrer les clients"
          type="text"
          placeholder="Filtrer par nom, prénom, login, email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <UserTable 
        users={filteredClients} 
        onEdit={handleEditClient} 
        onDelete={handleDeleteClient} 
        onStatusChange={handleStatusChange}
        allUsers={allUsers} // Pass allUsers here
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedClient ? 'Modifier Client' : 'Nouveau Client'}
      >
        <ClientForm
          client={selectedClient}
          distributorId={distributorId || ''}
          onSave={handleSaveClient}
          onCancel={() => setIsModalOpen(false)}
          loggedInUserRole={loggedInUserRole}
        />
      </Modal>
    </div>
  );
};

export default DistributorClientManagementPage;
