// src/contexts/AuthContext.js
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '@/services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password })
      const { token, user } = response.data
      
      // Save to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data || 'Login failed'
      }
    }
  }

    // Register function
    const register = async (userData) => {
        try {
            const response = await authService.register(userData)
            
            // Extract data from Spring Boot response (same format as login)
            const { token, user } = response.data
            
            // Save to localStorage
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            
            setUser(user)
            return { success: true, user }
        } catch (error) {
            return { 
            success: false, 
            error: error.response?.data?.message || error.response?.data || 'Registration failed'
            }
        }
    }

   const googleLoginBackend = async (idToken) => {
    try {
      setLoading(true);
      
      // Call the service with just the data - authService handles the HTTP details
      console.log(idToken);
      const response = await authService.googleLogin({ idToken });
      
      // authService.googleLogin returns the axios response, data is in response.data
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        // setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: 'Google login failed' };
      }
    } catch (error) {
      console.error('Google login error:', error);
      // Handle axios error response
      const errorMessage = error.response?.data?.message || error.message || 'Network error occurred';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data) =>{
    try {
        const response = await authService.forgotPassword(data)
        return { success: true}
    } catch (error) {
        return { 
        success: false, 
        error: 'Failed'
        }
    }
  }





  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    googleLoginBackend,
    forgotPassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
