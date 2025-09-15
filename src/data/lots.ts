export interface Lot {
  id: string; // Numéro de lot, e.g., OPTL25-000101
  numeroCarton: string;
  annee: string;
  numeroBoite: string;
  dateGeneration: string;
  dateUtilisation?: string;
  clientUtilisateur?: string;
  distributeurAssocie?: string;
  statut: 'Actif' | 'Inactif' | 'Utilisé';
}

const LOTS_STORAGE_KEY = 'optoscopia_lots';

export const getLots = (): Lot[] => {
  const lotsJson = localStorage.getItem(LOTS_STORAGE_KEY);
  if (lotsJson) {
    return JSON.parse(lotsJson);
  }
  return [];
};

export const saveLots = (lots: Lot[]): void => {
  localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(lots));
};

export const generateLots = (carton: number, annee: number, nombreBoites: number): Lot[] => {
  const lots: Lot[] = [];
  const anneeStr = annee.toString().slice(-2);
  const cartonStr = carton.toString().padStart(4, '0');

  // Lot for the carton itself
  lots.push({
    id: `OPTL${anneeStr}-${cartonStr}00`,
    numeroCarton: cartonStr,
    annee: anneeStr,
    numeroBoite: '00',
    dateGeneration: new Date().toISOString(),
    statut: 'Actif',
  });

  // Lots for the boxes
  for (let i = 1; i <= nombreBoites; i++) {
    const boiteStr = i.toString().padStart(2, '0');
    lots.push({
      id: `OPTL${anneeStr}-${cartonStr}${boiteStr}`,
      numeroCarton: cartonStr,
      annee: anneeStr,
      numeroBoite: boiteStr,
      dateGeneration: new Date().toISOString(),
      statut: 'Actif',
    });
  }

  return lots;
};
