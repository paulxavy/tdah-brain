import React, { useState, useEffect, useRef } from 'react';

const FOCUS_TIME = 15 * 60; // 15 minutes
const BROWN_NOISE_URL = "https://cdn.pixabay.com/audio/2024/03/21/audio_b20bc53f05.mp3";
const BINAURAL_URL = "https://previews.customer.envatousercontent.com/files/380061565/preview.mp3";

const FocusSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [activeNoise, setActiveNoise] = useState<'brown' | 'binaural' | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Audio Refs to maintain audio instances without re-rendering
  const brownAudioRef = useRef<HTMLAudioElement | null>(null);
  const binauralAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Objects
  useEffect(() => {
    brownAudioRef.current = new Audio(BROWN_NOISE_URL);
    brownAudioRef.current.loop = true;
    brownAudioRef.current.volume = 0.8; // Slightly reduced volume for comfort
    
    binauralAudioRef.current = new Audio(BINAURAL_URL);
    binauralAudioRef.current.loop = true;
    binauralAudioRef.current.volume = 0.8;

    return () => {
      // Cleanup: Stop all audio when component unmounts
      brownAudioRef.current?.pause();
      binauralAudioRef.current?.pause();
    };
  }, []);

  // Handle Playback Logic based on activeNoise state
  useEffect(() => {
    // Helper to safely pause
    const pauseAll = () => {
      brownAudioRef.current?.pause();
      binauralAudioRef.current?.pause();
      // Reset time to 0 implies restarting the track when clicked again, or we can just pause. 
      // Usually standard pause is fine.
    };

    pauseAll();

    if (activeNoise === 'brown') {
      brownAudioRef.current?.play().catch(e => console.error("Error playing brown noise:", e));
    } else if (activeNoise === 'binaural') {
      binauralAudioRef.current?.play().catch(e => console.error("Error playing binaural:", e));
    }
  }, [activeNoise]);

  // Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Optional: Stop noise when timer ends? 
      // For now, we keep noise running as users might want to continue in "flow" state.
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(FOCUS_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleNoise = (type: 'brown' | 'binaural') => {
    if (activeNoise === type) {
      setActiveNoise(null);
    } else {
      setActiveNoise(type);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
        
        {/* Visualizer Background */}
        {activeNoise && (
          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-20 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="audio-bar w-2 bg-brand-600 rounded-t-sm"
                style={{ 
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.5 + Math.random()}s`
                }} 
              />
            ))}
          </div>
        )}

        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Modo Dopamina</h2>
        
        <div className="font-mono text-7xl md:text-8xl font-bold text-slate-800 mb-8 tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4 mb-10 relative z-10">
          <button 
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:scale-105 active:scale-95 ${
              isActive 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-brand-600 text-white'
            }`}
          >
            {isActive ? 'Pausar' : 'Iniciar Foco'}
          </button>
          <button 
            onClick={resetTimer}
            className="px-4 py-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Reset Timer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          <button 
            onClick={() => toggleNoise('brown')}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
              activeNoise === 'brown' 
                ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-md transform scale-105' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-2xl mb-1">🌊</span>
            <span className="font-medium text-sm">Ruido Marrón</span>
            <span className="text-xs opacity-70">Para calmar la mente</span>
          </button>
          
          <button 
            onClick={() => toggleNoise('binaural')}
            className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
              activeNoise === 'binaural' 
                ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-md transform scale-105' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300'
            }`}
          >
            <span className="text-2xl mb-1">🎧</span>
            <span className="font-medium text-sm">Binaural 40Hz</span>
            <span className="text-xs opacity-70">Para enfoque profundo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusSection;