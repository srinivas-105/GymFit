
import React, { useState } from 'react';
import UserInputForm from './UserInputForm';
import WorkoutPlanDisplay from './WorkoutPlanDisplay';
import DietPlanDisplay from './DietPlanDisplay';
import Spinner from './common/Spinner';
import type { UserData, WorkoutPlan, DietPlan } from '../types';
import { generatePlans } from '../services/geminiService';
import Card from './common/Card';

interface DashboardProps {
  onPlansGenerated: (data: { userData: UserData; workoutPlan: WorkoutPlan; dietPlan: DietPlan }) => void;
  workoutPlan: WorkoutPlan | null;
  dietPlan: DietPlan | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onPlansGenerated, workoutPlan, dietPlan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (userData: UserData) => {
    setIsLoading(true);
    setError(null);
    try {
      const plans = await generatePlans(userData);
      onPlansGenerated({ userData, workoutPlan: plans.workoutPlan, dietPlan: plans.dietPlan });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Details</h2>
            <p className="text-gray-400 mb-6">Enter your information to generate a personalized fitness and diet plan.</p>
            <UserInputForm onGenerate={handleGenerate} isLoading={isLoading} />
             {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-8">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-lg">
              <Spinner />
              <p className="mt-4 text-lg text-gray-300">Generating your personalized plan... this might take a moment.</p>
            </div>
          )}
          {!isLoading && workoutPlan && dietPlan && (
            <>
                <DietPlanDisplay dietPlan={dietPlan} />
                <WorkoutPlanDisplay workoutPlan={workoutPlan} />
            </>
          )}
           {!isLoading && !workoutPlan && !dietPlan && (
             <Card>
               <div className="flex flex-col items-center justify-center h-96">
                 <h3 className="text-xl font-semibold text-gray-300">Welcome to FitGenius AI!</h3>
                 <p className="text-gray-400 mt-2">Your personalized plans will appear here once generated.</p>
               </div>
             </Card>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
