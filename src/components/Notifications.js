// src/components/Notifications.js
'use client'
import { useNotification } from '@/contexts/NotificationContext'

export default function Notifications() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) return null

  const getNotificationStyles = (type) => {
    const baseStyles = "mb-3 p-4 rounded-lg shadow-lg text-white cursor-pointer transition-all duration-300 transform hover:scale-105"
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 hover:bg-green-600`
      case 'error':
        return `${baseStyles} bg-red-500 hover:bg-red-600`
      case 'warning':
        return `${baseStyles} bg-yellow-500 hover:bg-yellow-600`
      case 'info':
      default:
        return `${baseStyles} bg-blue-500 hover:bg-blue-600`
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 min-w-[300px] max-w-[400px]">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getNotificationStyles(notification.type)}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">{getIcon(notification.type)}</span>
            <div className="flex-1">
              {notification.title && (
                <h4 className="font-semibold text-sm mb-1">
                  {notification.title}
                </h4>
              )}
              <p className="text-sm">{notification.message}</p>
            </div>
            <button
              className="text-white/80 hover:text-white ml-2"
              onClick={(e) => {
                e.stopPropagation()
                removeNotification(notification.id)
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
