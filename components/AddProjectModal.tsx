import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { COLOR_PALETTE } from '../constants';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectName: string, color: string) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [projectName, setProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[6]); // Default to Blue

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    
    onSave(projectName.trim(), selectedColor);
    setProjectName('');
    setSelectedColor(COLOR_PALETTE[6]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">New Project</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="e.g., Mobile App"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
                    ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110 shadow-sm' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColor === color && <Check size={14} className="text-white drop-shadow-md" />}
                </button>
              ))}
            </div>
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
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;