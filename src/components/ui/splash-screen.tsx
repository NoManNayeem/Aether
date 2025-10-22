'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { id: 'init', label: 'Initializing Aether', duration: 800 },
    { id: 'providers', label: 'Loading providers', duration: 600 },
    { id: 'conversations', label: 'Loading conversations', duration: 500 },
    { id: 'ui', label: 'Preparing interface', duration: 400 },
    { id: 'ready', label: 'Ready to launch', duration: 300 },
  ];

  useEffect(() => {
    let currentStepIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const runSteps = () => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setCurrentStep(step.label);
        
        // Animate progress
        const targetProgress = ((currentStepIndex + 1) / steps.length) * 100;
        const startProgress = (currentStepIndex / steps.length) * 100;
        const progressDiff = targetProgress - startProgress;
        const progressSteps = 20;
        const progressIncrement = progressDiff / progressSteps;
        const stepDuration = step.duration / progressSteps;
        
        let currentProgress = startProgress;
        let progressStep = 0;
        
        const animateProgress = () => {
          if (progressStep < progressSteps) {
            currentProgress += progressIncrement;
            setProgress(Math.min(currentProgress, targetProgress));
            progressStep++;
            timeoutId = setTimeout(animateProgress, stepDuration);
          } else {
            setProgress(targetProgress);
            currentStepIndex++;
            timeoutId = setTimeout(runSteps, 200);
          }
        };
        
        animateProgress();
      } else {
        setIsComplete(true);
        setTimeout(onComplete, 500);
      }
    };

    runSteps();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete, steps]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.1),transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md mx-auto px-8">
        {/* Logo Container */}
        <div className="relative">
          {/* Logo Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 scale-110 animate-pulse-glow" />
          
          {/* Logo */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-slate-700 flex items-center justify-center shadow-2xl">
            <div className="w-20 h-20 relative">
              {/* Aether Logo - Stylized Star/Orbital */}
              <div className="absolute inset-0">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-60 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-2 border border-purple-400 rounded-full opacity-40 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                <div className="absolute inset-4 border border-pink-400 rounded-full opacity-30 animate-spin" style={{ animationDuration: '4s' }} />
                
                {/* Central Core */}
                <div className="absolute inset-6 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-80 animate-pulse" />
                
                {/* Orbital Elements */}
                <div className="absolute top-2 left-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-x-1/2 animate-ping" />
                <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-purple-300 rounded-full transform -translate-x-1/2 animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute left-2 top-1/2 w-1 h-1 bg-pink-300 rounded-full transform -translate-y-1/2 animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute right-2 top-1/2 w-1 h-1 bg-blue-300 rounded-full transform -translate-y-1/2 animate-ping" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Aether
          </h1>
          <p className="text-slate-400 text-lg">Cross-Platform MCP Client</p>
        </div>

        {/* Progress Section */}
        <div className="w-full space-y-4">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full animate-pulse" />
          </div>

          {/* Current Step */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
              )}
              <span className="text-slate-300 font-medium">
                {isComplete ? 'Launching Aether...' : currentStep}
              </span>
            </div>
            
            {/* Progress Percentage */}
            <div className="text-sm text-slate-500">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Version Badge */}
        <Badge variant="secondary" className="bg-slate-800/50 border-slate-600 text-slate-300">
          v0.1.0
        </Badge>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
