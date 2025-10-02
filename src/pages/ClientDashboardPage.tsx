import React, { useState, useEffect } from 'react';
import { getLots, Lot } from '../data/lots';
import { getUsers, User } from '../data/users';
import ActivationCodeGenerator from '../components/features/client/ActivationCodeGenerator';
import UsedLotsTable from '../components/features/client/UsedLotsTable';

const ClientDashboardPage: React.FC = () => {
  const [userSeries, setUserSeries] = useState<Lot[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loadUserSeries = (client: User) => {
    const clientName = `${client.prenom} ${client.nom}`;
    const allSeries = getLots();
    const seriesForUser = allSeries.filter(lot => lot.clientUtilisateur === clientName);
    setUserSeries(seriesForUser);
  };

  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      const allUsers = getUsers();
      const client = allUsers.find(u => u.login === loggedInUser.username && u.role === 'Client');
      
      if (client) {
        setCurrentUser(client);
        loadUserSeries(client);
      }
    }
  }, []);

  if (!currentUser) {
    return <div className="p-6">Chargement des données utilisateur...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <ActivationCodeGenerator currentUser={currentUser} loadUserSeries={loadUserSeries} />
      <UsedLotsTable userSeries={userSeries} />
    </div>
  );
};

export default ClientDashboardPage;
