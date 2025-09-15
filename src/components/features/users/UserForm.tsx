import { Eye, EyeOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../../data/users';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<User, 'dateCreation'> & { passwordConfirm: string }> ({
    id: '', // Add id to formData
    nom: '',
    prenom: '',
    login: '',
    email: '',
    pays: '',
    telephone: '',
    role: 'Distributeur',
    statut: 'Actif',
    distributeurAssocie: '',
    password: '', // Add password to formData
    passwordConfirm: '', // Add passwordConfirm to formData
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id, // Set id from user
        nom: user.nom,
        prenom: user.prenom,
        login: user.login,
        email: user.email,
        pays: user.pays,
        telephone: user.telephone,
        role: user.role,
        statut: user.statut,
        distributeurAssocie: user.distributeurAssocie,
        password: user.password || '', // Set password from user
        passwordConfirm: user.password || '', // Set passwordConfirm from user
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id: `user_${Date.now()}`, // Generate ID for new user
        password: '',
        passwordConfirm: '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    } else {
      setPasswordError('');
    }

    const newUser: User = {
      ...formData,
      dateCreation: user ? user.dateCreation : new Date().toISOString(),
    };
    onSave(newUser);
  };

  const roles: UserRole[] = ['Administrateur', 'Distributeur', 'Client'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="id" label="Identifiant Unique" value={formData.id} onChange={handleChange} required disabled={!!user} />
      <Input name="nom" label="Nom" value={formData.nom} onChange={handleChange} required />
      <Input name="prenom" label="Prénom" value={formData.prenom} onChange={handleChange} />
      <Input name="login" label="Login" value={formData.login} onChange={handleChange} required />
      <Input name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
      <Input name="pays" label="Pays" value={formData.pays} onChange={handleChange} />
      <Input name="telephone" label="Téléphone" value={formData.telephone} onChange={handleChange} />
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={!!user && (user.role === 'Distributeur' || user.role === 'Client')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
      {formData.role === 'Client' && (
        <Input name="distributeurAssocie" label="Distributeur Associé" value={formData.distributeurAssocie} onChange={handleChange} />
      )}
      <Input
        name="password"
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        required
        icon={showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
        onIconClick={() => setShowPassword(!showPassword)}
      />
      <Input
        name="passwordConfirm"
        label="Confirmation mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={formData.passwordConfirm}
        onChange={handleChange}
        required
        icon={showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
        onIconClick={() => setShowPassword(!showPassword)}
      />
      {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};

export default UserForm;