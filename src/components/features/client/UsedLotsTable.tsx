import React, { useState } from 'react';
import Input from '../../ui/Input';
import LotTable from '../lots/LotTable';
import { Lot } from '../../../data/lots';

interface UsedLotsTableProps {
  userLots: Lot[];
}

const UsedLotsTable: React.FC<UsedLotsTableProps> = ({ userLots }) => {
  const [filter, setFilter] = useState('');

  const filteredLots = userLots.filter(lot =>
    lot.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
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
        showStatusColumn={false}
        showActivationCodeColumn={true}
      />
    </div>
  );
};

export default UsedLotsTable;
