"use client";

import React, { useState } from 'react';
import { Task } from '../../../lib/wihgo/types';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  Trash2
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  onAddTask: (task: Task) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddTask
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title,
      description,
      platform: 'whatsapp',
      priority,
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      category: 'General'
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Actionable Tasks</span>
            <CheckSquare className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-xs text-slate-400">Cross-platform action items extracted from chats and emails</p>
        </div>

        <button
          id="btn-add-task"
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 text-center">
            <p className="text-sm font-bold text-white">No tasks yet</p>
            <p className="text-xs text-slate-400 mt-1">Add your first task with the New Task button above.</p>
          </div>
        )}
        {tasks.map((t) => (
          <div
            key={t.id}
            onClick={() => onToggleTask(t.id)}
            className={`p-4 rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-start gap-3.5 ${
              t.completed
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : 'bg-slate-900/80 border-indigo-500/15 hover:border-emerald-500/30'
            }`}
          >
            {onDeleteTask && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteTask(t.id); }}
                className="mt-0.5 text-slate-500 hover:text-red-400"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button className="mt-0.5 text-emerald-400">
              {t.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-slate-600" />}
            </button>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {t.title}
                </span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    t.priority === 'high'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {t.priority}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-[#0B0F19] border border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Create New Task</h3>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Follow up on Q3 proposal"
                className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
