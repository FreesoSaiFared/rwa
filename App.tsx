
import React, { useState, useEffect } from 'react';
import Terminal from './adapters/Terminal';
import EngineInterface from './adapters/EngineInterface';
import { Bus, engineInstance, EngineCommandType, CalculationInput } from './core';
import { AIService } from './services/aiService';

// Extend window for Library Mode
declare global {
  interface Window {
    WN_MODULES: any;
  }
}

const App: React.FC = () => {
  const [isLibraryMode, setIsLibraryMode] = useState(false);

  useEffect(() => {
    // Initializing services
    AIService.setup();

    // Setup Library Mode API
    window.WN_MODULES = window.WN_MODULES || {};
    window.WN_MODULES['SutraMathEngine'] = {
      calculate: (mass: number, radius: number) => {
        Bus.publish(EngineCommandType.CALCULATE_SCHWARZSCHILD, { mass, radius } as CalculationInput);
      },
      subscribeToCalculations: (handler: (data: any) => void) => {
        return Bus.subscribe('CALCULATION_SUCCESS', handler);
      },
      reset: () => Bus.publish(EngineCommandType.RESET_ENGINE, null)
    };

    // Check URL for library mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('libraryMode') === 'true') {
      setIsLibraryMode(true);
    }
  }, []);

  if (isLibraryMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Sutra-Math-Engine</h1>
          <p className="text-zinc-500 mb-6">Running in federated Library Mode.</p>
          <div className="font-mono text-xs bg-black p-4 rounded text-emerald-500 text-left">
            window.WN_MODULES['SutraMathEngine'].calculate(...)
          </div>
          <button 
            onClick={() => setIsLibraryMode(false)}
            className="mt-6 text-sm text-zinc-400 hover:text-white underline"
          >
            Switch to GUI Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080808]">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              S
            </div>
            <h1 className="text-lg font-extrabold tracking-tighter text-white uppercase">
              Sutra<span className="text-zinc-500">_Math_Engine</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Hexagonal Core Active</span>
            </div>
            <button 
              onClick={() => setIsLibraryMode(true)}
              className="px-3 py-1 text-xs border border-zinc-700 rounded text-zinc-400 hover:bg-zinc-800 transition-colors uppercase font-bold"
            >
              Lib Mode
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: UI Adapters */}
        <section className="lg:col-span-8 space-y-8">
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden">
            <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Schwarzschild Adapter</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-700" />)}
              </div>
            </div>
            <EngineInterface />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900/30 p-4 border border-zinc-800 rounded-xl">
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Decoupling</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">UI and Core are isolated via an internal message bus. No direct imports allowed between layers.</p>
            </div>
            <div className="bg-zinc-900/30 p-4 border border-zinc-800 rounded-xl">
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Architecture</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Hexagonal / Ports & Adapters. Business logic sits at the center, technology sits at the edge.</p>
            </div>
            <div className="bg-zinc-900/30 p-4 border border-zinc-800 rounded-xl">
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Federation</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Exposes a window-level API for host applications to command the transformation engine.</p>
            </div>
          </div>
        </section>

        {/* Right Column: Engine Logs */}
        <aside className="lg:col-span-4 h-full flex flex-col">
          <div className="sticky top-24 flex-grow flex flex-col h-[600px]">
            <Terminal />
          </div>
        </aside>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 mt-12 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-xs font-mono">
          <div>&copy; 2024 FEDERATED SCHWARZSCHILD TRANSFORMER v1.0.4-STABLE</div>
          <div className="flex gap-6">
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">CORE_SPEC</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">PORT_OUT_INTERFACE</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">WASM_OP_MAP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
