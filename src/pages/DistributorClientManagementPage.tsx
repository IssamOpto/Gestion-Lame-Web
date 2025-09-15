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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [filter, setFilter] = useState('');
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      setDistributorId(loggedInUser.id); // Assuming 'id' is stored in localStorage for the logged-in user
      setLoggedInUserRole(loggedInUser.role);
    }
  }, []);

  useEffect(() => {
    if (distributorId) {
      const allUsers = getUsers();
      const distributorClients = allUsers.filter(user => 
        user.role === 'Client' && user.distributeurAssocie === distributorId
      );
      setClients(distributorClients);
    }
  }, [distributorId, isModalOpen]); // Re-fetch clients when modal closes (after save/cancel)

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
      const allUsers = getUsers();
      const updatedUsers = allUsers.filter(user => user.id !== clientId);
      saveUsers(updatedUsers);
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    }
  };

  const handleSaveClient = (client: User) => {
    const allUsers = getUsers();
    let updatedUsers: User[];
    if (selectedClient) {
      // Update existing client
      updatedUsers = allUsers.map(u => u.id === client.id ? client : u);
    } else {
      // Add new client
      updatedUsers = [...allUsers, { ...client, id: `client_${Date.now()}`, role: 'Client', distributeurAssocie: distributorId || '' }];
    }
    saveUsers(updatedUsers);
    setIsModalOpen(false);
    // Re-fetch clients to update the table
    if (distributorId) {
      const newClients = updatedUsers.filter(user => 
        user.role === 'Client' && user.distributeurAssocie === distributorId
      );
      setClients(newClients);
    }
  };

  const handleStatusChange = (clientToUpdate: User, newStatus: 'Actif' | 'Inactif') => {
    const allUsers = getUsers();
    const updatedUsers = allUsers.map(user => 
      user.id === clientToUpdate.id ? { ...user, statut: newStatus } : user
    );
    saveUsers(updatedUsers);
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientToUpdate.id ? { ...client, statut: newStatus } : client
      )
    );
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
      <h1 className="text-3xl font-bold mb-6">Gestion Client Distributeur</h1>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handleAddClient}>
          <Plus className="mr-2" size={20} />
          Nouveau Client
        </Button>
        <Input
          id="client-filter"
          type="text"
          placeholder="Filtrer les clients..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-1/3"
        />
      </div>
      <UserTable 
        users={filteredClients} 
        onEdit={handleEditClient} 
        onDelete={handleDeleteClient} 
        onStatusChange={handleStatusChange}
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
