
import { GoogleGenAI, Type } from "@google/genai";
import type { UserData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const activityMultipliers: { [key: string]: number } = {
  'Sedentary (little or no exercise)': 1.2,
  'Lightly Active (light exercise/sports 1-3 days/week)': 1.375,
  'Moderately Active (moderate exercise/sports 3-5 days/week)': 1.55,
  'Very Active (hard exercise/sports 6-7 days a week)': 1.725,
  'Extra Active (very hard exercise/sports & physical job)': 1.9,
};

const goalAdjustments: { [key: string]: number } = {
  'Lose Weight': -500,
  'Build Muscle': 300,
  'Maintain Weight': 0,
};

const planSchema = {
    type: Type.OBJECT,
    properties: {
        workoutPlan: {
            type: Type.OBJECT,
            properties: {
                dailyWorkouts: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING },
                            focus: { type: Type.STRING },
                            isRestDay: { type: Type.BOOLEAN },
                            exercises: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        sets: { type: Type.STRING },
                                        reps: { type: Type.STRING },
                                        rest: { type: Type.STRING },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        dietPlan: {
            type: Type.OBJECT,
            properties: {
                dailyIntake: {
                    type: Type.OBJECT,
                    properties: {
                        calories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbs: { type: Type.NUMBER },
                        fats: { type: Type.NUMBER },
                    },
                },
                dailyDiets: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.STRING },
                            totalCalories: { type: Type.NUMBER },
                            meals: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        calories: { type: Type.NUMBER },
                                        recipe: { type: Type.STRING },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};


export const generatePlans = async (userData: UserData) => {
  const bmr =
    userData.gender === 'Male'
      ? 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5
      : 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161;

  const tdee = bmr * activityMultipliers[userData.activityLevel];
  const targetCalories = Math.round(tdee + goalAdjustments[userData.goal]);

  const prompt = `
    You are an expert fitness and nutrition coach. A user provides their data:
    - Age: ${userData.age}
    - Weight: ${userData.weight} kg
    - Height: ${userData.height} cm
    - Gender: ${userData.gender}
    - Goal: ${userData.goal}
    - Activity Level: ${userData.activityLevel}

    Their calculated daily calorie target for their goal is ${targetCalories} kcal.

    Generate a comprehensive, 7-day weekly fitness plan and a corresponding 7-day diet plan.

    Workout Plan Requirements:
    - Tailor the plan to the user's goal (${userData.goal}). For 'Build Muscle', focus on hypertrophy. For 'Lose Weight', include a mix of strength training and cardio. For 'Maintain Weight', provide a balanced routine.
    - Include specific exercises, sets, reps, and rest periods for each day.
    - Designate 1-2 days as rest days.

    Diet Plan Requirements:
    - The diet plan must average around ${targetCalories} kcal per day.
    - Distribute macronutrients appropriately (e.g., higher protein for muscle building). Estimate protein, carbs, and fats.
    - Include 3 main meals (Breakfast, Lunch, Dinner) and 2 optional snacks per day.
    - Provide detailed, simple recipes for each main meal.
    
    Return the response as a single, valid JSON object that strictly adheres to the provided schema. Do not include any text or markdown formatting outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: planSchema,
      },
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse;
  } catch (error) {
    console.error("Error generating plans:", error);
    throw new Error("Failed to generate plans from AI. Please try again.");
  }
};

export const analyzeExerciseForm = async (imageData: string, exerciseName: string) => {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: imageData,
        },
    };

    const textPart = {
        text: `Analyze the user's form for the exercise: "${exerciseName}". Provide specific, actionable feedback on their posture, alignment, and execution. Point out any potential mistakes and suggest corrections to improve form and prevent injury. Structure your feedback into 'Strengths' and 'Areas for Improvement'. Keep the feedback concise and easy to understand.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing form:", error);
        throw new Error("Failed to analyze exercise form. Please try again.");
    }
};
