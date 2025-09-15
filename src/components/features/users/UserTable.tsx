import React from 'react';
import { User } from '../../../data/users';
import { Edit, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import ToggleSwitch from '../../ui/ToggleSwitch';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (user: User, newStatus: 'Actif' | 'Inactif') => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 table-fixed w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Nom</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Prénom</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Identifiant</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Rôle</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Distributeur</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Pays</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Téléphone</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Email</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Login</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">Statut</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Création</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate text-left">{user.nom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.prenom}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.distributeurAssocie || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.pays}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.telephone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate text-left">{user.login}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                <ToggleSwitch
                  checked={user.statut === 'Actif'}
                  onChange={(isChecked) => onStatusChange(user, isChecked ? 'Actif' : 'Inactif')}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{new Date(user.dateCreation).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center justify-center space-x-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(user)}>
                  <Edit size={16} />
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(user.id)}>
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

export default UserTable;
