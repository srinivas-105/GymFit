
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeExerciseForm } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';

const FormTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState('Squat');
  
  const exercises = ['Squat', 'Push-up', 'Deadlift', 'Lunge', 'Plank', 'Bicep Curl'];

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        setError(null);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Could not access the camera. Please check permissions and try again.");
        setIsCameraOn(false);
      }
    }
  };
  
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setFeedback('');
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64Data = imageDataUrl.split(',')[1];
        
        try {
            const result = await analyzeExerciseForm(base64Data, exercise);
            setFeedback(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">AI Form Tracker</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400">Camera is off</p>
                </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          <div className="mt-4 space-y-4">
              <div>
                  <label htmlFor="exercise" className="block text-sm font-medium text-gray-300 mb-2">Select Exercise</label>
                  <select id="exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                      {exercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
              </div>
              <div className="flex space-x-4">
                {!isCameraOn ? (
                    <Button onClick={startCamera} fullWidth>Start Camera</Button>
                ) : (
                    <Button onClick={stopCamera} fullWidth variant="secondary">Stop Camera</Button>
                )}
                <Button onClick={handleAnalyze} disabled={!isCameraOn || isLoading} fullWidth>
                    {isLoading ? 'Analyzing...' : 'Analyze Form'}
                </Button>
              </div>
          </div>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-white mb-3">Feedback</h3>
            <div className="bg-gray-800 p-4 rounded-lg min-h-[300px] border border-gray-700">
                {isLoading && <div className="flex items-center justify-center h-full"><Spinner /></div>}
                {error && <p className="text-red-400">{error}</p>}
                {feedback && !isLoading && (
                    <div className="text-gray-300 whitespace-pre-wrap prose prose-invert max-w-none">
                       {feedback.split('\n').map((line, index) => <p key={index} className="my-1">{line}</p>)}
                    </div>
                )}
                {!feedback && !isLoading && !error && (
                    <p className="text-gray-500">Your form analysis will appear here. Start the camera and perform an exercise!</p>
                )}
            </div>
        </div>
      </div>
    </Card>
  );
};

export default FormTracker;
