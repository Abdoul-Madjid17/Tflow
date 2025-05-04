import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { format } from 'date-fns';
import { ClipboardList, LogOut, Plus } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskStatusFilter from '../components/TaskStatusFilter';

const Dashboard: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: taskState } = useTask();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);
  
  // Filter tasks based on status filter
  const filteredTasks = currentFilter 
    ? taskState.tasks.filter(task => task.status === currentFilter)
    : taskState.tasks;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm font-medium text-gray-700">
                Welcome, {authState.user?.name}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
            <p className="text-sm text-gray-600">
              {format(new Date(), 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <TaskStatusFilter 
              currentFilter={currentFilter} 
              setCurrentFilter={setCurrentFilter} 
            />
            <button
              onClick={openForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </button>
          </div>
        </div>

        {/* Task List */}
        {taskState.loading ? (
          <div className="flex justify-center mt-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <TaskList tasks={filteredTasks} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {currentFilter 
                ? `You don't have any ${currentFilter} tasks. Change the filter or add a new task.`
                : 'Get started by adding your first task.'}
            </p>
            <div className="mt-6">
              <button
                onClick={openForm}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      {isFormOpen && <TaskForm closeModal={closeForm} />}
    </div>
  );
};

export default Dashboard;