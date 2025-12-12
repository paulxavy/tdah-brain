
import React, { useState, useCallback } from 'react';
import { Task, ColumnId } from '../types';
import { breakDownTaskWithGemini } from '../services/geminiService';

interface TrafficLightSectionProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TrafficLightSection: React.FC<TrafficLightSectionProps> = ({ tasks, setTasks }) => {
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    // Default to yellow (Process) to avoid red blockage immediately
    const newTask: Task = {
      id: Date.now().toString(),
      content: newTaskInput,
      column: 'yellow'
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskInput('');
  };

  const handleAIBreakdown = async (taskId: string) => {
    const taskToBreak = tasks.find(t => t.id === taskId);
    if (!taskToBreak) return;

    setIsProcessingAI(true);
    const subtasks = await breakDownTaskWithGemini(taskToBreak.content);
    setIsProcessingAI(false);

    // Remove original large task, add subtasks to Yellow
    setTasks(prev => {
      const filtered = prev.filter(t => t.id !== taskId);
      const newSubtasks: Task[] = subtasks.map((st, idx) => ({
        id: `${Date.now()}-${idx}`,
        content: st,
        column: taskToBreak.column // Keep same column
      }));
      return [...filtered, ...newSubtasks];
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Drag and Drop Logic
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const onDrop = (e: React.DragEvent, targetColumn: ColumnId) => {
    e.preventDefault();
    
    if (!draggedTaskId) return;

    // Rule: Red column max 3 tasks
    if (targetColumn === 'red') {
      const redCount = tasks.filter(t => t.column === 'red' && t.id !== draggedTaskId).length;
      if (redCount >= 3) {
        setErrorMsg("¡ALTO! 🛑 Máximo 3 tareas en la zona roja. Termina una antes de añadir otra.");
        setTimeout(() => setErrorMsg(null), 3000);
        setDraggedTaskId(null);
        return;
      }
    }

    setTasks(prev => prev.map(t => 
      t.id === draggedTaskId ? { ...t, column: targetColumn } : t
    ));
    setDraggedTaskId(null);
  };

  const renderColumn = (colId: ColumnId, title: string, colorClass: string, bgClass: string) => {
    const colTasks = tasks.filter(t => t.column === colId);

    return (
      <div 
        className={`flex-1 min-w-[280px] rounded-xl flex flex-col h-full max-h-full ${bgClass} border border-transparent transition-colors duration-200`}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, colId)}
      >
        <div className={`p-3 border-b border-black/5 flex justify-between items-center rounded-t-xl ${colorClass} bg-opacity-20`}>
          <h3 className={`font-bold uppercase tracking-wider text-sm ${colorClass === 'bg-red-500' ? 'text-red-800' : colorClass === 'bg-yellow-500' ? 'text-yellow-800' : 'text-green-800'}`}>
            {title} <span className="opacity-60 text-xs ml-1">({colTasks.length})</span>
          </h3>
          {colId === 'red' && <span className="text-xs font-mono bg-white/50 px-2 py-0.5 rounded text-red-700">MAX 3</span>}
        </div>
        
        <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          {colTasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => onDragStart(e, task.id)}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all group relative animate-slide-up"
            >
              <p className="text-gray-700 text-sm mb-2 pr-6">{task.content}</p>
              
              <div className="flex justify-between items-center mt-2">
                 {/* Magic AI Button */}
                <button
                  onClick={() => handleAIBreakdown(task.id)}
                  disabled={isProcessingAI}
                  className="text-xs flex items-center gap-1 text-ai-600 font-medium hover:bg-ai-100 px-2 py-1 rounded transition-colors"
                  title="Desglosar con IA"
                >
                  {isProcessingAI ? 'Thinking...' : '✨ Desglosar'}
                </button>
                
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {colTasks.length === 0 && (
            <div className="h-full min-h-[100px] border-2 border-dashed border-gray-300/50 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
              <span className="text-2xl opacity-50 mb-2">
                {colId === 'red' ? '🔥' : colId === 'yellow' ? '⚡' : '✨'}
              </span>
              <span>
                {colId === 'red' ? 'Arrastra aquí lo urgente' : colId === 'yellow' ? 'Añade tareas arriba' : 'Arrastra aquí al terminar'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Tablero Semáforo</h2>
           <p className="text-sm text-gray-500">Arrastra las tareas. Mantén el rojo bajo control.</p>
        </div>
       
        <form onSubmit={handleAddTask} className="flex w-full md:w-auto gap-2">
          <input
            type="text"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            placeholder="Escribe una nueva tarea..."
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
          <button 
            type="submit"
            className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-500 transition-colors shadow-sm whitespace-nowrap"
          >
            + Añadir
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl z-50 font-bold animate-bounce text-sm text-center">
          {errorMsg}
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-x-auto pb-2">
        {renderColumn('red', '¡AHORA! (Peligro)', 'bg-red-500', 'bg-red-50')}
        {renderColumn('yellow', 'En Proceso', 'bg-yellow-400', 'bg-yellow-50')}
        {renderColumn('green', 'Ideas / Hecho', 'bg-green-500', 'bg-green-50')}
      </div>
    </div>
  );
};

export default TrafficLightSection;
