import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password) => {
    try {
      setError(null);
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Store new user
      users.push({ email, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after signup
      const user = { email };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (err) {
      setError(err.message || 'An error occurred during sign up');
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Store session
      const sessionUser = { email: user.email };
      localStorage.setItem('user', JSON.stringify(sessionUser));
      setUser(sessionUser);
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      localStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      setError(err.message || 'An error occurred during sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
