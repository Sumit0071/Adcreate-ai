import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const steps = [
  "Analyzing your campaign brief",
  "Understanding your target audience",
  "Researching competitors & trends",
  "Generating high-converting ad copies",
  "Designing AI ad creatives",
  "Optimizing campaign assets",
  "Finalizing everything",
];

export function AdGenerationSkeleton() {
  const [currentStep, setCurrentStep] = useState( 0 );

  useEffect( () => {
    if ( currentStep >= steps.length - 1 ) return;

    const timer = setTimeout( () => {
      setCurrentStep( ( prev ) => prev + 1 );
    }, currentStep === 4 ? 4500 : 2000 ); // creative generation takes longer

    return () => clearTimeout( timer );
  }, [currentStep] );

  const progress = ( ( currentStep + 1 ) / steps.length ) * 100;

  return (
    <Dialog open>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
            Creating Your AI Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">

          {/* Progress */}
          <div>
            <div className="flex justify-between mb-2 text-sm text-gray-500">
              <span>Overall Progress</span>
              <span>{Math.round( progress )}%</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-5">
            {steps.map( ( step, index ) => {
              const completed = index < currentStep;
              const active = index === currentStep;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-4 transition-all duration-500 ${active ? "scale-[1.02]" : ""
                    }`}
                >
                  {completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : active ? (
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                  )}

                  <div className="flex-1">
                    <p
                      className={`font-medium ${completed
                          ? "text-green-600"
                          : active
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                    >
                      {step}
                    </p>

                    {active && (
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
              );
            } )}
          </div>

          {/* Bottom Message */}
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <Sparkles className="mx-auto mb-2 h-6 w-6 animate-pulse text-blue-600" />
            <p className="font-semibold text-gray-700">
              AI is crafting high-converting ad creatives for your business...
            </p>
            <p className="mt-1 text-sm text-gray-500">
              This usually takes around 1–2 minutes.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}