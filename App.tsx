
import React, { useState, useEffect } from 'react';
import { AppState, INITIAL_STATE, LOCAL_STORAGE_KEY, SectionId } from './types';
import Sidebar from './components/Sidebar';
import IntroSection from './components/IntroSection';
import TrafficLightSection from './components/TrafficLightSection';
import FocusSection from './components/FocusSection';
import BionicReadingSection from './components/BionicReadingSection';
import OfferSection from './components/OfferSection';
import ChatWidget from './components/ChatWidget';

const App: React.FC = () => {
  // --- State Initialization ---
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch (e) {
      console.error("Error loading from localStorage", e);
      return INITIAL_STATE;
    }
  });

  const [activeTab, setActiveTab] = useState<SectionId>('intro');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // --- Persistence Effect ---
  // Save to localStorage whenever appState changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  // --- Progress & Tracking Logic ---
  // Automatically mark section as visited when activeTab changes
  useEffect(() => {
    setAppState(prev => {
      if (!prev.visitedSections.includes(activeTab)) {
        const newVisited = [...prev.visitedSections, activeTab];
        
        // Calculate progress based on unique sections visited
        // Total identifiable sections: intro, kanban, focus, reading, offer (5 total)
        const totalSections = 5; 
        const newProgress = Math.min(100, Math.round((newVisited.length / totalSections) * 100));

        return {
          ...prev,
          visitedSections: newVisited,
          progress: newProgress
        };
      }
      return prev;
    });
  }, [activeTab]);

  // --- Helpers to update specific parts of state ---
  const setTasks = (valOrFn: React.SetStateAction<AppState['tasks']>) => {
    setAppState(prev => ({
      ...prev,
      tasks: typeof valOrFn === 'function' ? valOrFn(prev.tasks) : valOrFn
    }));
  };

  const setChatHistory = (valOrFn: React.SetStateAction<AppState['chatHistory']>) => {
    setAppState(prev => ({
      ...prev,
      chatHistory: typeof valOrFn === 'function' ? valOrFn(prev.chatHistory) : valOrFn
    }));
  };

  // --- Navigation Handler ---
  const handleSectionChange = (id: SectionId) => {
    setActiveTab(id);
    setIsMobileOpen(false); // Close mobile menu on navigation
  };

  // --- Render Active Section ---
  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return <IntroSection onComplete={() => handleSectionChange('kanban')} />;
      case 'kanban':
        return <TrafficLightSection tasks={appState.tasks} setTasks={setTasks} />;
      case 'focus':
        return <FocusSection />;
      case 'reading':
        return <BionicReadingSection />;
      case 'offer':
        return <OfferSection />;
      default:
        return <IntroSection onComplete={() => handleSectionChange('kanban')} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-slate-800 font-sans">
      
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleSectionChange} 
        progress={appState.progress}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-white border-b border-gray-200 flex justify-between items-center z-10">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center text-white font-bold text-xs">C</div>
             <h1 className="font-bold text-gray-800">Cerebro TDAH</h1>
           </div>
           <button onClick={() => setIsMobileOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-auto bg-gray-50/50 relative">
           {renderContent()}
        </div>

        {/* Floating Chat Widget (Always present) */}
        <ChatWidget history={appState.chatHistory} setHistory={setChatHistory} />
        
      </main>
    </div>
  );
};

export default App;
