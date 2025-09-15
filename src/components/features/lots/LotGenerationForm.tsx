import React, { useState } from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface LotGenerationFormProps {
  onGenerate: (carton: number, annee: number, nombreBoites: number) => void;
  onCancel: () => void;
  lastCartonNumber: number;
}

const LotGenerationForm: React.FC<LotGenerationFormProps> = ({ onGenerate, onCancel, lastCartonNumber }) => {
  const [carton, setCarton] = useState(lastCartonNumber + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [nombreBoites, setNombreBoites] = useState(25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(carton, annee, nombreBoites);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="carton"
        label="Numéro de carton (CCCC)"
        type="number"
        value={carton}
        onChange={(e) => setCarton(Number(e.target.value))}
        required
      />
      <Input
        name="annee"
        label="Année (AAAA)"
        type="number"
        value={annee}
        onChange={(e) => setAnnee(Number(e.target.value))}
        required
      />
      <Input
        name="nombreBoites"
        label="Nombre de boîtes par carton"
        type="number"
        value={nombreBoites}
        onChange={(e) => setNombreBoites(Number(e.target.value))}
        required
      />
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Générer</Button>
      </div>
    </form>
  );
};

export default LotGenerationForm;