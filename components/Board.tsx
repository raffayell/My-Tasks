import React, { useState, useEffect } from 'react';
import { COLUMNS, PROJECTS, INITIAL_TASKS, DEFAULT_PROJECT_COLORS } from '../constants';
import TaskColumn from './TaskColumn';
import AddTaskModal from './AddTaskModal';
import AddProjectModal from './AddProjectModal';
import { Task, GroupType } from '../types';
import { Plus, Filter, ChevronDown, FolderPlus } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const Board: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Initialize from localStorage or defaults
  const [availableProjects, setAvailableProjects] = useState<string[]>(() => {
    const saved = localStorage.getItem('availableProjects');
    return saved ? JSON.parse(saved) : PROJECTS;
  });

  const [projectColors, setProjectColors] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('projectColors');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECT_COLORS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('All');
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);

  // Persist projects and colors whenever they change
  useEffect(() => {
    localStorage.setItem('availableProjects', JSON.stringify(availableProjects));
  }, [availableProjects]);

  useEffect(() => {
    localStorage.setItem('projectColors', JSON.stringify(projectColors));
  }, [projectColors]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        setIsBackendAvailable(true);
      } else {
        console.warn('Failed to fetch tasks from API, falling back to initial data.');
        setTasks(INITIAL_TASKS);
        setIsBackendAvailable(false);
      }
    } catch (error) {
      console.warn('Backend not available, falling back to initial data:', error);
      setTasks(INITIAL_TASKS);
      setIsBackendAvailable(false);
    }
  };

  const getTasksByGroup = (group: GroupType) => {
    return tasks.filter((task) => {
      const matchesGroup = task.group === group;
      const matchesProject = selectedProject === 'All' || task.project === selectedProject;
      return matchesGroup && matchesProject;
    });
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    // Optimistic / Local update first
    let newTask: Task;
    
    if (editingTask) {
      newTask = { ...taskData, id: editingTask.id };
      setTasks((prev) => 
        prev.map((t) => t.id === editingTask.id ? newTask : t)
      );
    } else {
      newTask = { ...taskData, id: Date.now() }; // Temp ID
      setTasks((prev) => [...prev, newTask]);
    }
    
    // Close modal immediately
    setIsModalOpen(false);
    setEditingTask(null);

    if (!isBackendAvailable) return;

    // Try backend
    try {
      if (editingTask) {
        await fetch(`${API_URL}/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });
      } else {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData), // Send without ID
        });
        if (response.ok) {
           const savedTask = await response.json();
           // Update the local state with the real ID from server
           setTasks(prev => prev.map(t => t.id === newTask.id ? savedTask : t));
        }
      }
    } catch (error) {
      console.error('Error saving task to backend (switching to offline mode):', error);
      setIsBackendAvailable(false);
    }
  };

  const handleSaveProject = (projectName: string, color: string) => {
    if (!availableProjects.includes(projectName)) {
      setAvailableProjects([...availableProjects, projectName]);
    }
    // Update color map
    setProjectColors(prev => ({
      ...prev,
      [projectName]: color
    }));
    setIsProjectModalOpen(false);
  };

  const handleToggleDone = async (task: Task) => {
    const newGroup: GroupType = task.group === 'done' ? 'today' : 'done';
    const updatedTask = { ...task, group: newGroup };

    // Optimistic update
    setTasks((prev) => 
      prev.map((t) => t.id === task.id ? updatedTask : t)
    );

    if (!isBackendAvailable) return;

    try {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
    } catch (error) {
      console.error('Error toggling task on backend (switching to offline mode):', error);
      setIsBackendAvailable(false);
    }
  };

  const handleMoveTask = async (taskId: number, newGroup: GroupType) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, group: newGroup };

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );

    if (!isBackendAvailable) return;

    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
    } catch (error) {
      console.error('Error moving task on backend (switching to offline mode):', error);
      setIsBackendAvailable(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    // Optimistic update
    // Use loose inequality (!=) to handle potential string/number ID mismatches from API
    setTasks((prev) => prev.filter((t) => t.id != taskId));

    if (!isBackendAvailable) return;

    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting task on backend (switching to offline mode):', error);
      setIsBackendAvailable(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 border-b border-slate-200 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Task Board</h2>
        
        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover:text-blue-500 transition-colors" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none cursor-pointer hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              <option value="All">All Projects</option>
              {availableProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm whitespace-nowrap"
          >
            <FolderPlus size={16} />
            <span>New Project</span>
          </button>

          <button 
            onClick={openNewTaskModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm whitespace-nowrap"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col md:flex-row gap-5 p-5 overflow-x-auto items-start h-full">
        {COLUMNS.map((col) => (
          <TaskColumn
            key={col.id}
            title={col.title}
            groupId={col.id}
            tasks={getTasksByGroup(col.id)}
            projectColors={projectColors}
            onTaskClick={handleTaskClick}
            onToggleDone={handleToggleDone}
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>

      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialData={editingTask}
        availableProjects={availableProjects}
      />
      
      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
};

export default Board;