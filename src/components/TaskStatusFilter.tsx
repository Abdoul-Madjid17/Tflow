import React from 'react';

interface TaskStatusFilterProps {
  currentFilter: string | null;
  setCurrentFilter: (filter: string | null) => void;
}

const TaskStatusFilter: React.FC<TaskStatusFilterProps> = ({ currentFilter, setCurrentFilter }) => {
  const filters = [
    { value: null, label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];
  
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
      {filters.map((filter) => (
        <button
          key={filter.label}
          onClick={() => setCurrentFilter(filter.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            (currentFilter === filter.value) 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-gray-700 hover:text-indigo-600'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TaskStatusFilter;