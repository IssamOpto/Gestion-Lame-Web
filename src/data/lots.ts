import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
import { User, getUsers } from './users';

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
  codeValidation?: string;
}

const LOTS_STORAGE_KEY = 'optoscopia_lots';

export const getLots = (): Lot[] => {
  const lotsJson = localStorage.getItem(LOTS_STORAGE_KEY);
  if (lotsJson) {
    const lots = JSON.parse(lotsJson);
    console.log('getLots: Retrieved lots from localStorage', lots);
    return lots;
  }
  console.log('getLots: No lots found in localStorage, returning empty array');
  return [];
};

export const saveLots = (lots: Lot[]): void => {
  console.log('saveLots: Saving lots to localStorage', lots);
  localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(lots));
};

const generateRandomFourDigitNumber = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const generateLots = (carton: number, annee: number, nombreBoites: number): Lot[] => {
  const lots: Lot[] = [];
  const anneeStr = annee.toString().slice(-2);
  const cartonStr = carton.toString().padStart(4, '0');

  // Lot for the carton itself (reintroduced)
  lots.push({
    id: `OPTL${anneeStr}-${cartonStr}0000`, // New format for carton lot
    numeroCarton: cartonStr,
    annee: anneeStr,
    numeroBoite: '0000', // 4 zeros for carton lot
    dateGeneration: new Date().toISOString(),
    statut: 'Actif',
  });

  // Lots for the boxes
  for (let i = 0; i < nombreBoites; i++) {
    const boiteNum = generateRandomFourDigitNumber();
    const boiteStr = boiteNum.toString().padStart(4, '0');

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

export const updateLotUsage = (lotId: string, client: User, usageDate: string): { success: boolean, validationCode?: string, error?: string } => {
    const lots = getLots();
    const lotIndex = lots.findIndex(lot => lot.id === lotId);
    const clientName = `${client.prenom} ${client.nom}`;
  
    if (lotIndex > -1) {
      const lot = lots[lotIndex];
      // If the lot is inactive, prevent activation code generation
      if (lot.statut === 'Inactif') {
        return { success: false, error: 'Ce lot est inactif et ne peut pas être utilisé.' };
      }

      // Check if already used by another client
      if (lot.statut === 'Utilisé' && lot.clientUtilisateur !== clientName) {
        return { success: false, error: 'Lot utilisé par un autre utilisateur.' };
      }
  
      // If the lot is active, or already used by the same client, generate/retrieve the code
      if (lot.statut === 'Actif' || (lot.statut === 'Utilisé' && lot.clientUtilisateur === clientName)) {
        let validationCode = lot.codeValidation;
        if (!validationCode) {
            const hash = HmacSHA256(lotId, client.id).toString(Hex); // Use client ID as key
            validationCode = hash.substring(0, 8).toUpperCase();
        }
        
        const fullActivationCode = `${lotId}-${validationCode}`;
  
        const distributor = getUsers().find(u => u.id === client.distributeurAssocie);
        const distributorName = distributor ? `${distributor.prenom} ${distributor.nom}` : 'N/A';
  
        const updatedLot: Lot = {
          ...lot,
          dateUtilisation: lot.dateUtilisation || usageDate,
          clientUtilisateur: lot.clientUtilisateur || clientName,
          distributeurAssocie: client.distributeurAssocie, // Corrected line
          statut: 'Utilisé',
          codeValidation: validationCode,
        };
        lots[lotIndex] = updatedLot;
        console.log('updateLotUsage: Lot updated, about to save', updatedLot);
        saveLots(lots);
        return { success: true, validationCode: fullActivationCode };
      }
      // If the lot is not 'Actif' or 'Utilisé' by the same client, and not 'Inactif' (already handled), it's an unexpected state.
      // This return statement handles cases where lot.statut is neither 'Actif', 'Utilisé', nor 'Inactif'.
      return { success: false, error: "Statut du lot non valide pour l'utilisation." };
    }
    return { success: false, error: 'Lot non trouvé.' };
  };

export const resetLotsToInitialState = (): void => {
  saveLots([]);
};
