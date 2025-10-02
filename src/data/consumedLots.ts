export interface ConsumedLot {
  id: string; // Unique ID for the consumed lot entry
  lotNumber: string; // Numéro de série (e.g., CCCCBBBB)
  consumptionDate: string; // Date de consommation (ISO string)
  clientId: string; // ID of the client who consumed the lot
  clientName: string; // Name of the client (for display)
  distributorId: string; // ID of the distributor (for filtering)
  lotStatus: 'Actif' | 'Inactif'; // Statut du lot
}

const CONSUMED_LOTS_STORAGE_KEY = 'optoscopia_consumed_lots';

export const getConsumedLots = (): ConsumedLot[] => {
  const consumedLotsJson = localStorage.getItem(CONSUMED_LOTS_STORAGE_KEY);
  if (consumedLotsJson) {
    return JSON.parse(consumedLotsJson);
  }
  return [];
};

export const saveConsumedLots = (consumedLots: ConsumedLot[]): void => {
  localStorage.setItem(CONSUMED_LOTS_STORAGE_KEY, JSON.stringify(consumedLots));
};
