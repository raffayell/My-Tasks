import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Task, GroupType } from '../types';
import TaskCard from './TaskCard';
import { ArrowDownAZ, ArrowUpAZ, Clock, ArrowDown, ArrowUp, ListFilter, X, Folder } from 'lucide-react';

interface TaskColumnProps {
  title: string;
  groupId: GroupType;
  tasks: Task[];
  projectColors: Record<string, string>;
  onTaskClick: (task: Task) => void;
  onToggleDone: (task: Task) => void;
  onMoveTask: (taskId: number, newGroup: GroupType) => void;
  onDeleteTask: (taskId: number) => void;
}

const getHeaderStyles = (groupId: GroupType) => {
  switch (groupId) {
    case 'urgent':
      return 'border-red-500 text-red-700';
    case 'today':
      return 'border-cyan-500 text-cyan-700';
    case 'tomorrow':
      return 'border-green-500 text-green-700';
    case 'waiting':
      return 'border-orange-400 text-amber-700';
    case 'not-urgent':
      return 'border-slate-400 text-slate-500';
    case 'done':
      return 'border-emerald-500 text-emerald-700';
    default:
      return 'border-slate-400 text-slate-600';
  }
};

type SortKey = 'id' | 'title' | 'project';
type SortDirection = 'asc' | 'desc';

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  groupId, 
  tasks,
  projectColors, 
  onTaskClick, 
  onToggleDone,
  onMoveTask,
  onDeleteTask
}) => {
  const headerStyle = useMemo(() => getHeaderStyles(groupId), [groupId]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedTasks = useMemo(() => {
    if (!sortConfig) return tasks;

    return [...tasks].sort((a, b) => {
      if (sortConfig.key === 'title') {
        return sortConfig.direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortConfig.key === 'project') {
        return sortConfig.direction === 'asc'
          ? a.project.localeCompare(b.project)
          : b.project.localeCompare(a.project);
      } else {
        // Sort by ID (proxy for creation date)
        return sortConfig.direction === 'asc'
          ? a.id - b.id
          : b.id - a.id;
      }
    });
  }, [tasks, sortConfig]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onMoveTask(parseInt(taskId, 10), groupId);
    }
  };

  const handleSort = (key: SortKey, direction: SortDirection) => {
    setSortConfig({ key, direction });
    setIsMenuOpen(false);
  };

  const clearSort = () => {
    setSortConfig(null);
    setIsMenuOpen(false);
  };

  return (
    <div 
      className={`
        min-w-full md:min-w-[300px] md:max-w-[300px] rounded-lg p-3 flex flex-col gap-3 h-fit max-h-full 
        transition-all duration-300 ease-out 
        ${isDragOver ? 'bg-blue-50/80 ring-2 ring-blue-400 ring-inset scale-[1.01]' : 'bg-slate-200/80'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`font-bold px-2 py-3 flex justify-between items-center border-b-2 ${headerStyle} relative`}>
        <span className="text-sm uppercase tracking-wide truncate mr-2" title={title}>{title}</span>
        
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`
                p-1.5 rounded-md transition-all duration-200 
                ${sortConfig 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-500 hover:bg-black/5'
                }
              `}
              title="Sort tasks"
              aria-label="Sort tasks"
            >
              <ListFilter size={16} />
            </button>
            
            {/* Sort Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 bg-slate-50/50 tracking-wider">Sort by</div>
                
                <button 
                  onClick={() => handleSort('title', 'asc')} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${sortConfig?.key === 'title' && sortConfig.direction === 'asc' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600'}`}
                >
                  <ArrowDownAZ size={14} className={sortConfig?.key === 'title' && sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-slate-400'} /> 
                  Title (A-Z)
                </button>
                <button 
                  onClick={() => handleSort('title', 'desc')} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${sortConfig?.key === 'title' && sortConfig.direction === 'desc' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600'}`}
                >
                  <ArrowUpAZ size={14} className={sortConfig?.key === 'title' && sortConfig.direction === 'desc' ? 'text-blue-500' : 'text-slate-400'} /> 
                  Title (Z-A)
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button 
                  onClick={() => handleSort('project', 'asc')} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${sortConfig?.key === 'project' && sortConfig.direction === 'asc' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600'}`}
                >
                  <Folder size={14} className={sortConfig?.key === 'project' && sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-slate-400'} /> 
                  Project (A-Z)
                </button>
                <button 
                  onClick={() => handleSort('project', 'desc')} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${sortConfig?.key === 'project' && sortConfig.direction === 'desc' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600'}`}
                >
                  <Folder size={14} className={sortConfig?.key === 'project' && sortConfig.direction === 'desc' ? 'text-blue-500' : 'text-slate-400'} /> 
                  Project (Z-A)
                </button>
                
                <div className="border-t border-slate-100 my-1"></div>
                
                <button 
                  onClick={() => handleSort('id', 'desc')} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${sortConfig?.key === 'id' && sortConfig.direction === 'desc' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600'}`}
                >
                  <div className="flex items-center text-slate-400">
                     <Clock size={14} className="mr-0.5" />
                     <ArrowDown size={10} />
                  </div>
                  Newest First
                </button>
                <button 
                  onClick={() => handleSort('id', 'asc')} 
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors ${sortConfig?.key === 'id' && sortConfig.direction === 'asc' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600'}`}
                >
                  <div className="flex items-center text-slate-400">
                     <Clock size={14} className="mr-0.5" />
                     <ArrowUp size={10} />
                  </div>
                  Oldest First
                </button>
                
                {sortConfig && (
                  <>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                      onClick={clearSort} 
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <X size={14} /> Reset Sort
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          <span className="bg-white/60 px-2 py-0.5 rounded-full text-xs font-bold min-w-[24px] text-center shadow-sm text-slate-700">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1 pb-2" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {sortedTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            color={projectColors[task.project] || '#94a3b8'}
            onClick={onTaskClick}
            onToggleDone={onToggleDone}
            onDelete={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className={`
            text-center text-slate-400 text-xs py-8 italic pointer-events-none border-2 border-dashed border-slate-300 rounded-lg mx-1
            transition-all duration-300
            ${isDragOver ? 'bg-blue-100/50 border-blue-300 text-blue-500 scale-95' : ''}
          `}>
            {isDragOver ? 'Drop here' : 'No tasks'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;