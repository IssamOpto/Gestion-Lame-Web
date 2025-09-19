import { Eye, EyeOff } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../../data/users';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface UserFormProps {
  user?: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
  disableRoleEditing?: boolean;
  loggedInUserRole: UserRole | null;
  associatedDistributorName?: string | null; // Add this
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, disableRoleEditing = false, loggedInUserRole, associatedDistributorName }) => {
  const [formData, setFormData] = useState<Omit<User, 'dateCreation' | 'password'> & { password?: string, passwordConfirm: string, oldPassword?: string }> ({
    id: '',
    nom: '',
    prenom: '',
    login: '',
    email: '',
    pays: '',
    telephone: '',
    role: 'Distributeur',
    statut: 'Actif',
    distributeurAssocie: '',
    password: '',
    passwordConfirm: '',
    oldPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        login: user.login,
        email: user.email,
        pays: user.pays,
        telephone: user.telephone,
        role: user.role,
        statut: user.statut,
        distributeurAssocie: user.distributeurAssocie,
        password: '', // Keep password fields empty for editing
        passwordConfirm: '',
        oldPassword: loggedInUserRole === 'Administrateur' ? user.password : '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id: '', // Set to empty for user input
        password: '',
        passwordConfirm: '',
      }));
    }
  }, [user, loggedInUserRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.id) newErrors.id = 'Le champ Identifiant Unique est obligatoire.';
    if (!formData.nom) newErrors.nom = 'Le champ Nom est obligatoire.';
    if (!formData.login) newErrors.login = 'Le champ Login est obligatoire.';

    if (user && (formData.password || formData.passwordConfirm)) { // User is editing and wants to change password
      if (!formData.oldPassword) {
        newErrors.oldPassword = 'Le champ Ancien mot de passe est obligatoire.';
      } else if (formData.oldPassword !== user.password) { // Direct comparison for plain text password
        newErrors.oldPassword = "L'ancien mot de passe est incorrect.";
      }
      if (!formData.password) {
        newErrors.password = 'Le champ Nouveau mot de passe est obligatoire.';
      }
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas.';
      }
    } else if (!user) { // New user
      if (!formData.password) {
        newErrors.password = 'Le champ Mot de passe est obligatoire.';
      }
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const { passwordConfirm, oldPassword, ...userData } = formData;

    const userToSave: User = {
      ...userData,
      password: '', // will be set below
      dateCreation: user ? user.dateCreation : new Date().toISOString(),
    };

    if (userData.password) { // if new password is provided
      userToSave.password = userData.password; // Store plain text password
    } else if (user) { // if editing and no new password, keep old one
      userToSave.password = user.password;
    }

    onSave(userToSave);
  };

  const roles: UserRole[] = ['Administrateur', 'Distributeur', 'Client'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="id" label="Identifiant Unique" value={formData.id} onChange={handleChange} required disabled={loggedInUserRole === 'Client'} error={errors.id} />
      <Input name="nom" label="Nom" value={formData.nom} onChange={handleChange} required error={errors.nom} />
      <Input name="prenom" label="Prénom" value={formData.prenom} onChange={handleChange} error={errors.prenom} />
      <Input name="login" label="Login" value={formData.login} onChange={handleChange} required error={errors.login} />
      <Input name="email" label="Email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
      <Input name="pays" label="Pays" value={formData.pays} onChange={handleChange} error={errors.pays} />
      <Input name="telephone" label="Téléphone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={disableRoleEditing}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>
      
      {formData.role === 'Client' && (
        <Input
          name="distributeurAssocie"
          label="Distributeur Associé"
          value={associatedDistributorName || ''}
          disabled
          onChange={() => {}} // onchange is required but does nothing
        />
      )}

      {user && (
        <Input
          name="oldPassword"
          label="Ancien mot de passe"
          type={showOldPassword ? 'text' : 'password'}
          value={formData.oldPassword}
          onChange={handleChange}
          required={!!formData.password}
          error={errors.oldPassword}
          icon={showOldPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          onIconClick={() => setShowOldPassword(!showOldPassword)}
          disabled={loggedInUserRole === 'Administrateur' && !!user}
        />
      )}

      <Input
        name="password"
        label={user ? "Nouveau mot de passe" : "Mot de passe"}
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        required={!user}
        error={errors.password}
        icon={showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
        onIconClick={() => setShowPassword(!showPassword)}
      />
      <Input
        name="passwordConfirm"
        label={user ? "Confirmation du nouveau mot de passe" : "Confirmation du mot de passe"}
        type={showPassword ? 'text' : 'password'}
        value={formData.passwordConfirm}
        onChange={handleChange}
        required={!user || !!formData.password}
        error={errors.passwordConfirm}
        icon={showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
        onIconClick={() => setShowPassword(!showPassword)}
      />
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};

export default UserForm;