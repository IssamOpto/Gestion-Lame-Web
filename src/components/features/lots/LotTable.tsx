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
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Numéro de lot</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Date de génération</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Date d'utilisation</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Client</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Distributeur</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Statut</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lots.map((lot) => (
            <tr key={lot.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate text-center">{lot.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-center">{new Date(lot.dateGeneration).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-center">{lot.dateUtilisation ? new Date(lot.dateUtilisation).toLocaleDateString() : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-center">{lot.clientUtilisateur || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-center">{lot.distributeurAssocie || 'N/A'}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LotTable;
