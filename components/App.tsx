
import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FormTracker from './components/FormTracker';
import ProgressTracker from './components/ProgressTracker';
import { UserData, WorkoutPlan, DietPlan, ProgressEntry } from './types';
import { Page } from './types';
import { DUMBBELL_ICON, PLATE_ICON, CHART_ICON } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([
    { date: '2024-07-01', weight: 85 },
    { date: '2024-07-08', weight: 84.5 },
    { date: '2024-07-15', weight: 84 },
  ]);

  const handlePlansGenerated = useCallback((data: { userData: UserData; workoutPlan: WorkoutPlan; dietPlan: DietPlan }) => {
    setUserData(data.userData);
    setWorkoutPlan(data.workoutPlan);
    setDietPlan(data.dietPlan);
  }, []);

  const addProgressEntry = useCallback((entry: ProgressEntry) => {
    setProgress(prev => [...prev, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  const renderContent = useMemo(() => {
    switch (currentPage) {
      case Page.DASHBOARD:
        return <Dashboard onPlansGenerated={handlePlansGenerated} workoutPlan={workoutPlan} dietPlan={dietPlan} />;
      case Page.FORM_TRACKER:
        return <FormTracker />;
      case Page.PROGRESS_TRACKER:
        return <ProgressTracker progress={progress} addProgressEntry={addProgressEntry} />;
      default:
        return <Dashboard onPlansGenerated={handlePlansGenerated} workoutPlan={workoutPlan} dietPlan={dietPlan} />;
    }
  }, [currentPage, workoutPlan, dietPlan, progress, handlePlansGenerated, addProgressEntry]);

  const navItems = [
    { page: Page.DASHBOARD, label: 'Dashboard', icon: PLATE_ICON },
    { page: Page.FORM_TRACKER, label: 'Form Tracker', icon: DUMBBELL_ICON },
    { page: Page.PROGRESS_TRACKER, label: 'Progress', icon: CHART_ICON }
  ];

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header navItems={navItems} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent}
      </main>
    </div>
  );
};

export default App;
