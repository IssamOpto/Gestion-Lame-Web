import React, { useState, useEffect } from 'react';
import { Plus, FileOutput, FilePlus } from 'lucide-react';
import { getLots, saveLots, generateLots, Lot } from '../data/lots';
import LotTable from '../components/features/lots/LotTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import LotGenerationForm from '../components/features/lots/LotGenerationForm';
import ExportExcelModal from '../components/features/lots/ExportExcelModal';
import Input from '../components/ui/Input';

const LotManagementPage: React.FC = () => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  // Function to load lots from localStorage
  const loadLots = () => {
    setLots(getLots());
  };

  useEffect(() => {
    loadLots();

    // Listen for changes in localStorage from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'optoscopia_lots') { // Assuming LOTS_STORAGE_KEY is 'optoscopia_lots'
        loadLots();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const getLastCartonNumber = () => {
    if (lots.length === 0) return 0;
    const maxCarton = Math.max(...lots.map(l => parseInt(l.numeroCarton, 10)));
    return maxCarton;
  };

  const handleGenerateLots = (carton: number, annee: number, nombreBoites: number) => {
    const anneeStr = annee.toString().slice(-2);
    const cartonStr = carton.toString().padStart(4, '0');
    const existingLot = lots.find(lot => lot.numeroCarton === cartonStr && lot.annee === anneeStr);
    if (existingLot) {
      alert('Ce numéro de carton existe déjà pour cette année.');
      return;
    }

    const newLots = generateLots(carton, annee, nombreBoites);
    const updatedLots = [...lots, ...newLots];
    setLots(updatedLots);
    saveLots(updatedLots);
    setIsGenerateModalOpen(false);
  };

  const handleDeleteLot = (lotId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lot ?")) {
      const updatedLots = lots.filter(l => l.id !== lotId);
      setLots(updatedLots);
      saveLots(updatedLots);
    }
  };
  
  const handleToggleStatus = (lotId: string, newStatus: 'Actif' | 'Inactif') => {
    const updatedLots = lots.map(lot =>
      lot.id === lotId ? { ...lot, statut: newStatus } : lot
    );
    setLots(updatedLots);
    saveLots(updatedLots);
  };
  
  

  const filteredLots = lots.filter(lot =>
    lot.id.toLowerCase().includes(filter.toLowerCase()) ||
    (lot.clientUtilisateur && lot.clientUtilisateur.toLowerCase().includes(filter.toLowerCase())) ||
    (lot.distributeurAssocie && lot.distributeurAssocie.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Gestion des Lots</h1>
        <div className="flex space-x-3">
          <Button onClick={() => setIsGenerateModalOpen(true)} size="lg">
            <FilePlus className="mr-2" size={20} />
            Générer Numéro de Lot
          </Button>
          <Button variant="success" onClick={() => setIsExportModalOpen(true)} size="lg">
            <FileOutput className="mr-2" size={20} />
            Exporter Excel
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          id="filter"
          label="Filtrer les lots"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer par numéro de lot, client ou distributeur"
        />
      </div>

      <div className="overflow-x-auto">
        <LotTable 
          lots={filteredLots} 
          onDelete={handleDeleteLot}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Générer des Nouveaux Lots"
      >
        <LotGenerationForm
          onGenerate={handleGenerateLots}
          onCancel={() => setIsGenerateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Exporter les Lots en Excel"
      >
        <ExportExcelModal lots={lots} onClose={() => setIsExportModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default LotManagementPage;