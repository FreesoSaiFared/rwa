
import React, { useState, useEffect } from 'react';
import { Bus } from '../core/bus';
import { EngineCommandType, EngineEventType, CalculationInput, CalculationResult } from '../core/types';

const EngineInterface: React.FC = () => {
  const [massInput, setMassInput] = useState<string>("5.972e24"); // Earth Mass
  const [radiusInput, setRadiusInput] = useState<string>("6371000"); // Earth Radius
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const unsubSuccess = Bus.subscribe(EngineEventType.CALCULATION_SUCCESS, (res: CalculationResult) => {
      setResult(res);
      setError(null);
    });
    const unsubError = Bus.subscribe(EngineEventType.CALCULATION_ERROR, (err: string) => {
      setError(err);
      setResult(null);
    });
    const unsubAi = Bus.subscribe(EngineEventType.AI_EXPLANATION_READY, (text: string) => {
      setAiText(text);
      setLoadingAi(false);
    });

    return () => {
      unsubSuccess();
      unsubError();
      unsubAi();
    };
  }, []);

  const handleCalculate = () => {
    const mass = parseFloat(massInput);
    const radius = parseFloat(radiusInput);
    
    if (isNaN(mass) || isNaN(radius)) {
      setError("Please enter valid numerical scientific notation (e.g., 5.97e24)");
      return;
    }

    Bus.publish(EngineCommandType.CALCULATE_SCHWARZSCHILD, { mass, radius } as CalculationInput);
    setAiText(null);
  };

  const askPhysicsConsultant = () => {
    if (!result) return;
    setLoadingAi(true);
    Bus.publish(EngineCommandType.EXPLAIN_PHYSICS, { 
      mass: parseFloat(massInput), 
      radius: parseFloat(radiusInput), 
      result 
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-zinc-900/50 p-6 border border-zinc-800 rounded-xl space-y-4 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-700 pb-2">Parameters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Mass (kg)</label>
              <input 
                type="text" 
                value={massInput}
                onChange={(e) => setMassInput(e.target.value)}
                className="w-full bg-black border border-zinc-700 p-3 rounded text-emerald-400 font-mono focus:border-emerald-500 outline-none transition-all"
                placeholder="e.g. 1.989e30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Distance from Center (m)</label>
              <input 
                type="text" 
                value={radiusInput}
                onChange={(e) => setRadiusInput(e.target.value)}
                className="w-full bg-black border border-zinc-700 p-3 rounded text-emerald-400 font-mono focus:border-emerald-500 outline-none transition-all"
                placeholder="e.g. 6.37e6"
              />
            </div>
          </div>

          <button 
            onClick={handleCalculate}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg active:scale-[0.98]"
          >
            EXECUTE TRANSFORMATION
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-zinc-900/50 p-6 border border-zinc-800 rounded-xl min-h-[300px] flex flex-col shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-700 pb-2">L-Factor Metrics</h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {result ? (
            <div className="space-y-6 flex-grow">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-black/50 p-4 rounded border border-zinc-800">
                  <span className="block text-xs text-zinc-500 uppercase">Schwarzschild Radius (rs)</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">
                    {result.schwarzschildRadius.toExponential(4)} m
                  </span>
                </div>
                <div className="bg-black/50 p-4 rounded border border-zinc-800">
                  <span className="block text-xs text-zinc-500 uppercase">L-Factor (Lorentzian)</span>
                  <span className="text-3xl font-bold text-white font-mono">
                    {result.lFactor.toFixed(8)}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded border font-bold text-center ${result.isInsideHorizon ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-blue-900/20 border-blue-500 text-blue-400'}`}>
                {result.isInsideHorizon ? 'WARNING: TARGET IS WITHIN EVENT HORIZON' : 'TARGET IS IN SCHWARZSCHILD EXTERIOR'}
              </div>

              <button 
                onClick={askPhysicsConsultant}
                disabled={loadingAi}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 rounded transition-colors disabled:opacity-50"
              >
                {loadingAi ? 'CONSULTING AI...' : 'CONSULT AI PHYSICIST'}
              </button>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-zinc-600 italic">
              Awaiting computation stream...
            </div>
          )}
        </div>
      </div>

      {aiText && (
        <div className="bg-emerald-900/10 border border-emerald-500/30 p-6 rounded-xl shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h3 className="text-emerald-500 font-bold text-xs uppercase mb-2 tracking-widest">Theoretical Breakdown</h3>
          <div className="text-emerald-100 leading-relaxed text-sm whitespace-pre-wrap font-serif italic">
            {aiText}
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineInterface;
