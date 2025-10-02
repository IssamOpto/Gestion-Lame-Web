import React, { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Clipboard, Check, RefreshCw } from 'lucide-react';
import { updateLotUsage, Lot } from '../../../data/lots';
import { User } from '../../../data/users';

interface ActivationCodeGeneratorProps {
  currentUser: User | null;
  loadUserSeries: (client: User) => void;
}

const ActivationCodeGenerator: React.FC<ActivationCodeGeneratorProps> = ({ currentUser, loadUserSeries }) => {
  const [lotToValidate, setLotToValidate] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
      loadUserSeries(currentUser); // Refresh the lot table
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

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Génération d’un Code d’Activation</h2>
      
      <div className="flex items-end space-x-[10px]">
          <div className="flex-grow">
              <Input
                  id="lot-to-validate"
                  label="Numéro de Série"
                  type="text"
                  placeholder="Saisir ou scanner le numéro de série"
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
              {copied ? <Check className="mr-2" size={16} /> : <Clipboard size={16} />}
              {copied ? 'Copié!' : 'Copier'}
          </Button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ActivationCodeGenerator;
