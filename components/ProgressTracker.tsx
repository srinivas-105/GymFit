
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProgressEntry } from '../types';
import Card from './common/Card';
import Button from './common/Button';

interface ProgressTrackerProps {
  progress: ProgressEntry[];
  addProgressEntry: (entry: ProgressEntry) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, addProgressEntry }) => {
  const [newWeight, setNewWeight] = useState('');
  
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight) {
      const newEntry: ProgressEntry = {
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(newWeight)
      };
      addProgressEntry(newEntry);
      setNewWeight('');
    }
  };

  const formattedData = progress.map(p => ({
    ...p,
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Weight Progress</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" domain={['dataMin - 2', 'dataMax + 2']}/>
                        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="weight" stroke="#4FD1C5" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>
      <div>
        <Card>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Log New Weight</h2>
            <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                    <label htmlFor="newWeight" className="block text-sm font-medium text-gray-300 mb-2">Today's Weight (kg)</label>
                    <input
                        type="number"
                        id="newWeight"
                        step="0.1"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                        placeholder="e.g., 83.5"
                    />
                </div>
                <Button type="submit" fullWidth>Add Entry</Button>
            </form>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTracker;
