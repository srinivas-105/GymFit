
import React, { useState } from 'react';
import type { UserData } from '../types';
import { Gender, FitnessGoal, ActivityLevel } from '../types';
import Button from './common/Button';

interface UserInputFormProps {
  onGenerate: (userData: UserData) => void;
  isLoading: boolean;
}

const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-2">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 transition" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 transition" />
);

const UserInputForm: React.FC<UserInputFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    age: 25,
    weight: 70,
    height: 175,
    gender: Gender.MALE,
    goal: FitnessGoal.BUILD_MUSCLE,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required min="12" max="99" />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
            {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
          </Select>
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} required min="30" />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input type="number" id="height" name="height" value={formData.height} onChange={handleChange} required min="100" />
        </div>
      </div>
      <div>
        <Label htmlFor="activityLevel">Activity Level</Label>
        <Select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
          {Object.values(ActivityLevel).map(level => <option key={level} value={level}>{level}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="goal">Fitness Goal</Label>
        <Select id="goal" name="goal" value={formData.goal} onChange={handleChange} required>
          {Object.values(FitnessGoal).map(g => <option key={g} value={g}>{g}</option>)}
        </Select>
      </div>
      <div className="pt-4">
        <Button type="submit" disabled={isLoading} fullWidth>
          {isLoading ? 'Generating Plan...' : 'Generate My Plan'}
        </Button>
      </div>
    </form>
  );
};

export default UserInputForm;
