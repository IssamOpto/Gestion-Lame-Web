import React from 'react';
import { Lot } from '../../../data/lots';
import { Trash2, Eye } from 'lucide-react';
import Button from '../../ui/Button';

interface SalesTrackingTableProps {
  lots: Lot[];
  onDelete: (lotId: string) => void;
  onViewDetails: (lot: Lot) => void;
}

const SalesTrackingTable: React.FC<SalesTrackingTableProps> = ({ lots, onDelete, onViewDetails }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Numéro de lot</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Date de consommation</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Client ayant consommé le lot</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut du lot</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lots.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                Aucun lot consommé trouvé.
              </td>
            </tr>
          ) : (
            lots.map((lot) => (
              <tr key={lot.id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{lot.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.dateUtilisation ? new Date(lot.dateUtilisation).toLocaleDateString() : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.clientUtilisateur || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.statut}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center justify-center space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => onViewDetails(lot)}>
                    <Eye size={16} />
                  </Button>
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

export default SalesTrackingTable;
