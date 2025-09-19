import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getUsers, resetUsersToInitialState } from '../data/users';
import { resetLotsToInitialState } from '../data/lots';

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.count('handleLogin calls');
    const users = getUsers();
    const user = users.find((u) => u.login === login && u.password === password);

    if (user) {
      if (user.statut === 'Inactif') {
        setError('Votre compte est inactif. Veuillez contacter l\'administrateur.');
        return;
      }
      localStorage.setItem('user', JSON.stringify({ isLoggedIn: true, username: user.login, role: user.role, id: user.id }));
      console.log('User data stored in localStorage:', { isLoggedIn: true, username: user.login, role: user.role, id: user.id });
      console.log('Logged in user role (before navigation):', user.role);
      if (user.role === 'Administrateur') {
        navigate('/users');
      } else if (user.role === 'Client') {
        navigate('/client-dashboard');
      } else if (user.role === 'Distributeur') {
        navigate('/distributor-dashboard');
      } else {
        console.error('Unknown user role, redirecting to login:', user.role);
        navigate('/login');
      }
    } else {
      setError('Login ou mot de passe incorrect.');
    }
  };

  const handleResetData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données (utilisateurs et lots) ? Cette action est irréversible.")) {
      resetUsersToInitialState();
      resetLotsToInitialState();
      alert("Données réinitialisées avec succès ! La page va se recharger.");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h2>
        </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              id="login"
              label="Login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              placeholder="Votre Login"
            />

            <Input
              id="password"
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Votre mot de passe"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full flex justify-center py-2 px-4">
                <LogIn className="mr-2 h-5 w-5" />
                Se connecter
              </Button>
            </div>
          </form>
          <div className="mt-4">
            <Button
              type="button"
              variant="danger"
              className="w-full flex justify-center py-2 px-4"
              onClick={handleResetData}
            >
              Réinitialiser toutes les données
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;