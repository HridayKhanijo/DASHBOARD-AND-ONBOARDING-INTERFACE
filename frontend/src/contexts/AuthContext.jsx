import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockToken = `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`;
      const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');

      const user = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstName: onboardingData.firstName || 'User',
        lastName: onboardingData.lastName || '',
        isOnboarded: !!onboardingData.companyName,
        company: onboardingData.companyName ? {
          name: onboardingData.companyName,
          industry: onboardingData.industry,
          size: onboardingData.companySize
        } : null,
        preferences: onboardingData.preferences || { theme: 'light', layout: 'default' },
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage and state
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(mockToken);
      setCurrentUser(user);

      // Navigate after state is updated
      const redirectPath = user.isOnboarded ? '/dashboard' : '/onboarding';
      navigate(redirectPath, { replace: true });
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockToken = `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isOnboarded: false,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(mockToken);
      setCurrentUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...currentUser, ...userData, isOnboarded: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
