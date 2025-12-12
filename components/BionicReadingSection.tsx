import React, { useState, useMemo } from 'react';

const INITIAL_TEXT = `El TDAH no es un déficit de atención, es un problema de regulación de la atención.
Las personas con TDAH pueden hiperenfocarse en cosas que les interesan, pero les cuesta dirigir su atención a tareas aburridas o repetitivas.
La lectura biónica ayuda a guiar el ojo a través del texto resaltando las partes iniciales de las palabras, permitiendo que el cerebro complete el resto automáticamente.`;

const BionicReadingSection: React.FC = () => {
  const [text, setText] = useState(INITIAL_TEXT);
  const [isEnabled, setIsEnabled] = useState(true);

  const processText = useMemo(() => {
    if (!isEnabled) return text;

    return text.split(' ').map((word, index) => {
      const midPoint = Math.ceil(word.length / 2);
      const firstHalf = word.slice(0, midPoint);
      const secondHalf = word.slice(midPoint);
      
      return (
        <span key={index} className="mr-1">
          <b className="font-bold text-slate-900">{firstHalf}</b>
          <span className="font-light text-slate-600">{secondHalf}</span>
        </span>
      );
    });
  }, [text, isEnabled]);

  return (
    <div className="h-full max-w-3xl mx-auto p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lectura Rápida</h2>
          <p className="text-sm text-gray-500">Resalta el inicio de las palabras para anclar tu atención.</p>
        </div>
        
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${isEnabled ? 'bg-brand-600' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isEnabled ? 'transform translate-x-6' : ''}`}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">{isEnabled ? 'Activado' : 'Desactivado'}</span>
        </label>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 p-2 custom-scrollbar">
           <div className={`text-lg leading-relaxed ${isEnabled ? '' : 'text-slate-700'}`}>
             {isEnabled ? processText : text}
           </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
            placeholder="Pega aquí tu texto largo para leerlo más rápido..."
          />
        </div>
      </div>
    </div>
  );
};

export default BionicReadingSection;