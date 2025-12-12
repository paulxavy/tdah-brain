import React from 'react';

const OfferSection: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden rounded-xl m-4 md:m-8 shadow-2xl">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-2xl text-center relative z-10 space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium tracking-wide">
          OFERTA ESPECIAL
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Domina tu caos <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">para siempre.</span>
        </h2>
        
        <p className="text-lg text-slate-300 leading-relaxed">
          Esta app es solo el comienzo. Descubre el sistema completo de productividad diseñado específicamente para mentes neurodivergentes en mi nuevo eBook.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm max-w-sm mx-auto">
          <h3 className="text-xl font-bold mb-2">🧠 El Manual del Cerebro TDAH</h3>
          <ul className="text-left text-sm text-slate-300 space-y-2 mb-6">
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Plantillas de organización Notion</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Técnicas avanzadas de dopamina</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Comunidad de apoyo privada</li>
          </ul>
          <a 
            href="#" 
            className="block w-full py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-brand-500/50"
          >
            Obtener Acceso (50% OFF)
          </a>
          <p className="text-xs text-center mt-3 opacity-50">Oferta válida por tiempo limitado.</p>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;