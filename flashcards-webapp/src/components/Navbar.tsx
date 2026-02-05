'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-purple-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            TallyTravel
          </Link>

          <div className="flex space-x-4">
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
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/'
              }}
              className="px-3 py-2 rounded-md hover:bg-purple-500"
            >
              Odjava
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}