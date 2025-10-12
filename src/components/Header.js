'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ProfilePictureImage from './ProfilePictureImage'

export default function Header({ user, handleLogout, isLoggingOut }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Sessions', href: '/sessions', icon: '🎵' },
    { name: 'Musicians', href: '/musicians', icon: '👥' },
    { name: 'Participations', href: '/participations', icon: '👥' },
  ]

  const isActive = (path) => pathname === path

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false)
  }, [pathname])

  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                🎵 JamConnect
              </h1>
            </Link>
          </div>

          {/* User Menu with Dropdown */}
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            <Link
              href="/profile"
              className="hidden sm:flex items-center gap-2 group"
            >
              <div className="relative">
                <ProfilePictureImage
                  publicId={user?.profilePictureId}
                  name={user?.name}
                  size="sm"
                  alt="Profile Picture"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors hidden md:block">
                {user?.name}
              </span>
            </Link>

            {/* Menu Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 group"
              >
                <svg
                  className={`w-5 h-5 text-gray-300 group-hover:text-white transition-all duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                  {/* User Info Section (Mobile Only) */}
                  <div className="sm:hidden p-4 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-purple-600/10">
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <ProfilePictureImage
                        publicId={user?.profilePictureId}
                        name={user?.name}
                        size="sm"
                        alt="Profile"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400">View Profile</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-2">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-orange-500/20 to-purple-600/20 text-white border-l-4 border-orange-500'
                            : 'text-gray-300 hover:text-white hover:bg-white/10 border-l-4 border-transparent'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm font-medium flex-1">{item.name}</span>
                        {isActive(item.href) && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Logout Button */}
                  <div className="p-3">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        handleLogout()
                      }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20"
                    >
                      {isLoggingOut ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Logging out...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
