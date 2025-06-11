

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current logged-in user info on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/v1/users/current-user', {
          withCredentials: true,
        });
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    console.log("HOLA");
    console.log(email,password);
    
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/users/login',
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.data);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setUser(null);
      setIsLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  // Register function (for new users)
  const register = async ({ fullName, email, password, role }) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        '/api/v1/users/register',
        { fullname: fullName, email, password, role },
        { withCredentials: true }
      );
      setUser(response.data.data);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setUser(null);
      setIsLoading(false);
      return {
        success: false,
        message:
          error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/v1/users/logout', null, { withCredentials: true });
    } catch (error) {
      // optionally handle error
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
