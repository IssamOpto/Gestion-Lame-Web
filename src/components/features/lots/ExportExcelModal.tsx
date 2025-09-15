import React, { useState } from 'react';
import { Lot } from '../../../data/lots';
import Button from '../../ui/Button';
import * as XLSX from 'xlsx';

interface ExportExcelModalProps {
  lots: Lot[];
  onClose: () => void;
}

const ExportExcelModal: React.FC<ExportExcelModalProps> = ({ lots, onClose }) => {
  const [selectedCartons, setSelectedCartons] = useState<string[]>([]);

  const availableCartons = lots
    .filter(lot => lot.statut === 'Actif' && lot.numeroBoite === '00')
    .map(lot => lot.numeroCarton);

  const handleToggleCarton = (carton: string) => {
    setSelectedCartons(prev =>
      prev.includes(carton) ? prev.filter(c => c !== carton) : [...prev, carton]
    );
  };

  const handleExport = () => {
    const lotsToExport = lots.filter(lot =>
      selectedCartons.includes(lot.numeroCarton) && lot.numeroBoite !== '00'
    );

    const worksheet = XLSX.utils.json_to_sheet(lotsToExport.map(lot => ({
      'Numéro de lot': lot.id,
      'Date de génération': new Date(lot.dateGeneration).toLocaleDateString(),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lots');
    XLSX.writeFile(workbook, 'lots.xlsx');
    onClose();
  };

  return (
    <div>
      <h4 className="text-lg font-medium mb-4">Sélectionner les cartons à exporter</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
        {availableCartons.map(carton => (
          <div key={carton} className="flex items-center">
            <input
              type="checkbox"
              id={`carton_${carton}`}
              checked={selectedCartons.includes(carton)}
              onChange={() => handleToggleCarton(carton)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`carton_${carton}`} className="ml-2 block text-sm text-gray-900">
              Carton N° {carton}
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
        <Button type="button" onClick={handleExport} disabled={selectedCartons.length === 0}>
          Exporter
        </Button>
      </div>
    </div>
  );
};

export default ExportExcelModal;