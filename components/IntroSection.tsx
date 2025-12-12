import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface IntroSectionProps {
  onComplete: () => void;
}

const data = [
  { name: 'Inicio', neurotypical: 20, adhd: 10 },
  { name: '10%', neurotypical: 30, adhd: 10 },
  { name: '30%', neurotypical: 45, adhd: 15 },
  { name: '50%', neurotypical: 60, adhd: 20 },
  { name: '80%', neurotypical: 80, adhd: 25 },
  { name: '90%', neurotypical: 90, adhd: 40 },
  { name: 'Deadline', neurotypical: 100, adhd: 100 },
];

const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6 animate-fade-in space-y-8 overflow-y-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
          Tu cerebro no está roto, <br/>
          <span className="text-brand-600">tiene un sistema operativo diferente.</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          La mayoría de las personas obtienen dopamina al terminar tareas. 
          Tú la obtienes con la novedad, el interés o la urgencia extrema.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[350px] w-full">
        <h3 className="text-sm font-semibold text-gray-500 mb-4 text-center">Curva de Estimulación: Neurotípico vs TDAH</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#9ca3af" />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="neurotypical" 
              name="Cerebro Neurotípico (Constante)" 
              stroke="#94a3b8" 
              strokeWidth={2} 
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="adhd" 
              name="Cerebro TDAH (Todo al final)" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{r: 4}} 
              activeDot={{r: 6}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center pt-4 pb-12">
        <p className="mb-6 text-slate-600">
          Esta aplicación está diseñada para hackear esa curva roja.
        </p>
        <button 
          onClick={onComplete}
          className="bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          Entendido, vamos a organizarnos &rarr;
        </button>
      </div>
    </div>
  );
};

export default IntroSection;