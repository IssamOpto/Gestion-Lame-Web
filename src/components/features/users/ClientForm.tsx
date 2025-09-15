import React, { useState, useEffect } from 'react';
import { User } from '../../../data/users';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { Eye, EyeOff } from 'lucide-react';

interface ClientFormProps {
  client?: User | null;
  distributorId: string;
  onSave: (client: User) => void;
  onCancel: () => void;
  loggedInUserRole: string | null;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, distributorId, onSave, onCancel, loggedInUserRole }) => {
  const [formData, setFormData] = useState<Omit<User, 'dateCreation'> & { passwordConfirm: string }> ({
    id: '',
    nom: '',
    prenom: '',
    login: '',
    email: '',
    pays: '',
    telephone: '',
    role: 'Client', // Pre-filled and non-modifiable
    statut: 'Actif',
    distributeurAssocie: distributorId, // Pre-filled and non-modifiable
    password: '',
    passwordConfirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        nom: client.nom,
        prenom: client.prenom,
        login: client.login,
        email: client.email,
        pays: client.pays,
        telephone: client.telephone,
        role: client.role,
        statut: client.statut,
        distributeurAssocie: client.distributeurAssocie,
        password: client.password || '',
        passwordConfirm: client.password || '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id: `client_${Date.now()}`,
        role: 'Client',
        distributeurAssocie: distributorId,
        password: '',
        passwordConfirm: '',
      }));
    }
  }, [client, distributorId]);

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

    const newClient: User = {
      ...formData,
      dateCreation: client ? client.dateCreation : new Date().toISOString(),
    };
    onSave(newClient);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="id" label="Identifiant Unique" value={formData.id} onChange={handleChange} required disabled={loggedInUserRole !== 'Distributeur'} />
      <Input name="nom" label="Nom" value={formData.nom} onChange={handleChange} required />
      <Input name="prenom" label="Prénom" value={formData.prenom} onChange={handleChange} required />
      <Input name="login" label="Login" value={formData.login} onChange={handleChange} required />
      <Input name="email" label="Email" type="email" value={formData.email} onChange={handleChange} />
      <Input name="pays" label="Pays" value={formData.pays} onChange={handleChange} />
      <Input name="telephone" label="Téléphone" value={formData.telephone} onChange={handleChange} />
      
      {/* Role and Distributeur Associé are pre-filled and disabled */}
      <Input name="role" label="Rôle" value={formData.role} onChange={handleChange} required disabled />
      <Input name="distributeurAssocie" label="Distributeur Associé" value={formData.distributeurAssocie} onChange={handleChange} required disabled />

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

export default ClientForm;
