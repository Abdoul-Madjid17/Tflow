import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

// Define action types
type TaskAction =
  | { type: 'GET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TASK_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Define state type
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: true,
  error: null,
};

// Create context
const TaskContext = createContext<{
  state: TaskState;
  getTasks: () => Promise<void>;
  addTask: (task: TaskFormData) => Promise<void>;
  updateTask: (id: string, task: TaskFormData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearError: () => void;
}>({
  state: initialState,
  getTasks: async () => {},
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  clearError: () => {},
});

// Reducer function
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'GET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        loading: false,
      };
    case 'TASK_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { state: authState } = useAuth();

  // Load tasks on auth state change
  useEffect(() => {
    if (authState.isAuthenticated) {
      getTasks();
    } else {
      dispatch({ type: 'GET_TASKS', payload: [] });
    }
  }, [authState.isAuthenticated]);

  // Get all tasks
  const getTasks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const res = await api.get('/api/tasks');
      
      dispatch({ type: 'GET_TASKS', payload: res.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error fetching tasks';
      dispatch({ type: 'TASK_ERROR', payload: errorMessage });
    }
  };

  // Add a task
  const addTask = async (taskData: TaskFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const res = await api.post('/api/tasks', taskData);
      
      dispatch({ type: 'ADD_TASK', payload: res.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error adding task';
      dispatch({ type: 'TASK_ERROR', payload: errorMessage });
    }
  };

  // Update a task
  const updateTask = async (id: string, taskData: TaskFormData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const res = await api.put(`/api/tasks/${id}`, taskData);
      
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error updating task';
      dispatch({ type: 'TASK_ERROR', payload: errorMessage });
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      await api.delete(`/api/tasks/${id}`);
      
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error deleting task';
      dispatch({ type: 'TASK_ERROR', payload: errorMessage });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <TaskContext.Provider value={{ state, getTasks, addTask, updateTask, deleteTask, clearError }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook
export const useTask = () => useContext(TaskContext);