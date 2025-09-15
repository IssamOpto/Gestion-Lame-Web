import React from 'react';
import { Lot } from '../../../data/lots';
import { Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import ToggleSwitch from '../../ui/ToggleSwitch'; // Import ToggleSwitch

interface LotTableProps {
  lots: Lot[];
  
  onDelete: (lotId: string) => void;
  onStatusChange: (lot: Lot, newStatus: 'Actif' | 'Inactif') => void; // Add onStatusChange prop
}

const LotTable: React.FC<LotTableProps> = ({ lots, onDelete, onStatusChange }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Numéro de lot</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Date de génération</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Date d'utilisation</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Distributeur</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lots.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                Aucun lot trouvé.
              </td>
            </tr>
          ) : (
            lots.map((lot) => (
              <tr key={lot.id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{lot.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{new Date(lot.dateGeneration).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.dateUtilisation ? new Date(lot.dateUtilisation).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.clientUtilisateur || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.distributeurAssocie || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <ToggleSwitch
                    checked={lot.statut === 'Actif'}
                    onChange={(isChecked) => onStatusChange(lot, isChecked ? 'Actif' : 'Inactif')}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center justify-center space-x-2">
                  <Button variant="danger" size="sm" onClick={() => onDelete(lot.id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LotTable;
