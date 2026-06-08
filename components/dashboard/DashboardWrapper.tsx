'use client'

import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardWrapperProps {
  children: React.ReactNode
  user: {
    email: string
    nome?: string | null
    role?: string | null
  }
}

export default function DashboardWrapper({ children, user }: DashboardWrapperProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
