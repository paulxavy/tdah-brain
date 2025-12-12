import React from 'react';
import { SectionId } from '../types';

interface SidebarProps {
  activeTab: SectionId;
  setActiveTab: (id: SectionId) => void;
  progress: number;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, progress, isMobileOpen, setIsMobileOpen }) => {
  
  const navItems: { id: SectionId; label: string; icon: string }[] = [
    { id: 'intro', label: 'Diagnóstico', icon: '📊' },
    { id: 'kanban', label: 'Semáforo', icon: '🚦' },
    { id: 'focus', label: 'Modo Foco', icon: '🎯' },
    { id: 'reading', label: 'Lectura', icon: '📖' },
    { id: 'offer', label: 'Siguiente Nivel', icon: '🚀' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <h1 className="font-bold text-slate-800 tracking-tight">Cerebro TDAH</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-brand-50 text-brand-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Gamification Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dominio del Caos</span>
            <span className="text-xs font-bold text-brand-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            {progress < 30 ? 'Iniciado' : progress < 70 ? 'Aprendiz' : 'Maestro Jedi'}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;