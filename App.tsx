import React from 'react';
import Board from './components/Board';
import { User, Layers } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      <header className="bg-[#0079bf] text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0 z-10">
        <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-white/90" />
            <h1 className="text-xl font-bold tracking-tight">My Tasks</h1>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="text-sm font-medium opacity-90">User:</span>
            <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Demo User</span>
                <div className="bg-white/20 p-1 rounded-full">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </div>
      </header>

      <Board />
    </div>
  );
};

export default App;