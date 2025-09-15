import React, { useState, useEffect } from 'react';
import sha256 from 'crypto-js/sha256';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { updateLotUsage } from '../data/lots'; // Import updateLotUsage

interface GeneratedCodeEntry {
  lotNumber: string;
  activationCode: string;
  activationDate: string;
}

const ClientDashboardPage: React.FC = () => {
  const [lotCodeInput, setLotCodeInput] = useState<string>('');
  const [generatedSecretCode, setGeneratedSecretCode] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedCodeEntry[]>(() => {
    // Load history from localStorage on initial render
    const savedHistory = localStorage.getItem('generatedCodesHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('generatedCodesHistory', JSON.stringify(history));
  }, [history]);

  const SECRET_ADMIN_KEY = 'YOUR_ADMIN_SOFTWARE_SERIAL_KEY'; // This should ideally come from user context or environment variables

  const handleGenerateSecretCode = () => {
    console.log('handleGenerateSecretCode called');
    try {
      if (!lotCodeInput.trim()) {
        alert('Veuillez saisir un numéro de lot.');
        console.log('Lot code input is empty.');
        return;
      }

      // Check if the lot number is already in history (activated by this user)
      if (history.some(entry => entry.lotNumber === lotCodeInput.trim())) {
        alert('Ce numéro de lot a déjà été activé par vous.');
        console.log('Lot code already activated by this user.');
        return;
      }

      const SECRET_ADMIN_KEY = 'YOUR_ADMIN_SOFTWARE_SERIAL_KEY'; // This should ideally come from user context or environment variables
      console.log('Lot code input:', lotCodeInput.trim());
      console.log('Secret Admin Key:', SECRET_ADMIN_KEY);

      const hash = sha256(lotCodeInput.trim() + SECRET_ADMIN_KEY).toString().substring(0, 8).toUpperCase();
      console.log('Generated hash:', hash);

      const newActivationCode = `${lotCodeInput.trim()}-${hash}`;
      console.log('New activation code:', newActivationCode);

      const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

      // Fetch the full user object to get client's full name and distributorAssocie
      const allUsers = JSON.parse(localStorage.getItem('optoscopia_users') || '[]');
      const fullUser = allUsers.find((user: any) => user.login === loggedInUser.username);

      const currentClientName = fullUser ? `${fullUser.prenom} ${fullUser.nom}` : "Client Inconnu"; // Get actual client's full name

      let currentDistributorName = "Non assigné";
      if (fullUser?.distributeurAssocie) {
        const distributorUser = allUsers.find((user: any) => user.id === fullUser.distributeurAssocie && user.role === 'Distributeur');
        if (distributorUser) {
          currentDistributorName = `${distributorUser.prenom} ${distributorUser.nom}`;
        }
      }

      const currentActivationDate = new Date().toISOString();

      const newEntry: GeneratedCodeEntry = {
        lotNumber: lotCodeInput.trim(),
        activationCode: newActivationCode,
        activationDate: new Date().toLocaleString(),
      };

      setGeneratedSecretCode(newActivationCode);
      setHistory(prevHistory => [...prevHistory, newEntry]);
      setLotCodeInput(''); // Clear input after generation

      // Update the global lots data
      updateLotUsage(lotCodeInput.trim(), currentClientName, fullUser?.distributeurAssocie || "", currentActivationDate);

      console.log('Code generated and state updated successfully.');

    } catch (error) {
      console.error('Error during handleGenerateSecretCode:', error);
      alert('Une erreur est survenue lors de la génération du code. Veuillez consulter la console pour plus de détails.');
    }
  };

  const handleCopyCode = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        alert('Code copié dans le presse-papiers !');
        setGeneratedSecretCode(null); // Clear the displayed code after copying
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Échec de la copie du code.');
      });
  };

  const handleDeleteEntry = (lotNumberToDelete: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'entrée pour le lot ${lotNumberToDelete} ?`)) {
      setHistory(prevHistory => prevHistory.filter(entry => entry.lotNumber !== lotNumberToDelete));
    }
  };

  const filteredHistory = history.filter(entry =>
    entry.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.activationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.activationDate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-10 px-4 w-full">
      <div className="w-full">
        

        {/* Activation des lames de comptage */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Activation des lames de comptage</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
            <div className="flex-grow w-full">
              <Input
                id="lotCode"
                placeholder="Numéro de lot"
                value={lotCodeInput}
                onChange={(e) => setLotCodeInput(e.target.value)}
                required
              />
            </div>
            <div className="w-full sm:w-40 flex-shrink-0">
              <Button onClick={handleGenerateSecretCode} variant="primary" size="md" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Générer
              </Button>
            </div>
          </div>

          {/* Generated Secret Code Display */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
            <div className="flex-grow w-full">
              <Input
                id="generatedCodeDisplay"
                placeholder="Code Secret"
                value={generatedSecretCode || ''} // Always display, even if empty
                readOnly
                disabled // Make it look non-editable
              />
            </div>
            <div className="w-full sm:w-40 flex-shrink-0">
              <Button
                onClick={() => handleCopyCode(generatedSecretCode || '')}
                variant="success" // Green color
                size="md" // Same size as generate button
                className="w-full"
                disabled={!generatedSecretCode} // Disable if no code is generated
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copier
              </Button>
            </div>
          </div>
        </div>

        

        {/* Suivi des codes générés */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Suivi des codes générés</h2>
          <div className="mb-4">
            <Input
              id="search"
              placeholder="Rechercher par numéro de lot, code ou date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {history.length === 0 ? (
            <p className="text-gray-600 text-center">Aucun code généré pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-center">Numéro de lot</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-center">Code d'activation</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-center">Date d'activation</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{entry.lotNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <span className="break-all">{entry.activationCode}</span>
                          <Button
                            onClick={() => handleCopyCode(entry.activationCode)}
                            variant="secondary"
                            size="sm"
                            className="p-1 text-xs"
                          >
                            Copier
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{entry.activationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <Button
                          onClick={() => handleDeleteEntry(entry.lotNumber)}
                          variant="danger"
                          size="sm"
                          className="p-1 text-xs"
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;