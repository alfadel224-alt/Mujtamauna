
import React, { useState } from 'react';
import { Task, Language } from '../types';
import { UI_TEXT } from '../constants';

interface TaskBoardProps {
  tasks: Task[];
  lang: Language;
  onUpdateStatus: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, lang, onUpdateStatus, onDelete, onAddTask }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as Task['priority'] });

  const columns: { id: Task['status']; label: string; color: string }[] = [
    { id: 'todo', label: UI_TEXT[lang].todo, color: 'bg-slate-100 border-slate-200' },
    { id: 'in-progress', label: UI_TEXT[lang].inProgress, color: 'bg-indigo-50 border-indigo-100' },
    { id: 'done', label: UI_TEXT[lang].done, color: 'bg-green-50 border-green-100' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      onAddTask({
        ...newTask,
        status: 'todo',
      });
      setNewTask({ title: '', description: '', priority: 'medium' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{UI_TEXT[lang].tasks}</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          {UI_TEXT[lang].newTask} +
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto min-h-0 pb-4">
        {columns.map(col => (
          <div key={col.id} className={`flex flex-col rounded-2xl border min-w-[300px] ${col.color}`}>
            <div className="p-4 flex justify-between items-center border-b bg-white/50 rounded-t-2xl">
              <h3 className="font-bold flex items-center space-x-2 space-x-reverse">
                <span>{col.label}</span>
                <span className="bg-white/80 px-2 py-0.5 rounded text-xs text-gray-500 shadow-sm">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </h3>
            </div>
            
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-indigo-300 transition-all cursor-grab active:cursor-grabbing group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {task.priority}
                    </span>
                    <button 
                      onClick={() => onDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 leading-tight">{task.title}</h4>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="flex gap-1">
                    {columns.map(c => c.id !== task.status && (
                      <button
                        key={c.id}
                        onClick={() => onUpdateStatus(task.id, c.id)}
                        className="text-[10px] bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 px-2 py-1 rounded transition-colors border text-gray-500"
                      >
                        Move to {c.id === 'todo' ? UI_TEXT[lang].todo : c.id === 'in-progress' ? UI_TEXT[lang].inProgress : UI_TEXT[lang].done}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{UI_TEXT[lang].newTask}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTask.title}
                  onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                  value={newTask.description}
                  onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                <select 
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTask.priority}
                  onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
