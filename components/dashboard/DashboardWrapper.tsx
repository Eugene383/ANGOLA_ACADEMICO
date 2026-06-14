'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Menu } from 'lucide-react'

interface DashboardWrapperProps {
  children: React.ReactNode
  user: {
    email: string
    nome?: string | null
    role?: string | null
  }
}

export default function DashboardWrapper({ children, user }: DashboardWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm font-semibold text-gray-900">AngolaAcadémico</div>
          <div className="w-5" /> {/* Spacer for alignment */}
        </div>

        {/* Header */}
        <Header user={user} />
        
        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
