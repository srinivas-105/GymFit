
import React, { useState } from 'react';
import type { DietPlan, DailyDiet, Meal } from '../types';
import Card from './common/Card';

const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="font-semibold text-white">{meal.name}</h5>
          <p className="text-xs text-cyan-400">{meal.calories} kcal</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cyan-400 hover:text-cyan-300 text-sm"
        >
          {isExpanded ? 'Hide Recipe' : 'Show Recipe'}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-3 text-sm text-gray-300 prose prose-invert max-w-none">
            {meal.recipe.split('\n').map((line, index) => <p key={index} className="my-1">{line}</p>)}
        </div>
      )}
    </div>
  );
};

const DietDayDisplay: React.FC<{ day: DailyDiet }> = ({ day }) => (
  <div>
    <h4 className="font-bold text-lg text-white mb-2">Total Calories: <span className="text-cyan-400">{day.totalCalories} kcal</span></h4>
    <div className="space-y-3">
      {day.meals.map((meal, index) => (
        <MealCard key={index} meal={meal} />
      ))}
    </div>
  </div>
);

const DietPlanDisplay: React.FC<{ dietPlan: DietPlan }> = ({ dietPlan }) => {
  const [activeDay, setActiveDay] = useState(dietPlan.dailyDiets[0].day);

  return (
    <Card>
      <h2 className="text-2xl font-bold text-cyan-400 mb-2">Your Weekly Diet Plan</h2>
      <div className="flex justify-between items-baseline mb-4">
        <p className="text-gray-400">Target: <span className="font-semibold text-white">{dietPlan.dailyIntake.calories} kcal/day</span></p>
        <div className="text-xs text-gray-400 space-x-3">
            <span>P: {dietPlan.dailyIntake.protein}g</span>
            <span>C: {dietPlan.dailyIntake.carbs}g</span>
            <span>F: {dietPlan.dailyIntake.fats}g</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-4">
        {dietPlan.dailyDiets.map(day => (
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
        {dietPlan.dailyDiets
          .filter(d => d.day === activeDay)
          .map(d => <DietDayDisplay key={d.day} day={d} />)}
      </div>
    </Card>
  );
};

export default DietPlanDisplay;
