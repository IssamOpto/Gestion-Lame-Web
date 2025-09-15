import React, { useState, useEffect } from 'react';
import { getLots, saveLots, Lot } from '../data/lots';
import { User } from '../../data/users';
import SalesTrackingTable from '../components/features/distributors/SalesTrackingTable';
import Input from '../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../components/ui/Modal';

const DistributorSalesTrackingPage: React.FC = () => {
  const [allLots, setAllLots] = useState<Lot[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedLotForDetails, setSelectedLotForDetails] = useState<Lot | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loggedInDistributorId, setLoggedInDistributorId] = useState<string | null>(null);

  const loadLots = () => {
    setAllLots(getLots());
  };

  useEffect(() => {
    loadLots();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'optoscopia_lots') {
        loadLots();
      }
      if (event.key === 'user') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setLoggedInDistributorId(user.id || null);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Get logged-in distributor ID on initial load
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'Distributeur') {
      setLoggedInDistributorId(user.id);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteLot = (lotId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lot ?")) {
      const updatedLots = allLots.filter(l => l.id !== lotId);
      setAllLots(updatedLots);
      saveLots(updatedLots);
    }
  };

  const handleOpenDetailsModal = (lot: Lot) => {
    setSelectedLotForDetails(lot);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedLotForDetails(null);
    setIsDetailsModalOpen(false);
  };

  const filteredLots = allLots.filter(lot => {
    // Filter by logged-in distributor
    if (loggedInDistributorId && lot.distributeurAssocie !== loggedInDistributorId) {
      return false;
    }

    // Apply user-entered filter
    const lowerCaseFilter = filter.toLowerCase();
    return (
      lot.id.toLowerCase().includes(lowerCaseFilter) ||
      (lot.clientUtilisateur && lot.clientUtilisateur.toLowerCase().includes(lowerCaseFilter)) ||
      lot.statut.toLowerCase().includes(lowerCaseFilter)
    );
  });

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Suivi des Ventes</h1>

      <div className="mb-6">
        <Input
          id="salesFilter"
          label="Filtrer les ventes"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer par numéro de lot, client ou statut"
        />
      </div>

      <div className="overflow-x-auto">
        <SalesTrackingTable
          lots={filteredLots}
          onDelete={handleDeleteLot}
          onViewDetails={handleOpenDetailsModal}
        />
      </div>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        title="Détails du Lot"
      >
        {selectedLotForDetails && (
          <div className="space-y-4">
            <p><strong>Numéro de lot:</strong> {selectedLotForDetails.id}</p>
            <p><strong>Client consommateur:</strong> {selectedLotForDetails.clientUtilisateur || 'N/A'}</p>
            <p><strong>Date de consommation:</strong> {selectedLotForDetails.dateUtilisation ? new Date(selectedLotForDetails.dateUtilisation).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Statut du lot:</strong> {selectedLotForDetails.statut}</p>
            {/* Add more details if needed */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DistributorSalesTrackingPage;