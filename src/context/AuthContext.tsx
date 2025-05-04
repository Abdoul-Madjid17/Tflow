import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User } from '../types';
import api from '../services/api';

// Define action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'REGISTER_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOADING' };

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from token on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Validate token
          const decoded = jwtDecode<{ id: string; email: string }>(token);
          const expTime = decoded.exp ? decoded.exp * 1000 : 0;
          
          if (expTime < Date.now()) {
            dispatch({ type: 'LOGOUT' });
            return;
          }
          
          // Set auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user profile
          const res = await api.get('/api/auth/profile');
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token,
              user: {
                id: res.data._id,
                name: res.data.name,
                email: res.data.email,
              },
            },
          });
        } catch (err) {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };
    
    loadUser();
  }, []);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOADING' });
      
      const res = await api.post('/api/auth/login', { email, password });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during login';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'LOADING' });
      
      const res = await api.post('/api/auth/register', { name, email, password });
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);