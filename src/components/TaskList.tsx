import React, { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Task } from '../types';
import { useTask } from '../context/TaskContext';
import TaskForm from './TaskForm';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const { deleteTask } = useTask();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  
  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };
  
  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
  };
  
  const closeEditForm = () => {
    setTaskToEdit(null);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDueDate = (dateString: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {task.title}
                </h3>
                <div className="mt-1 flex items-center">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    {formatDueDate(task.dueDate)}
                  </p>
                </div>
                {task.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              <div className="ml-6 flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {taskToEdit && (
        <TaskForm
          closeModal={closeEditForm}
          taskToEdit={{
            _id: taskToEdit._id,
            title: taskToEdit.title,
            description: taskToEdit.description,
            dueDate: taskToEdit.dueDate,
            status: taskToEdit.status,
          }}
        />
      )}
    </div>
  );
};

export default TaskList;