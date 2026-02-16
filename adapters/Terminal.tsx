
import React, { useState, useEffect, useRef } from 'react';
import { Bus } from '../core/bus';
import { EngineEventType } from '../core/types';

const Terminal: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Initializing Sutra-Math-Engine..."]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = Bus.subscribe(EngineEventType.LOG_MESSAGE, (msg: string) => {
      setLogs(prev => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden flex flex-col h-full font-mono text-xs">
      <div className="bg-zinc-900 px-3 py-1 flex items-center justify-between border-b border-zinc-800">
        <span className="text-zinc-400 font-bold uppercase tracking-widest">Internal Bus Stream</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="p-4 overflow-y-auto space-y-1 text-emerald-500/80 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {logs.map((log, i) => (
          <div key={i} className="leading-tight break-all">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
