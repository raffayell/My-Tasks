import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle, Circle, Trash2, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  color?: string;
  onClick: (task: Task) => void;
  onToggleDone: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  // Use a simple formatter
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const TaskCard: React.FC<TaskCardProps> = ({ task, color = '#3b82f6', onClick, onToggleDone, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isDone = task.group === 'done';

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger exit animation
    setIsDeleting(true);
    
    // Wait for animation to finish before actual delete
    setTimeout(() => {
      onDelete(task.id);
    }, 300);
  };

  const dateDisplay = formatDate(task.dueDate);
  
  // Check if overdue: strictly less than today's date (at 00:00:00)
  const isOverdue = task.dueDate 
    ? new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) 
    : false;

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(task)}
      className={`
        relative group rounded-xl p-4 border 
        transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
        cursor-grab active:cursor-grabbing
        animate-card-enter
        ${isDeleting ? 'opacity-0 scale-90 translate-y-4' : ''}
        ${isDone 
          ? 'bg-slate-50 border-slate-200 opacity-60 scale-[0.98] shadow-none' 
          : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-300/50'
        }
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`
            inline-block text-[10px] uppercase tracking-wider font-bold text-white px-2 py-0.5 rounded-full shadow-sm
            transition-opacity duration-300
            ${isDone ? 'opacity-50' : 'opacity-100'}
          `}
          style={{ backgroundColor: color }}
        >
          {task.project}
        </span>
        
        <div className="flex items-center gap-1 -mr-2 -mt-2">
          <button
            onClick={handleDelete}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleDone(task);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`
              transition-all duration-300 p-1 rounded-full 
              hover:bg-slate-100 active:scale-90
              ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}
            `}
            title={isDone ? "Mark as not done" : "Mark as done"}
          >
            {isDone ? <CheckCircle size={20} className="fill-current" /> : <Circle size={20} />}
          </button>
        </div>
      </div>
      
      <div className={`
        font-semibold text-slate-800 mb-1.5 text-sm transition-all duration-300
        ${isDone ? 'text-slate-500 line-through decoration-slate-300' : ''}
      `}>
        {task.title}
      </div>
      <div className={`
        text-xs text-slate-500 leading-relaxed transition-all duration-300 mb-2
        ${isDone ? 'opacity-70' : ''}
      `}>
        {task.desc}
      </div>

      {task.dueDate && (
        <div className={`
          flex items-center gap-1.5 text-[11px] font-medium mt-auto pt-1
          ${isDone 
            ? 'text-slate-400' 
            : isOverdue 
              ? 'text-red-500' 
              : 'text-slate-400'
          }
        `}>
          <Calendar size={12} className={isOverdue && !isDone ? 'text-red-500' : 'text-slate-400'} />
          <span>{dateDisplay}</span>
          {isOverdue && !isDone && (
            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded ml-auto">
              Overdue
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;