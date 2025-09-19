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
  allUsers: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onStatusChange, allUsers }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant Unique</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Création</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => {
            const associatedDistributor = user.role === 'Client' 
              ? allUsers.find(u => u.id === user.distributeurAssocie) 
              : undefined;
            return (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.prenom}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.login}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.dateCreation).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <ToggleSwitch
                    id={`status-${user.id}`}
                    checked={user.statut === 'Actif'}
                    onChange={(isChecked) => onStatusChange(user, isChecked ? 'Actif' : 'Inactif')}
                  />
                  <span className={`ml-2 ${user.statut === 'Actif' ? 'text-green-600' : 'text-red-600'}`}>
                    {user.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => onEdit(user)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(user.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
