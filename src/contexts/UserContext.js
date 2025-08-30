'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '@/services/userService'
import { useAuth } from './AuthContext'

const UserContext = createContext()

export function UserProvider({ children }) {
  const { isAuthenticated, user: authUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      fetchProfile()
    } else {
      setProfile(null)
    }
  }, [isAuthenticated, authUser])

  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.getProfile()
      setProfile(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.updateProfile(profileData)
      setProfile(response.data)
      
      // Update user in localStorage if needed
      const updatedUser = { ...authUser, ...response.data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    clearError
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
