// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Mock users for demonstration
// const mockUsers = [
//   {
//     id: '1',
//     name: 'John Admin',
//     email: 'admin@iot.com',
//     role: 'admin',
//     avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150&h=150&fit=crop&crop=face'
//   },
//   {
//     id: '2',
//     name: 'Sarah Operator',
//     email: 'operator@iot.com',
//     role: 'operator',
//     avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=150&h=150&fit=crop&crop=face'
//   },
//   {
//     id: '3',
//     name: 'Tom Viewer',
//     email: 'viewer@iot.com',
//     role: 'viewer',
//     avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=150&h=150&fit=crop&crop=face'
//   }
// ];

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('iot_user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     setIsLoading(true);

//     await new Promise(resolve => setTimeout(resolve, 1000));

//     const foundUser = mockUsers.find(u => u.email === email);
//     if (foundUser && password === 'password') {
//       setUser(foundUser);
//       localStorage.setItem('iot_user', JSON.stringify(foundUser));
//       setIsLoading(false);
//       return true;
//     }

//     setIsLoading(false);
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('iot_user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(undefined);
const url="http://localhost:8000"

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
        const response = await axios.get(`${url}/api/v1/users/current-user`, {
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
    
      const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/v1/users/login`,
        { email, password },
        { withCredentials: true },config
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
          `${url}/api/v1/users/register`,
        { name: fullName, email, password, role },
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
      await axios.post(`${url}/api/v1/users/logout`, null, { withCredentials: true });
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
