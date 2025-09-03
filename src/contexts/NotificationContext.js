// src/contexts/NotificationContext.js
'use client'
import { createContext, useContext, useState, useRef } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timeoutRefs = useRef({})

  const addNotification = (notification) => {
    const id = Date.now().toString()
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
  }

  const removeNotification = (id) => {
    // Clear timeout if exists
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id])
      delete timeoutRefs.current[id]
    }

    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotification = () => {
    // Clear all timeouts
    Object.values(timeoutRefs.current).forEach(clearTimeout)
    timeoutRefs.current = {}
    setNotifications([])
  }

  // Helper methods
  const showSuccess = (message, options = {}) => 
    addNotification({ type: 'success', message, ...options })

  const showError = (message, options = {}) => 
    addNotification({ type: 'error', message, ...options })

  const showWarning = (message, options = {}) => 
    addNotification({ type: 'warning', message, ...options })

  const showInfo = (message, options = {}) => 
    addNotification({ type: 'info', message, ...options })

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
