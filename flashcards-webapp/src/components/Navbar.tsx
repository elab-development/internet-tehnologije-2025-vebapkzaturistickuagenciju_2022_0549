'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<{ role: string } | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="bg-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            TallyTravel
          </Link>

          <div className="flex space-x-4 items-center">
            <Link 
              href="/"
              className={`px-3 py-2 rounded-md ${
                isActive('/') ? 'bg-purple-700' : 'hover:bg-purple-500'
              }`}
            >
              Početna
            </Link>
            <Link 
              href="/arrangements"
              className={`px-3 py-2 rounded-md ${
                isActive('/arrangements') ? 'bg-purple-700' : 'hover:bg-purple-500'
              }`}
            >
              Aranžmani
            </Link>
            <Link 
              href="/login"
              className={`px-3 py-2 rounded-md ${
                isActive('/login') ? 'bg-purple-700' : 'hover:bg-purple-500'
              }`}
            >
              Prijava
            </Link>
            <Link 
              href="/register"
              className={`px-3 py-2 rounded-md ${
                isActive('/register') ? 'bg-purple-700' : 'hover:bg-purple-500'
              }`}
            >
              Registracija
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md hover:bg-purple-500"
            >
              Odjava
            </button>

            {(user?.role === 'AGENT' || user?.role === 'ADMIN') && (
              <Link 
                href="/agent"
                className={`px-3 py-2 rounded-md ${
                  isActive('/agent') ? 'bg-purple-700' : 'hover:bg-purple-500'
                }`}
                title="Upravljanje aranžmanima"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link 
                href="/admin"
                className={`px-3 py-2 rounded-md ${
                  isActive('/admin') ? 'bg-purple-700' : 'hover:bg-purple-500'
                }`}
                title="Admin panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}