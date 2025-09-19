import React, { useState, useEffect } from 'react';
import { User, getUsers } from '../../../data/users';
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
  const [formData, setFormData] = useState<Omit<User, 'dateCreation' | 'password'> & { password?: string, passwordConfirm: string }> ({
    id: '',
    nom: '',
    prenom: '',
    login: '',
    email: '',
    pays: '',
    telephone: '',
    role: 'Client',
    statut: 'Actif',
    distributeurAssocie: distributorId,
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const allUsers = getUsers();
  const distributor = allUsers.find(u => u.id === distributorId);
  const distributorName = distributor ? `${distributor.prenom} ${distributor.nom}` : distributorId;

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
        password: '', // Keep password fields empty for editing
        passwordConfirm: '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        id: '', // Set to empty for user input
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
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.id) newErrors.id = 'Le champ Identifiant Unique est obligatoire.'; // Add validation for id
    if (!formData.nom) newErrors.nom = 'Le champ Nom est obligatoire.';
    if (!formData.prenom) newErrors.prenom = 'Le champ Prénom est obligatoire.';
    if (!formData.login) newErrors.login = 'Le champ Login est obligatoire.';

    if (!client) { // New client
      if (!formData.password) {
        newErrors.password = 'Le champ Mot de passe est obligatoire.';
      }
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Les mots de passe ne correspondent pas.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const { passwordConfirm, ...clientData } = formData;

    const clientToSave: User = {
      ...clientData,
      password: '', // will be set below
      dateCreation: client ? client.dateCreation : new Date().toISOString(),
    };

    if (clientData.password) { // if new password is provided
      clientToSave.password = clientData.password;
    } else if (client) { // if editing and no new password, keep old one
      clientToSave.password = client.password;
    }

    onSave(clientToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="id" label="Identifiant Unique" value={formData.id} onChange={handleChange} required disabled={false} error={errors.id} />
      <Input name="nom" label="Nom" value={formData.nom} onChange={handleChange} required error={errors.nom} />
      <Input name="prenom" label="Prénom" value={formData.prenom} onChange={handleChange} required error={errors.prenom} />
      <Input name="login" label="Login" value={formData.login} onChange={handleChange} required error={errors.login} />
      <Input name="email" label="Email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
      <Input name="pays" label="Pays" value={formData.pays} onChange={handleChange} error={errors.pays} />
      <Input name="telephone" label="Téléphone" value={formData.telephone} onChange={handleChange} error={errors.telephone} />
      
      <Input name="role" label="Rôle" value={formData.role} onChange={handleChange} required disabled />
      <Input name="distributeurAssocie" label="Distributeur Associé" value={distributorName} onChange={() => {}} required disabled />

      <Input
        name="password"
        label={client ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        required={!client}
        error={errors.password}
        icon={showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
        onIconClick={() => setShowPassword(!showPassword)}
      />
      <Input
        name="passwordConfirm"
        label="Confirmation mot de passe"
        type={showPassword ? 'text' : 'password'}
        value={formData.passwordConfirm}
        onChange={handleChange}
        required={!client || !!formData.password}
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

export default ClientForm;
