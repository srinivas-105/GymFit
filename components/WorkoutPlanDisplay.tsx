
import React, { useState } from 'react';
import type { WorkoutPlan, DailyWorkout } from '../types';
import Card from './common/Card';

const WorkoutDayCard: React.FC<{ day: DailyWorkout }> = ({ day }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
    <h4 className="font-bold text-lg text-cyan-400">{day.focus}</h4>
    {day.isRestDay ? (
      <p className="text-gray-300 mt-2">Rest Day - focus on recovery and light activity like stretching or walking.</p>
    ) : (
      <ul className="mt-3 space-y-3">
        {day.exercises.map((ex, i) => (
          <li key={i} className="text-sm text-gray-300 border-b border-gray-700 pb-2 last:border-b-0">
            <span className="font-semibold text-white">{ex.name}:</span> {ex.sets} sets of {ex.reps} reps, {ex.rest} rest
          </li>
        ))}
      </ul>
    )}
  </div>
);

const WorkoutPlanDisplay: React.FC<{ workoutPlan: WorkoutPlan }> = ({ workoutPlan }) => {
  const [activeDay, setActiveDay] = useState(workoutPlan.dailyWorkouts[0].day);

  return (
    <Card>
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Your Weekly Workout Plan</h2>
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
        {workoutPlan.dailyWorkouts.map(day => (
          <button
            key={day.day}
            onClick={() => setActiveDay(day.day)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
              activeDay === day.day ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {day.day}
          </button>
        ))}
      </div>
      <div>
        {workoutPlan.dailyWorkouts
          .filter(d => d.day === activeDay)
          .map(d => <WorkoutDayCard key={d.day} day={d} />)}
      </div>
    </Card>
  );
};

export default WorkoutPlanDisplay;
