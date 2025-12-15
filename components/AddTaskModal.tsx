import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { COLUMNS, PROJECTS } from '../constants';
import { GroupType, ProjectType, Task } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { title: string; desc: string; project: ProjectType | string; group: GroupType; dueDate?: string }) => void;
  initialData?: Task | null;
  availableProjects?: string[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onSave, initialData, availableProjects }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  
  // Use availableProjects if provided, otherwise fallback to constant PROJECTS
  const projectsList = availableProjects && availableProjects.length > 0 ? availableProjects : PROJECTS;
  
  const [project, setProject] = useState<string>(projectsList[0]);
  const [group, setGroup] = useState<GroupType>('today');
  const [dueDate, setDueDate] = useState('');

  // Reset or populate form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDesc(initialData.desc);
        setProject(initialData.project as string);
        setGroup(initialData.group);
        setDueDate(initialData.dueDate || '');
      } else {
        setTitle('');
        setDesc('');
        setProject(projectsList[0]);
        setGroup('today');
        setDueDate('');
      }
    }
  }, [isOpen, initialData, projectsList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      title,
      desc,
      project,
      group,
      dueDate: dueDate || undefined
    });
    
    onClose();
  };

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g., Update Landing Page"
              required
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-24"
              placeholder="Add details..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {projectsList.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">Column</label>
              <select
                id="group"
                value={group}
                onChange={(e) => setGroup(e.target.value as GroupType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                {COLUMNS.map(c => (
                  <option key={c.id} value={c.id}>{c.title.split('/')[0].trim()}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
            >
              {isEditing ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;