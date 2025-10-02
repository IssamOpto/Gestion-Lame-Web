import React, { useState } from 'react';
import { Lot } from '../../../data/lots';
import { Trash2, Clipboard, Check } from 'lucide-react';
import Button from '../../ui/Button';
import ToggleSwitch from '../../ui/ToggleSwitch'; // Import ToggleSwitch

interface LotTableProps {
  series: Lot[];
  onDelete: (lotId: string) => void;
  onToggleStatus?: (lotId: string, newStatus: 'Actif' | 'Inactif') => void; // Make optional
  showStatusColumn?: boolean; // New prop
  showActivationCodeColumn?: boolean; // New prop
}

const LotTable: React.FC<LotTableProps> = ({ series = [], onDelete, onToggleStatus, showStatusColumn = true, showActivationCodeColumn = false }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
        <thead className="bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Numéro de série</th>
            {showActivationCodeColumn && ( // Conditionally render Code Activation column header
              <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Code Activation</th>
            )}
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Date de génération</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Date d'utilisation</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Distributeur</th>
            {showStatusColumn && ( // Conditionally render Status column header
              <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
            )}
            <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {series.length === 0 ? (
            <tr>
              <td colSpan={(showStatusColumn ? 1 : 0) + (showActivationCodeColumn ? 1 : 0) + 6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"> {/* Adjust colSpan */}
                Aucun numéro de série trouvé.
              </td>
            </tr>
          ) : (
            series.map((lot) => {
              
              return (
                <tr key={lot.id} className="hover:bg-gray-50 even:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{lot.id}</td>
                  {showActivationCodeColumn && ( // Conditionally render Code Activation column data
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span>{lot.codeValidation ? `${lot.id}-${lot.codeValidation}` : 'N/A'}</span>
                        {lot.codeValidation && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCopy(`${lot.id}-${lot.codeValidation}`, lot.id)}
                          >
                            {copiedId === lot.id ? <Check size={16} /> : <Clipboard size={16} />}
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{new Date(lot.dateGeneration).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.dateUtilisation ? new Date(lot.dateUtilisation).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.clientUtilisateur || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{lot.distributeurAssocie || 'N/A'}</td>
                  {showStatusColumn && ( // Conditionally render Status column data
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <ToggleSwitch
                        checked={lot.statut === 'Actif'}
                        onChange={(isChecked) => onToggleStatus && onToggleStatus(lot.id, isChecked ? 'Actif' : 'Inactif')} // Check if onToggleStatus exists
                      />
                      <span className={`ml-2 ${lot.statut === 'Actif' ? 'text-green-600' : 'text-red-600'}`}>
                        {lot.statut}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center justify-center space-x-2">
                    <Button variant="danger" size="sm" onClick={() => onDelete(lot.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LotTable;
