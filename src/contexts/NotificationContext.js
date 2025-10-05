// src/contexts/NotificationContext.js
'use client'
import { createContext, useContext, useState, useRef, useCallback } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timeoutRefs = useRef({})

  // Use useCallback to memoize functions and prevent infinite re-renders
  const removeNotification = useCallback((id) => {
    // Clear timeout if exists
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id])
      delete timeoutRefs.current[id]
    }

    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString() + Math.random().toString(36) // Better unique ID
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto remove after duration (with proper cleanup)
    if (newNotification.duration > 0) {
      timeoutRefs.current[id] = setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [removeNotification])

  const clearAllNotification = useCallback(() => {
    // Clear all timeouts
    Object.values(timeoutRefs.current).forEach(clearTimeout)
    timeoutRefs.current = {}
    setNotifications([])
  }, [])

  // Helper methods - memoized to prevent re-renders
  const showSuccess = useCallback((message, options = {}) => 
    addNotification({ type: 'success', message, ...options }), [addNotification])

  const showError = useCallback((message, options = {}) => 
    addNotification({ type: 'error', message, ...options }), [addNotification])

  const showWarning = useCallback((message, options = {}) => 
    addNotification({ type: 'warning', message, ...options }), [addNotification])

  const showInfo = useCallback((message, options = {}) => 
    addNotification({ type: 'info', message, ...options }), [addNotification])

  // Memoize the context value to prevent unnecessary re-renders
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
