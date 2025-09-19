import React, { useState, useEffect } from 'react';
import { getLots, updateLotUsage, Lot } from '../data/lots';
import { getUsers, User } from '../data/users';
import LotTable from '../components/features/lots/LotTable';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Clipboard, Check, RefreshCw } from 'lucide-react';

const ClientDashboardPage: React.FC = () => {
  const [userLots, setUserLots] = useState<Lot[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filter, setFilter] = useState('');
  const [lotToValidate, setLotToValidate] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const loadUserLots = (client: User) => {
    const clientName = `${client.prenom} ${client.nom}`;
    const allLots = getLots();
    const lotsForUser = allLots.filter(lot => lot.clientUtilisateur === clientName);
    setUserLots(lotsForUser);
  };

  useEffect(() => {
    const loggedInUserString = localStorage.getItem('user');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      const allUsers = getUsers();
      const client = allUsers.find(u => u.login === loggedInUser.username && u.role === 'Client');
      
      if (client) {
        setCurrentUser(client);
        loadUserLots(client);
      }
    }
  }, []);

  const handleGenerateCode = () => {
    setError('');
    setActivationCode('');
    if (!currentUser) {
      setError('Utilisateur non trouvé.');
      return;
    }

    const result = updateLotUsage(lotToValidate, currentUser, new Date().toISOString());

    if (result.success && result.validationCode) {
      setActivationCode(result.validationCode);
      setLotToValidate(''); // Clear input field
      loadUserLots(currentUser); // Refresh the lot table
    } else {
      setError(result.error || 'Erreur lors de la génération du code.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activationCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setActivationCode(''); // Clear the code after copying
    }, 2000);
  };

  const filteredLots = userLots.filter(lot =>
    lot.id.toLowerCase().includes(filter.toLowerCase())
  );

  if (!currentUser) {
    return <div className="p-6">Chargement des données utilisateur...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Génération d’un Code d’Activation</h2>
        
        <div className="flex items-end space-x-[10px]">
            <div className="flex-grow">
                <Input
                    id="lot-to-validate"
                    label="Numéro de Lot"
                    type="text"
                    placeholder="Saisir ou scanner le numéro de lot"
                    value={lotToValidate}
                    onChange={(e) => setLotToValidate(e.target.value)}
                />
            </div>
            <Button onClick={handleGenerateCode} className="w-40">
                <RefreshCw className="mr-2" size={16} />
                Générer
            </Button>
        </div>

        <div className="mt-4 flex items-end space-x-[10px]">
            <div className="flex-grow">
                <Input
                    id="activation-code"
                    label="code d'activation"
                    value={activationCode}
                    disabled
                />
            </div>
            <Button onClick={handleCopy} variant="success" className="w-40">
                {copied ? <Check className="mr-2" size={16} /> : <Clipboard className="mr-2" size={16} />}
                {copied ? 'Copié!' : 'Copier'}
            </Button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Vos Lots de Lames Utilisés</h2>
        <div className="mb-4">
          <Input
            id="filter"
            label="Filtrer vos lots"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrer par numéro de lot"
          />
        </div>
        <LotTable
          lots={filteredLots}
          onDelete={() => {}}
          showStatusColumn={false} // Hide status column for client view
          showActivationCodeColumn={true} // Show activation code column for client view
        />
      </div>
    </div>
  );
};

export default ClientDashboardPage;
