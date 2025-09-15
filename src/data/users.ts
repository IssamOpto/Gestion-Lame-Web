export type UserRole = 'Administrateur' | 'Distributeur' | 'Client';

export interface User {
  id: string; // Identifiant Unique
  nom: string;
  prenom: string;
  role: UserRole;
  distributeurAssocie?: string; // ID of the associated distributor
  pays: string;
  telephone: string;
  email: string;
  login: string;
  password?: string; // Added password field
  statut: 'Actif' | 'Inactif';
  dateCreation: string;
}

const USERS_STORAGE_KEY = 'optoscopia_users';

const getInitialUsers = (): User[] => {
  const adminUser: User = {
    id: 'admin_001',
    nom: 'Admin',
    prenom: 'Optoscopia',
    role: 'Administrateur',
    pays: 'France',
    telephone: 'N/A',
    email: 'admin@optoscopia.com',
    login: 'admin',
    password: 'admin', // Added password for initial admin user
    statut: 'Actif',
    dateCreation: new Date().toISOString(),
  };
  return [adminUser];
};

export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (usersJson) {
    return JSON.parse(usersJson);
  }
  const initialUsers = getInitialUsers();
  saveUsers(initialUsers);
  return initialUsers;
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const resetUsersToInitialState = (): void => {
  const initialUsers = getInitialUsers();
  saveUsers(initialUsers);
};
