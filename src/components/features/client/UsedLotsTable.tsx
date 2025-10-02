import React, { useState } from 'react';
import Input from '../../ui/Input';
import LotTable from '../lots/LotTable';
import { Lot } from '../../../data/lots';

interface UsedLotsTableProps {
  userSeries: Lot[];
}

const UsedLotsTable: React.FC<UsedLotsTableProps> = ({ userSeries }) => {
  const [filter, setFilter] = useState('');

  const filteredSeries = userSeries.filter(lot =>
    lot.id.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Vos Numéros de Séries de Lames Utilisés</h2>
      <div className="mb-4">
        <Input
          id="filter"
          label="Filtrer vos numéros de séries"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer par numéro de série"
        />
      </div>
      <LotTable
        series={filteredSeries}
        onDelete={() => {}}
        showStatusColumn={false}
        showActivationCodeColumn={true}
      />
    </div>
  );
};

export default UsedLotsTable;
