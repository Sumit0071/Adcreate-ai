"use client";

import { useEffect, useState } from "react";
import { Sparkles, Image as ImageIcon, Video, Cpu, CheckCircle2, MessageSquare, Target } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

const IMAGE_STEPS = [
  { icon: Cpu, text: "Analyzing your business profile..." },
  { icon: Target, text: "Identifying target audience & goal..." },
  { icon: MessageSquare, text: "Writing compelling ad copy..." },
  { icon: ImageIcon, text: "Generating high-quality image creatives..." },
  { icon: Sparkles, text: "Applying final polish..." },
];

const VIDEO_STEPS = [
  { icon: Cpu, text: "Analyzing ad script..." },
  { icon: Target, text: "Preparing AI avatar model..." },
  { icon: MessageSquare, text: "Synthesizing realistic voice..." },
  { icon: Video, text: "Rendering video frames..." },
  { icon: Sparkles, text: "Finalizing video export..." },
];

interface AdLoadingScreenProps {
  isVisible: boolean;
  type: "image" | "video";
}

export function AdLoadingScreen({ isVisible, type }: AdLoadingScreenProps) {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [currentStep, setCurrentStep] = useState(0);

  const steps = type === "image" ? IMAGE_STEPS : VIDEO_STEPS;
  const stepDuration = type === "image" ? 2500 : 3500; // Total time ~12s for image, ~17s for video to complete cycle

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        // Keep it at the last step but maybe pulse it
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible, type, stepDuration, steps.length]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl overflow-hidden relative ${
          isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-100"
        }`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[bg-spin_4s_linear_infinite]" />
        
        {/* Top Icon */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            {type === "image" ? (
              <ImageIcon className="w-10 h-10 text-white" />
            ) : (
              <Video className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 relative">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            {type === "image" ? "Generating Ad Creatives..." : "Creating Video Ad..."}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Our AI is working its magic. This usually takes {type === "image" ? "1-2 minutes" : "2-3 minutes"}.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 transition-all duration-500 ${
                  isCompleted ? "opacity-100" : isCurrent ? "opacity-100 translate-x-1" : "opacity-40"
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isCompleted 
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                    : isCurrent
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isCurrent ? "animate-bounce" : ""}`} />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isCompleted 
                    ? "text-gray-600 dark:text-gray-300" 
                    : isCurrent
                    ? "text-indigo-700 dark:text-indigo-300 font-semibold"
                    : "text-gray-400 dark:text-gray-600"
                }`}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Required keyframes for the background animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bg-spin {
          from { background-position: 0% 0%; }
          to { background-position: -200% 0%; }
        }
      `}} />
    </div>
  );
}
